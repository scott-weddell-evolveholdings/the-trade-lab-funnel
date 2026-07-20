# The Trades Lab — Lead-Gen Funnel

> Cinematic before/after "WOW" websites for UK trades. This repo is the **pitch + capture**
> funnel: the cold-email landing experience that turns a UK trade business owner into a booked lead.

A **Vite multi-page** web app (vanilla JS, no framework). The opt-in and quiz submit to our own
backend routes, which push the lead into **GoHighLevel** server-side (the API key never touches
the browser).

---

## Quick start

```bash
npm install
npm run dev          # local multi-page dev server
npm run build        # production build → dist/  (deploy this to Netlify)
npm run preview      # preview the production build locally
```

### Single-file build (for `file://` / simple hosting)
```bash
npm run build:single # inlines CSS/JS into one HTML per page
```
External assets (mp4/poster/frames) stay as references; for `file://` they must be made relative.
Prefer the normal `build` for Netlify.

---

## Pages (entry points, at repo root)

| File | Route | Purpose |
|---|---|---|
| `index.html` | `/` | Funnel landing — scroll-jacked hook hero → ROI/results → offer + opt-in modal |
| `welcome.html` | `/welcome` | Post-opt-in flow — welcome → engineered quiz → dynamic ROI result → offer |
| `onboarding.html` | `/onboarding` | Post-checkout booking page — embeds the GHL calendar (kickoff call) |
| `demo.html` | `/demo` | Standalone after-site canvas demo |

> Entry HTML must stay at the repo root — Vite's multi-page config and the EJS
> `include('src/...')` partials resolve paths from here.

---

## Project structure

```
.
├── index.html  welcome.html  onboarding.html  demo.html   # page entry points
├── src/
│   ├── main.js                 # funnel landing bootstrap
│   ├── slides/                 # per-section JS (hook, bookings, features, seo, who, proof, close)
│   ├── partials/               # EJS-style HTML includes for each slide (do NOT hot-reload)
│   ├── styles/                 # per-section CSS + base.css (the ambient gradient mesh)
│   ├── demos/                  # after-site canvas scrub + showcase
│   ├── welcome/                # the welcome/quiz page (its own main.js, partials/, styles/)
│   ├── lib/                    # shared helpers (analytics)
│   └── assets/                 # logo, favicons, marks
├── public/                     # static assets served verbatim (hero frames/, team/, demos/)
├── api/ghl/                    # Express API routes (server.js / Railway target)
├── netlify/functions/          # Netlify Functions (the production backend)
├── services/                   # shared GHL client + handlers (used by both backends)
├── scripts/                    # build/util scripts (bundle.js, extract_frames.sh, md2docx.py)
├── docs/                       # operational docs + design-references/ (GHL page mockups)
├── reference/                  # brand & copy source material (00–10)
├── vite.config.js              # multi-page build (index/welcome/onboarding/demo)
├── vite.single.config.js  vite.welcome.config.js
├── netlify.toml                # build + functions + /onboarding rewrite
└── server.js  railway.json     # Express server for the Railway target
```

---

## Backend & GHL integration

The opt-in/quiz POST to `/api/ghl/lead` and `/api/ghl/quiz`. Two interchangeable backends share
`services/ghl.js`:

- **`netlify/functions/`** — the production backend (self-registering paths via `export const config`).
- **`api/ghl/` + `server.js`** — an Express equivalent for the Railway target.

Every client-specific value (API key, location, custom-field IDs, tags, pipeline/stage) comes from
environment variables — see `.env.example`. Full setup in **`docs/GHL-INTEGRATION.md`**.

---

## Deploy

Netlify builds from the repo: `npm run build` → publishes `dist/`, with functions from
`netlify/functions/` (see `netlify.toml`). All asset paths must stay **relative**. The clean
`/onboarding` URL is served via a rewrite in `netlify.toml`.

---

## Documentation

- **`CLAUDE.md` / `AGENTS.md`** — working context for AI agents on this repo.
- **`docs/`** — brand guidelines, offer & positioning, analytics setup, GHL sequences/workflows,
  the client-delivery SOP, and `docs/design-references/` (checkout & thank-you page mockups to
  replicate in GHL).
- **`reference/`** — brand & copy source material (target customer, voice/tone, visual identity,
  landing-page brief/copy, image prompts, offer/CTA).

---

## Brand

Trade Navy `#0E1B2A` · Brass `#C9A227` · Spirit Teal `#0F766E` · Chalk `#F7F4EF`.
Space Grotesk (display) + Inter (body); the plumb-bob mark. See `docs/BRAND-GUIDELINES.md`.
