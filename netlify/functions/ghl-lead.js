/**
 * POST /api/ghl/lead
 * ────────────────────────────────────────────────────────────────────────────
 * Opt-in form handler. Receives { name, email, town }, creates/updates the GHL
 * contact, tags it as an opt-in lead, and stamps the funnel source.
 *
 * Netlify Function (v2). `config.path` maps it to the clean /api/ghl/lead URL,
 * so the browser never sees /.netlify/functions/... and the API key stays here
 * on the server — never in frontend code.
 * ────────────────────────────────────────────────────────────────────────────
 */
import { createOrUpdateContact } from '../../services/ghl.js'

export const config = { path: '/api/ghl/lead' }

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const name = (body?.name || '').trim()
  const email = (body?.email || '').trim().toLowerCase()
  const town = (body?.town || '').trim()

  // ── Validate required fields ──
  if (!name || !email || !town) {
    return json({ success: false, error: 'name, email and town are required' }, 400)
  }
  if (!isEmail(email)) {
    return json({ success: false, error: 'Please enter a valid email address' }, 400)
  }

  try {
    // Funnel source value saved to the funnel-source custom field.
    // Override per client with GHL_FUNNEL_SOURCE in .env.
    const source = process.env.GHL_FUNNEL_SOURCE || 'Bathroom Website Template Funnel'

    // Opt-in tag, e.g. "Bathroom Template Lead" (from GHL_TAG_OPTIN).
    const tags = process.env.GHL_TAG_OPTIN ? [process.env.GHL_TAG_OPTIN] : []

    const contact = await createOrUpdateContact({ name, email, town, source, tags })

    return json({ success: true, contactId: contact?.id || null })
  } catch (err) {
    // Log server-side for debugging; return a generic message to the client.
    console.error('[api/ghl/lead]', err?.message, err?.data || '')
    return json({ success: false, error: 'Could not save your details. Please try again.' }, 502)
  }
}
