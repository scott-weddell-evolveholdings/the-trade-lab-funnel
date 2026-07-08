/**
 * POST /api/ghl/quiz — Netlify Function (v2) adapter for quiz completion.
 * Thin wrapper over services/handlers.js (shared with the Vercel build).
 */
import { handleQuiz } from '../../services/handlers.js'

export const config = { path: '/api/ghl/quiz' }

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } })

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  let body
  try { body = await req.json() } catch { return json({ error: 'Invalid JSON body' }, 400) }
  const { status, body: out } = await handleQuiz(body)
  return json(out, status)
}
