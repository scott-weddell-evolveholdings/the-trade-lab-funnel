/**
 * Vercel Node function helpers (not a route — the leading underscore tells
 * Vercel to skip it when mapping /api/* endpoints).
 */

/** Normalise Vercel's req.body into a plain object regardless of how it arrived. */
export function readJsonBody(req) {
  const b = req.body
  if (b == null) return {}
  if (Buffer.isBuffer(b)) {
    try { return JSON.parse(b.toString('utf8')) } catch { return {} }
  }
  if (typeof b === 'string') {
    try { return JSON.parse(b) } catch { return {} }
  }
  return b
}

/** Framework-neutral JSON response (works on any Node http response). */
export function sendJson(res, status, obj) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(obj))
}
