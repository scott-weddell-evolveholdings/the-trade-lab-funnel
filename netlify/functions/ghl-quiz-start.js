/**
 * POST /api/ghl/quiz-start — Netlify Function (v2) adapter.
 * Thin wrapper over services/handlers.js (shared with the Vercel build).
 * Adds the "Quiz Started" tag when the quiz is opened.
 */
import { handleQuizStart } from '../../services/handlers.js'

export const config = { path: '/api/ghl/quiz-start' }

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } })

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  let body
  try { body = await req.json() } catch { return json({ error: 'Invalid JSON body' }, 400) }
  const { status, body: out } = await handleQuizStart(body)
  return json(out, status)
}
