/**
 * services/ghl.js
 * ────────────────────────────────────────────────────────────────────────────
 * Reusable GoHighLevel (LeadConnector API v2) integration.
 *
 * This module is deliberately framework-agnostic and pure — it only reads
 * `process.env` and calls the GHL REST API with the global `fetch`. Drop it into
 * a Netlify Function, an Express route, a Next.js API route, etc.
 *
 * ⚠️  SERVER-SIDE ONLY. Never import this file from frontend/browser code — it
 *     uses your private GHL API key. The browser talks to /api/ghl/* instead.
 *
 * REUSE FOR ANOTHER CLIENT: change nothing in this file. Every client-specific
 * value (API key, location, custom-field IDs, tags, pipeline/stage) comes from
 * environment variables. Give each client/sub-account its own .env and you're
 * done. See GHL-INTEGRATION.md.
 * ────────────────────────────────────────────────────────────────────────────
 */

const API_BASE = process.env.GHL_API_BASE_URL || 'https://services.leadconnectorhq.com'
const API_VERSION = process.env.GHL_API_VERSION || '2021-07-28'

/** Standard headers for every GHL v2 request. */
function ghlHeaders() {
  const key = process.env.GHL_API_KEY
  if (!key) throw new Error('GHL_API_KEY is not set')
  return {
    Authorization: `Bearer ${key}`,
    Version: API_VERSION,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

/** Thin fetch wrapper: adds headers, parses JSON, throws a rich error on !ok. */
async function ghlFetch(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: ghlHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }

  if (!res.ok) {
    const err = new Error(
      `GHL ${method} ${path} failed (${res.status}): ${data?.message || data?.error || text || 'unknown error'}`
    )
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

/**
 * Build a single { id, value } custom-field entry from an env-configured field ID.
 * Returns null (and is filtered out) when the field ID or the value is missing,
 * so unconfigured fields are simply skipped instead of erroring.
 *
 * @param {string} envKey  e.g. 'GHL_FIELD_TOWN'
 * @param {*}      value
 */
function customField(envKey, value) {
  const id = process.env[envKey]
  if (!id || value === undefined || value === null || value === '') return null
  return { id, value: String(value) }
}

const locationId = () => {
  const id = process.env.GHL_LOCATION_ID
  if (!id) throw new Error('GHL_LOCATION_ID is not set')
  return id
}

/**
 * Look up a contact by email within the configured location.
 * Uses GHL's duplicate-search endpoint (built for exactly this).
 * @returns {Promise<object|null>} the contact, or null if none exists.
 */
export async function findContactByEmail(email) {
  const qs = new URLSearchParams({ locationId: locationId(), email }).toString()
  try {
    const data = await ghlFetch(`/contacts/search/duplicate?${qs}`, { method: 'GET' })
    return data.contact || (Array.isArray(data.contacts) ? data.contacts[0] : null) || null
  } catch (err) {
    // 404/400 from the search endpoint just means "no match" — treat as null.
    if (err.status === 404 || err.status === 400) return null
    throw err
  }
}

/**
 * 1) createOrUpdateContact(data)
 * Search by email → update if found, create if not.
 *
 * @param {object} data
 * @param {string} data.name           Full name ("Mark Thompson")
 * @param {string} data.email          Required — the identity key
 * @param {string} [data.town]         Saved to standard `city` + the town custom field
 * @param {string} [data.source]       Funnel source (saved to the funnel-source custom field)
 * @param {string[]} [data.tags]       Tags to add (merged, never removed)
 * @param {Array<{id:string,value:string}>} [data.customFields]  Extra custom fields
 * @returns {Promise<object>} the GHL contact ({ id, ... })
 */
export async function createOrUpdateContact(data) {
  const { name = '', email, town, source, tags = [], customFields: extraFields = [] } = data
  if (!email) throw new Error('email is required')

  const [firstName, ...rest] = name.trim().split(/\s+/).filter(Boolean)
  const lastName = rest.join(' ')

  const customFields = [
    customField('GHL_FIELD_TOWN', town),
    customField('GHL_FIELD_FUNNEL_SOURCE', source),
    ...extraFields,
  ].filter(Boolean)

  const existing = await findContactByEmail(email)

  const core = {
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    name: name || undefined,
    email,
    ...(town ? { city: town } : {}),
    ...(source ? { source } : {}),
    ...(customFields.length ? { customFields } : {}),
  }

  let contact
  if (existing?.id) {
    // Update. locationId is not allowed in the update body.
    const res = await ghlFetch(`/contacts/${existing.id}`, { method: 'PUT', body: core })
    contact = res.contact || { id: existing.id }
  } else {
    const res = await ghlFetch('/contacts/', { method: 'POST', body: { locationId: locationId(), ...core } })
    contact = res.contact || res
  }

  // Apply tags via the dedicated endpoint so they always MERGE (create/update
  // bodies don't reliably merge tags across API versions).
  if (tags.length && contact?.id) {
    await addTags(contact.id, tags)
  }

  return contact
}

/**
 * 2) updateContactWithQuiz(data)
 * Find the same contact by email, save quiz answers to custom fields, and add
 * quiz/town/intent tags. If the contact somehow doesn't exist yet, it's created
 * so the quiz data is never lost.
 *
 * @param {object} data
 * @param {string} data.email                 Required
 * @param {string} [data.name]
 * @param {string} [data.town]
 * @param {Object<string,string>} [data.quizResponses]  Ordered map of Q→A
 * @param {string} [data.quizResult]
 * @param {string} [data.serviceInterest]
 * @param {string} [data.leadIntent]           e.g. "High" | "Medium" | "Low"
 * @param {string[]} [data.tags]               Extra tags (e.g. a service tag)
 * @returns {Promise<{id:string, tags:string[]}>}
 */
export async function updateContactWithQuiz(data) {
  const { email } = data
  if (!email) throw new Error('email is required')

  let contact = await findContactByEmail(email)
  if (!contact?.id) {
    // No opt-in on record — create a minimal contact so quiz data still saves.
    contact = await createOrUpdateContact({
      name: data.name,
      email,
      town: data.town,
      source: process.env.GHL_FUNNEL_SOURCE || 'Quiz',
    })
  }
  const contactId = contact.id

  // Map the first three quiz answers → the three response custom fields.
  const responses = Object.values(data.quizResponses || {})
  const customFields = [
    customField('GHL_FIELD_QUIZ_RESPONSE_1', responses[0]),
    customField('GHL_FIELD_QUIZ_RESPONSE_2', responses[1]),
    customField('GHL_FIELD_QUIZ_RESPONSE_3', responses[2]),
    customField('GHL_FIELD_QUIZ_RESULT', data.quizResult),
    customField('GHL_FIELD_SERVICE_INTEREST', data.serviceInterest),
    customField('GHL_FIELD_LEAD_INTENT', data.leadIntent),
    customField('GHL_FIELD_TOWN', data.town),
  ].filter(Boolean)

  if (customFields.length) {
    await ghlFetch(`/contacts/${contactId}`, { method: 'PUT', body: { customFields } })
  }

  // Tags: base quiz tags + dynamic town/intent + any extra tags from the caller.
  const tags = buildQuizTags(data)
  await addTags(contactId, tags)

  return { id: contactId, tags }
}

/** Assemble the quiz tag list from env + dynamic (town / intent) + caller extras. */
function buildQuizTags({ town, leadIntent, tags = [] }) {
  const out = new Set(tags.filter(Boolean))

  if (process.env.GHL_TAG_QUIZ_COMPLETED) out.add(process.env.GHL_TAG_QUIZ_COMPLETED)

  // Intent-based tag, e.g. "High Intent Lead"
  if (leadIntent && /^high$/i.test(String(leadIntent)) && process.env.GHL_TAG_HIGH_INTENT) {
    out.add(process.env.GHL_TAG_HIGH_INTENT)
  }

  // Dynamic town-based tag, e.g. "Manchester Lead"
  if (town) out.add(`${String(town).trim()} Lead`)

  return [...out]
}

/**
 * 3) addTags(contactId, tags)
 * Adds (merges) tags on a contact. Adding an existing tag is a no-op in GHL.
 */
export async function addTags(contactId, tags = []) {
  const clean = [...new Set((tags || []).filter(Boolean))]
  if (!contactId || clean.length === 0) return { tags: [] }
  return ghlFetch(`/contacts/${contactId}/tags`, { method: 'POST', body: { tags: clean } })
}

/**
 * Convenience: add tags to a contact identified by email (looks it up first).
 * Used by the "quiz started" ping. No-op if the contact isn't found yet.
 */
export async function addTagsByEmail(email, tags = []) {
  if (!email) throw new Error('email is required')
  const contact = await findContactByEmail(email)
  if (!contact?.id) return { skipped: true, reason: 'contact not found' }
  await addTags(contact.id, tags)
  return { id: contact.id, tags: [...new Set((tags || []).filter(Boolean))] }
}

/**
 * 4) createOpportunity(contactId, data)
 * Only runs when BOTH GHL_PIPELINE_ID and GHL_STAGE_ID are configured — otherwise
 * it's skipped silently (returns { skipped: true }).
 *
 * @param {string} contactId
 * @param {object} data
 * @param {string} [data.name]             Contact name (used to build the title)
 * @param {string} [data.serviceInterest]  Stored on the contact + surfaced in notes
 * @param {string} [data.leadIntent]
 * @param {number} [data.monetaryValue]
 * @param {string} [data.status]           default 'open'
 */
export async function createOpportunity(contactId, data = {}) {
  const pipelineId = process.env.GHL_PIPELINE_ID
  const stageId = process.env.GHL_STAGE_ID
  if (!pipelineId || !stageId) {
    return { skipped: true, reason: 'GHL_PIPELINE_ID / GHL_STAGE_ID not configured' }
  }
  if (!contactId) return { skipped: true, reason: 'no contactId' }

  // Name format: "{name} - Bathroom Funnel Lead" (suffix overridable per client).
  const suffix = process.env.GHL_OPPORTUNITY_NAME_SUFFIX || 'Bathroom Funnel Lead'
  const name = `${data.name || 'New Lead'} - ${suffix}`

  const body = {
    locationId: locationId(),
    pipelineId,
    pipelineStageId: stageId,
    contactId,
    name,
    status: data.status || 'open',
    ...(Number.isFinite(data.monetaryValue) ? { monetaryValue: data.monetaryValue } : {}),
  }

  const res = await ghlFetch('/opportunities/', { method: 'POST', body })
  return res.opportunity || res
}

/**
 * 5) addNote(contactId, note)
 * Attaches a free-text note to the contact (used for the full quiz summary).
 */
export async function addNote(contactId, note) {
  if (!contactId || !note) return { skipped: true }
  const res = await ghlFetch(`/contacts/${contactId}/notes`, { method: 'POST', body: { body: note } })
  return res.note || res
}

/**
 * Helper: build a readable multi-line note from a quiz submission.
 * Kept here so any backend/route can reuse the same formatting.
 */
export function formatQuizNote({ name, town, quizResponses = {}, quizResult, serviceInterest, leadIntent } = {}) {
  const lines = ['📋 Quiz completed — Bathroom Funnel']
  if (name) lines.push(`Name: ${name}`)
  if (town) lines.push(`Town: ${town}`)
  if (serviceInterest) lines.push(`Service interest: ${serviceInterest}`)
  if (leadIntent) lines.push(`Lead intent: ${leadIntent}`)
  if (quizResult) lines.push(`Result: ${quizResult}`)

  const entries = Object.entries(quizResponses)
  if (entries.length) {
    lines.push('', 'Responses:')
    for (const [q, a] of entries) lines.push(`• ${q}: ${a}`)
  }
  return lines.join('\n')
}
