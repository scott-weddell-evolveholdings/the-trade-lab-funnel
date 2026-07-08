/**
 * services/handlers.js
 * ────────────────────────────────────────────────────────────────────────────
 * Platform-agnostic route logic. Each handler takes a plain parsed request body
 * and returns `{ status, body }` — no framework/HTTP objects. Thin adapters for
 * Netlify (Request/Response) and Vercel (req/res) both call these, so the two
 * deployments can never drift apart.
 *
 * SERVER-SIDE ONLY (imports services/ghl.js, which uses the private API key).
 * ────────────────────────────────────────────────────────────────────────────
 */
import {
  createOrUpdateContact,
  updateContactWithQuiz,
  createOpportunity,
  addNote,
  formatQuizNote,
  addTagsByEmail,
} from './ghl.js'

const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const clean = (v) => (v || '').toString().trim()

/** POST /api/ghl/lead — opt-in. */
export async function handleLead(body = {}) {
  const name = clean(body.name)
  const email = clean(body.email).toLowerCase()
  const town = clean(body.town)

  if (!name || !email || !town) {
    return { status: 400, body: { success: false, error: 'name, email and town are required' } }
  }
  if (!isEmail(email)) {
    return { status: 400, body: { success: false, error: 'Please enter a valid email address' } }
  }

  try {
    // Funnel source saved to the funnel-source custom field (override via GHL_FUNNEL_SOURCE).
    const source = process.env.GHL_FUNNEL_SOURCE || 'Bathroom Website Template Funnel'
    const tags = process.env.GHL_TAG_OPTIN ? [process.env.GHL_TAG_OPTIN] : []

    const contact = await createOrUpdateContact({ name, email, town, source, tags })
    return { status: 200, body: { success: true, contactId: contact?.id || null } }
  } catch (err) {
    console.error('[ghl/lead]', err?.message, err?.data || '')
    return { status: 502, body: { success: false, error: 'Could not save your details. Please try again.' } }
  }
}

/** POST /api/ghl/quiz-start — quiz opened → "Quiz Started" tag. */
export async function handleQuizStart(body = {}) {
  const email = clean(body.email).toLowerCase()
  if (!isEmail(email)) {
    return { status: 400, body: { success: false, error: 'A valid email is required' } }
  }

  const tag = process.env.GHL_TAG_QUIZ_STARTED
  if (!tag) return { status: 200, body: { success: true, skipped: 'GHL_TAG_QUIZ_STARTED not set' } }

  try {
    const res = await addTagsByEmail(email, [tag])
    return { status: 200, body: { success: true, contactId: res.id || null } }
  } catch (err) {
    console.error('[ghl/quiz-start]', err?.message, err?.data || '')
    return { status: 502, body: { success: false, error: 'Could not tag quiz start' } }
  }
}

/** POST /api/ghl/quiz — quiz completion. */
export async function handleQuiz(body = {}) {
  const email = clean(body.email).toLowerCase()
  if (!isEmail(email)) {
    return { status: 400, body: { success: false, error: 'A valid email is required' } }
  }

  const payload = {
    email,
    name: clean(body.name),
    town: clean(body.town),
    quizResponses: body.quizResponses && typeof body.quizResponses === 'object' ? body.quizResponses : {},
    quizResult: body.quizResult || '',
    serviceInterest: body.serviceInterest || '',
    leadIntent: body.leadIntent || '',
    // Service tag on top of Quiz Completed / High Intent / {town} Lead.
    tags: [process.env.GHL_TAG_SERVICE || 'Bathroom Remodel Lead'],
  }

  try {
    const contact = await updateContactWithQuiz(payload)
    await addNote(contact.id, formatQuizNote(payload))
    const opportunity = await createOpportunity(contact.id, {
      name: payload.name,
      serviceInterest: payload.serviceInterest,
      leadIntent: payload.leadIntent,
    })
    return {
      status: 200,
      body: {
        success: true,
        contactId: contact.id,
        tags: contact.tags,
        opportunity: opportunity?.skipped ? null : opportunity,
      },
    }
  } catch (err) {
    console.error('[ghl/quiz]', err?.message, err?.data || '')
    return { status: 502, body: { success: false, error: 'Could not save quiz results.' } }
  }
}
