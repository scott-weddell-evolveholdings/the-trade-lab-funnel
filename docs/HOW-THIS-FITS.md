# The 100k Funnel — how it fits our system

This is the "100k funnel" from the masterclass: the conversion engine that sits
**between the cold email and the sale.** Our cold email says "take a look" and
points here. This funnel does the rest.

## Where it sits in the funnel

```
Prospecting engine → "take a look" email → [ THIS FUNNEL ] → Fulfilment (WOW site) → Ecosystem
                                              │
        ┌─────────────────────────────────────┴───────────────────────────────────┐
        │ index.html (landing)                    welcome.html (post opt-in)        │
        │ • scroll-scrub demo ("scroll to        • "your template is on the way"    │
        │   clean this pool")                     • pivot: "most people don't        │
        │ • 8 animated slides (stats, previews,     implement it — should we build   │
        │   SEO, about, proof, urgency)             it for you?"                     │
        │ • lead-capture modal → free template    • quiz (engineered questions)      │
        │   (name/email/city) → GHL webhook       • dynamic ROI result              │
        │                                         • DFY offer page → £1,500 + bonus │
        └────────────────────────────────────────────────────────────────────────┘
```

So this single asset covers two of our stages at once:
- **Lead magnet / opt-in** (the free-template capture) — this *is* the "free
  template" page referenced in our offer ladder and marketing plays.
- **The sale** (quiz → DFY offer at £1,500 + Google Business Profile bonus) — this
  is `01-OFFER` rendered as a live page.

## How it relates to the WOW skill (no overlap)
- **WOW skill (`skills/wow-website-builder/`)** builds the actual *client deliverable
  site* and the *demo* we show.
- **This funnel** is the *sales mechanism* that wraps a demo and converts cold
  traffic into leads and £1,500 sales. It has its own built-in scroll demo for the
  pitch. Different jobs — they work together.

## It's a runnable app (not just instructions)
Vite + vanilla JS, one dependency (anime.js). `node_modules` was NOT copied — run
`npm install` once to regenerate it.

```bash
cd "02-SALES-ENGINE/funnel"
npm install
npm run dev            # live preview at localhost:5175
npm run build:single   # → dist/index.single.html (one file to paste into GHL)
```

## Customising it for our niche
`AGENTS.md` in this folder is a 5-phase customization agent (brand discovery →
write reference files → edit source → build single HTML → GHL delivery). Once we
pick a niche, we run that workflow to rebrand every "pool cleaning" string, swap
colours/logo, wire the webhook, and build. The `reference/` folder holds the brand
+ copy + design source-of-truth docs it writes from.

## Gotchas to plan for
- **UK money:** the template uses USD (~$1,497 / "$2,500 value"). Switch to **£1,500**
  and £ values throughout during customization.
- **Webhook:** the opt-in form does nothing until `src/slides/modal.js` is wired to a
  real GHL webhook URL. Without it, leads show "success" but aren't captured.
- **Demo frames must be hosted separately.** The single-HTML build does NOT embed
  the 241-frame scroll sequence in `public/frames/` — host that folder on a CDN and
  point `src/demos/after-site.js` at it, or the hero animation won't play on GHL.
- **Replace the demo:** the bundled scroll demo is the pool placeholder. Swap in our
  niche demo (from the WOW skill → `scripts/extract_frames.sh`) so the pitch matches the niche.

## Next step
Pick the niche (`../../06-SOPS/niche-selection.md`), then run the `AGENTS.md`
workflow to brand this funnel and produce `dist/index.single.html` for GHL.

---

## Plain-English: what "a runnable app" means

The WOW website is **one finished `.html` file** — you double-click it and it opens,
like a photo. This funnel is different: it's a **program made of many code files**
that have to be assembled before you can see them. So you *run* it instead of just
opening it:

- `npm install` — one-time. Downloads the building blocks the project needs.
- `npm run dev` — starts a **live preview** in your browser (at a localhost link) so
  you can edit and watch it update in real time.
- `npm run build:single` — **squashes all the pieces into one `.html` file**
  (`dist/index.single.html`) that you paste into GoHighLevel.

Recipe-and-kitchen analogy: the source files are ingredients, `npm run dev` is
cooking it live so you can taste and adjust, and `build:single` plates the final
dish — one file — to serve in GHL. "Runnable" just means *you start it*, not *you
open it*. You don't need to understand the code — the funnel-builder skill (or just
asking me) drives all of this for you.
