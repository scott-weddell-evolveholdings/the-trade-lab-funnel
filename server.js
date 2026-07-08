/**
 * server.js — production Node server for Railway (or any container host).
 * ────────────────────────────────────────────────────────────────────────────
 * Serves the built Vite site (dist/) AND the GHL API routes, reusing the same
 * services/handlers.js as the Netlify/Vercel adapters. The GHL API key stays
 * server-side (read from process.env at runtime) — never in the browser bundle.
 *
 * Railway: build = `npm run build` (Nixpacks auto-runs it), start = `node server.js`.
 * Locally: `npm run build && node --env-file=.env server.js`
 * ────────────────────────────────────────────────────────────────────────────
 */
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleLead, handleQuiz, handleQuizStart } from './services/handlers.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')

const app = express()
app.use(express.json({ limit: '256kb' }))

// ── GHL API routes (POST only) ──
const route = (handler) => async (req, res) => {
  try {
    const { status, body } = await handler(req.body || {})
    res.status(status).json(body)
  } catch (err) {
    console.error('[server] route error:', err?.message)
    res.status(500).json({ success: false, error: 'Server error' })
  }
}
app.post('/api/ghl/lead', route(handleLead))
app.post('/api/ghl/quiz-start', route(handleQuizStart))
app.post('/api/ghl/quiz', route(handleQuiz))

// ── Static site (index.html, welcome.html, demo.html, assets, frames, team) ──
app.use(express.static(DIST, { extensions: ['html'] }))

// Anything else → the funnel entry page (GET); everything else 404s.
app.use((req, res) => {
  if (req.method === 'GET') return res.sendFile(path.join(DIST, 'index.html'))
  res.status(404).json({ error: 'Not found' })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Funnel live on :${port}`))
