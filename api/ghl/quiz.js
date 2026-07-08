/**
 * POST /api/ghl/quiz  — Vercel serverless function (quiz completion).
 * Thin adapter over services/handlers.js.
 */
import { handleQuiz } from '../../services/handlers.js'
import { readJsonBody, sendJson } from './_util.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' })
  const body = readJsonBody(req)
  const { status, body: out } = await handleQuiz(body)
  return sendJson(res, status, out)
}
