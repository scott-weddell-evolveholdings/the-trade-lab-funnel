/**
 * POST /api/ghl/quiz-start  — Vercel serverless function (quiz opened).
 * Thin adapter over services/handlers.js. Adds the "Quiz Started" tag.
 */
import { handleQuizStart } from '../../services/handlers.js'
import { readJsonBody, sendJson } from './_util.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' })
  const body = readJsonBody(req)
  const { status, body: out } = await handleQuizStart(body)
  return sendJson(res, status, out)
}
