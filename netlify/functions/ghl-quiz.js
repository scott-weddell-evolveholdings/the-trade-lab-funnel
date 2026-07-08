/**
 * POST /api/ghl/quiz
 * ────────────────────────────────────────────────────────────────────────────
 * Quiz completion handler. Receives the full quiz payload, updates the SAME
 * contact (matched by email), saves quiz answers to custom fields, applies
 * quiz/intent/town tags, writes a summary note, and — if a pipeline + stage are
 * configured — creates an opportunity.
 *
 * Netlify Function (v2). `config.path` maps it to /api/ghl/quiz.
 * ────────────────────────────────────────────────────────────────────────────
 */
import { updateContactWithQuiz, createOpportunity, addNote, formatQuizNote } from '../../services/ghl.js'

export const config = { path: '/api/ghl/quiz' }

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

  const email = (body?.email || '').trim().toLowerCase()
  if (!isEmail(email)) {
    return json({ success: false, error: 'A valid email is required' }, 400)
  }

  const payload = {
    email,
    name: (body?.name || '').trim(),
    town: (body?.town || '').trim(),
    quizResponses: body?.quizResponses && typeof body.quizResponses === 'object' ? body.quizResponses : {},
    quizResult: body?.quizResult || '',
    serviceInterest: body?.serviceInterest || '',
    leadIntent: body?.leadIntent || '',
    // Service tag added on top of Quiz Completed / High Intent / {town} Lead.
    // Override per client with GHL_TAG_SERVICE in .env.
    tags: [process.env.GHL_TAG_SERVICE || 'Bathroom Remodel Lead'],
  }

  try {
    // 1) Update the contact with quiz custom fields + tags.
    const contact = await updateContactWithQuiz(payload)

    // 2) Attach a human-readable note with the full quiz summary.
    await addNote(contact.id, formatQuizNote(payload))

    // 3) Create an opportunity — no-op unless GHL_PIPELINE_ID + GHL_STAGE_ID set.
    const opportunity = await createOpportunity(contact.id, {
      name: payload.name,
      serviceInterest: payload.serviceInterest,
      leadIntent: payload.leadIntent,
    })

    return json({
      success: true,
      contactId: contact.id,
      tags: contact.tags,
      opportunity: opportunity?.skipped ? null : opportunity,
    })
  } catch (err) {
    console.error('[api/ghl/quiz]', err?.message, err?.data || '')
    return json({ success: false, error: 'Could not save quiz results.' }, 502)
  }
}
