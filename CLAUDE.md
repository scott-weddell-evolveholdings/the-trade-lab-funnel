# The Trades Lab — Lead-Gen FUNNEL (project brief for Claude)

You are working on **The Trades Lab funnel**: the cold-email landing experience that turns
a UK trade business owner into a booked lead. This file is your full context — read it first.

## What this project is
A **Vite multi-page web app** (vanilla JS, no framework). It is the "pitch + capture" half
of the business. Live example deploy: a Netlify static site.

Two pages:
- **`index.html`** — the funnel landing. A scroll-jacked **hook hero** (headline → the browser
  demo scrubs a bathroom dated→immaculate) → ROI/results slides → "what's inside" → SEO/Google
  section → who-we-are → proof → the offer + **opt-in modal** (name/email/town).
- **`welcome.html`** — the post-opt-in flow: welcome/pivot → engineered quiz → dynamic ROI
  result → the done-for-you offer.

The opt-in POSTs the lead to a **GoHighLevel (GHL) webhook**.

## The business (why this exists)
The Trades Lab sells **cinematic before/after "WOW" websites to UK trades** (plumbers,
electricians, builders, roofers, bathroom fitters). Goal: £100k/mo via cold email.
Price: **from £1,500**, one-off, client owns the site. See `docs/OFFER-AND-POSITIONING.md`
— follow that framing exactly; it overrides any older copy in the code.

## Run it
```bash
npm install
npm run dev          # local dev server (multi-page)
npm run build        # normal production build → dist/ (ES modules; deploy this to Netlify)
```
Deploy: push `dist/` (or connect the repo) to Netlify. All asset paths must stay relative.

### Single-file build (for opening as a file / simple hosting)
`npm run build:single` inlines CSS/JS into one HTML. Note: external assets (mp4, poster, svg,
frames) stay as references, so for `file://` use they must be made relative (the repo has done
this before with a `sed 's#/assets/#assets/#g'` pass). Prefer the normal `build` for Netlify.

## Structure
- `src/` — the source: `main.js`, `slides/` (each funnel section), `partials/` (EJS-style
  HTML includes, e.g. `slide1-hook.html`), `styles/`, `demos/` (the after-site canvas scrub),
  `assets/` (the bathroom timelapse `water_background.mp4`, `hero-poster`, logo).
- `public/` — static assets incl. the hero `frames/`.
- `scripts/bundle.js` — inlines for the single-file build.
- `vite.config.js` (multi-page), `vite.single.config.js`, `vite.welcome.config.js`.

## Hero mechanics (don't break these)
- The hook hero is **scroll-jacked** (`src/slides/slide1-hook.js`) — wheel/touch events advance
  hookState: headline → demo scrub → CTA, then hands off to normal scroll.
- The bathroom **timelapse video** plays as the hero background (`water_background.mp4`), with
  `hero-poster.jpg` as the instant fallback. Keep the poster — it guarantees the bathroom shows
  even if the video is slow to load.
- EJS partials (`src/partials/`) do NOT hot-reload — restart `npm run dev` after editing them.

## ⚠️ Known issue — copy is out of date (first task)
The currently-deployed funnel still uses the **old offer**: "Free in 2026", "giving it away
free", a fake "14 towns claimed this week" counter, "£997 value", and **fabricated testimonials**
(e.g. "Mark T., Lumina Bathrooms"). This is **off-strategy and dishonest**. Update it to match
`docs/OFFER-AND-POSITIONING.md`: from £1,500 (not free), honest scarcity (one per trade per town,
no fake counter), and **no fake testimonials** — use founder pedigree proof instead.

## Brand
See `docs/BRAND-GUIDELINES.md`. Navy #0E1B2A, brass #C9A227, teal #0F766E, chalk #F7F4EF;
Space Grotesk (display) + Inter (body); the plumb-bob mark.
