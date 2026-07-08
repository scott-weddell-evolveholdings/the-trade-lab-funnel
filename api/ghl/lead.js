/**
 * POST /api/ghl/lead  — Vercel serverless function (opt-in).
 * Thin adapter over services/handlers.js (shared with the Netlify build).
 * The GHL API key stays here on the server; the browser only sees this route.
 */
import { handleLead } from '../../services/handlers.js'
import { readJsonBody, sendJson } from './_util.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' })
  const body = readJsonBody(req)
  const { status, body: out } = await handleLead(body)
  return sendJson(res, status, out)
}
