/**
 * POST /api/ghl/lead — Netlify Function (v2) adapter for the opt-in.
 * Thin wrapper over services/handlers.js (shared with the Vercel build).
 * `config.path` maps it to the clean /api/ghl/lead URL. API key stays server-side.
 */
import { handleLead } from '../../services/handlers.js'

export const config = { path: '/api/ghl/lead' }

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } })

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  let body
  try { body = await req.json() } catch { return json({ error: 'Invalid JSON body' }, 400) }
  const { status, body: out } = await handleLead(body)
  return json(out, status)
}
