/**
 * POST /api/ghl/quiz-start
 * ────────────────────────────────────────────────────────────────────────────
 * Fired when the visitor BEGINS the quiz. Adds the "Quiz Started" tag to the
 * existing contact (matched by email), so you can see who opened the quiz but
 * didn't finish. Fire-and-forget from the frontend — non-blocking.
 * ────────────────────────────────────────────────────────────────────────────
 */
import { addTagsByEmail } from '../../services/ghl.js'

export const config = { path: '/api/ghl/quiz-start' }

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } })

const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const email = (body?.email || '').trim().toLowerCase()
  if (!isEmail(email)) return json({ success: false, error: 'A valid email is required' }, 400)

  const tag = process.env.GHL_TAG_QUIZ_STARTED
  if (!tag) return json({ success: true, skipped: 'GHL_TAG_QUIZ_STARTED not set' })

  try {
    const res = await addTagsByEmail(email, [tag])
    return json({ success: true, contactId: res.id || null })
  } catch (err) {
    console.error('[api/ghl/quiz-start]', err?.message, err?.data || '')
    return json({ success: false, error: 'Could not tag quiz start' }, 502)
  }
}
