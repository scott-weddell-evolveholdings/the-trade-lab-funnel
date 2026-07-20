# Client Delivery SOP — The Trades Lab Funnel

The exact, repeatable checklist to deliver this project for a **new client** from
scratch. Tick each box as you go. Every step says **where** it happens:
🖥️ **VS Code** (the codebase) · 🤖 **Claude** (Claude Code does the edit) ·
🔷 **GHL** (GoHighLevel) · ☁️ **Deploy** (GitHub / Railway / Vercel) ·
📊 **Analytics** (GTM / GA4 / Meta).

> This whole product is built to be **reused by swapping values, not rewriting code.**
> Everything client-specific is either an `.env` value, a content asset, or a
> GHL setting. If you find yourself editing core logic (`services/`, the build,
> the canvas engine), stop — that's a sign something's off.

**Deep-dive docs referenced below (already in this repo):**
- `docs/GHL-INTEGRATION.md` — CRM integration setup & reuse
- `docs/ANALYTICS-SETUP.md` — GTM / GA4 / Meta Pixel
- `docs/GHL-WELCOME-SEQUENCE.md` — 7-email opt-in nurture (+ AI-builder prompt)
- `docs/GHL-POST-PAYMENT-WORKFLOW.md` — payment → fulfilment automation
- `docs/BRAND-GUIDELINES.md`, `docs/OFFER-AND-POSITIONING.md`, `docs/FUNNEL-PLAN-AND-COPY.md`
- `docs/design-references/checkout-design.html`, `docs/design-references/thank-you-design.html` — page designs to replicate in GHL

---

## ⭐ Client Swap Sheet (fill this in FIRST — everything else references it)

Gather these once at intake. This is your single source of truth for the build.

| Field | This client's value |
|---|---|
| Business name (e.g. "Onyx & Oak") | |
| Niche / trade (e.g. bathroom fitters) | |
| Town / service area (e.g. Manchester) | |
| Business phone (their number) | |
| Contact email (working mailbox) | |
| Domain — funnel (e.g. `client.com`) | |
| Domain — checkout subdomain (e.g. `go.client.com`) | |
| Brand colours (hex ×2–3) | |
| Logo file received? | |
| Timelapse / transformation video received? | |
| Before/after photos received? | |
| Team photos + names/roles received? | |
| Google reviews (3–5) received? | |
| GHL sub-account (location) ID | |
| GTM Web container ID | |
| GA4 Measurement ID | |
| Meta Pixel ID | |

---

## Milestone 0 — Client Intake & Niche Selection  *(their M0)*

- [ ] 🔷 Select niche / confirm the client's trade and target town
- [ ] Collect all assets into a shared folder (logo, timelapse video, before/after photos, team photos + names/roles, 3–5 Google reviews, phone, working email)
- [ ] Confirm the offer & price for this client (default: **£1,500 +VAT one-off** — see `docs/OFFER-AND-POSITIONING.md`)
- [ ] Fill in the **Client Swap Sheet** above completely
- [ ] Register / confirm access to the client's domain + DNS
- [ ] Confirm GHL sub-account (location) exists for this client

> **Gate:** Don't start the build until the swap sheet is full and the timelapse
> video + at least a few before/after and team photos are in hand. The build
> stalls without them.

---

## Milestone 1 — WOW Website / Authority Demo Buildout  *(their M1)*

The cinematic scroll-scrub bathroom transformation is the centrepiece. It's a
canvas that plays **193 frames** extracted from the client's timelapse video.

### 1a. Project setup — 🖥️ VS Code / ☁️
- [ ] Duplicate this repo for the new client (new GitHub repo, e.g. `client-funnel`)
- [ ] `npm install`
- [ ] `cp .env.example .env` (you'll fill it through Milestones 3–5)
- [ ] `npm run dev` — confirm the funnel loads locally at the printed URL

### 1b. Hero transformation frames — 🤖 Claude + 🖥️ VS Code
- [ ] Get the client's fit-out **timelapse video** (before → after)
- [ ] 🤖 Ask Claude to extract **193 frames** (ffmpeg) into `public/frames/` named `frame_0001.jpg` … `frame_0193.jpg`
- [ ] If a different frame count is used, update `FRAME_COUNT` in `src/demos/after-site.js:11`
- [ ] Optimise frames (resize/compress) so scroll stays smooth on mobile
- [ ] 🤖 Verify with Claude via Playwright screenshots at scroll 0% / 50% / 100% (before → mid → after actually reveals)

### 1c. Demo site content & branding — 🤖 Claude (edits these files)
- [ ] Business name → `src/demos/after-site.js`, `src/demos/showcase.js`, `src/partials/slide1-hook.html` (replace "Onyx & Oak")
- [ ] Phone number → same three files (replace the demo number)
- [ ] Town / service area → `src/demos/after-site.js`, `src/demos/showcase.js`, `src/partials/modal.html`, `src/partials/slide1-hook.html`, `src/partials/slide5-seo.html` (replace "Manchester")
- [ ] Brand colours → tokens in `src/styles/base.css`, `src/demos/showcase.css` (`--gold`, `--navy`, `--cream`, etc.)
- [ ] **Services** panel → real services (`src/demos/showcase.js`)
- [ ] **Our Work** gallery → real before/after photos (`public/demos/` + `showcase.js`)
- [ ] **Meet the Team** → real photos into `public/team/` + names/roles in `showcase.js`
- [ ] **Reviews** → real Google reviews (`showcase.js`)
- [ ] **Get Quote** panel → correct contact details
- [ ] Header on every demo tab uses the correct phone + "Get a Free Quote" CTA

### 1d. Verify the WOW site — 🤖 Claude
- [ ] `npm run build` succeeds
- [ ] Playwright screenshots: hero scroll works, all demo tabs render, mobile header not overflowing
- [ ] "Scroll Down To Transform This Bathroom" hint + arrow animate correctly

> **Reference their M1 rough list:** ✅ get live, ✅ change header, ✅ change hero
> video (now the frame-scrub), ✅ add team, ✅ test timelapse — all covered here.

---

## Milestone 2 — Funnel Build & Content Swap  *(their M2, part 1)*

The funnel = opt-in modal → welcome/quiz → result → offer → buy. All copy lives
in partials; swap content, don't rebuild.

- [ ] 🤖 Funnel hero + slides copy → `src/partials/slide1-hook.html` … `slide8-close.html`
- [ ] 🤖 Opt-in modal fields/copy → `src/partials/modal.html`
- [ ] 🤖 Quiz questions/answers + result logic → `src/welcome/main.js` (and `SERVICE_INTEREST`)
- [ ] 🤖 Offer page value stack + pricing (£ + VAT) → `src/welcome/partials/offer.html`
- [ ] 🤖 Buy page card + guarantee + contact email → `src/welcome/partials/buy.html`
- [ ] 🤖 "What's Inside the Template" tabs mirror the real demo sections → `src/partials/slide4-features.html`
- [ ] Confirm all `£1,500` prices show `+VAT` (small) — offer, buy card, buy button
- [ ] 🤖 `npm run build` + Playwright pass on the full funnel flow (desktop **and** mobile)

---

## Milestone 3 — GHL CRM Setup  *(their M2, part 2)*

Full detail in `docs/GHL-INTEGRATION.md`. The frontend never holds the API key — it
calls our own `/api/ghl/*` routes, which call GHL server-side.

### 3a. GHL account objects — 🔷 GHL
- [ ] Create a **Private Integration token** (Settings → Private Integrations) with contacts + opportunities scopes → this is `GHL_API_KEY`
- [ ] Note the **Location ID** → `GHL_LOCATION_ID`
- [ ] Create **Custom Fields** (Town, Funnel Source, Quiz Response 1–3, Quiz Result, Service Interest, Lead Intent) → copy each **field ID**
- [ ] Create **Tags**: opt-in lead, Quiz Started, Quiz Completed, High Intent
- [ ] Create **Pipeline + Stages** (Opt-in → Finished Quiz → Visited Order Page → Won) → copy pipeline ID + stage IDs
- [ ] Connect **Stripe** (Payments → Integrations) for live checkout

### 3b. Wire the codebase to GHL — 🖥️ VS Code (`.env`)
- [ ] `GHL_API_KEY`, `GHL_LOCATION_ID`
- [ ] All `GHL_FIELD_*` IDs
- [ ] All `GHL_TAG_*` names
- [ ] `GHL_PIPELINE_ID`, `GHL_STAGE_ID`
- [ ] `GHL_FUNNEL_SOURCE`, `GHL_TAG_SERVICE`, `GHL_OPPORTUNITY_NAME_SUFFIX`
- [ ] ⚠️ Confirm `.env` is gitignored (never commit real credentials)

### 3c. Checkout & thank-you pages — 🔷 GHL
- [ ] Build the **checkout page** in GHL, replicating `docs/design-references/checkout-design.html` (branding, order summary, £1,500 +VAT, Stripe fields)
- [ ] Build the **thank-you page** in GHL, replicating `docs/design-references/thank-you-design.html` (order confirmed + "what happens next" → onboarding form)
- [ ] Set the checkout URL → `.env` `VITE_GHL_CHECKOUT_URL` (e.g. `https://go.client.com/checkout`)
- [ ] Create the **onboarding form** (GHL Form/Survey — questions in `docs/GHL-POST-PAYMENT-WORKFLOW.md`)

### 3d. Live end-to-end test — 🤖 Claude / 🔷 GHL
- [ ] Submit a real opt-in → confirm contact created in GHL with opt-in tag + source
- [ ] Complete the quiz → confirm same contact updated (fields + tags + note + opportunity)
- [ ] **Delete the test contact** to keep the CRM clean

---

## Milestone 4 — Deployment & Domains  *(their M2, part 3)*

- [ ] ☁️ Push repo to the client's GitHub
- [ ] ☁️ Deploy on **Railway** (or Vercel / Cloudflare) — this repo supports all three (`server.js` for Railway, `api/` for Vercel, `netlify/` for Netlify)
- [ ] ☁️ Set **every** env var in the host's dashboard (all `GHL_*` **and** `VITE_*` — the `VITE_` ones must be present at **build time**)
- [ ] ☁️ Connect the funnel domain (`client.com`) to the deployment
- [ ] 🔷 Connect the checkout subdomain (`go.client.com`) in GHL
- [ ] Redeploy after any env change; confirm `/api/ghl/lead` responds (not 404)
- [ ] Verify live opt-in on the deployed site writes to GHL, then delete the test contact

---

## Milestone 5 — Analytics & Conversion Tracking  *(new — do not skip)*

Full detail in `docs/ANALYTICS-SETUP.md`. The code already fires dataLayer
events; you just build the containers.

- [ ] 📊 Create **GTM Web container** → set `VITE_GTM_ID` in host env → redeploy
- [ ] View-source the live site: confirm `GTM-` snippet in `<head>` + noscript after `<body>`
- [ ] 📊 Create **GA4 property** → add Google Tag (config) + event tags for `generate_lead`, `quiz_start`, `quiz_complete`, `view_offer`, `begin_checkout`
- [ ] 📊 Create **Meta Pixel** → add base Pixel + mapped events (Lead, ViewContent, InitiateCheckout, custom quiz events)
- [ ] 📊 Add tracking to the **GHL checkout/thank-you page** for the true `Purchase` event (that page is GHL-hosted, outside the repo)
- [ ] Verify all events fire (GTM Preview + GA4 DebugView + Meta Pixel Helper)

> ⚠️ **Web vs Server GTM container:** if you connect Meta's Conversions API,
> GHL/Meta auto-creates a second "Server" container — `VITE_GTM_ID` is **always
> the Web one.** (Noted in the analytics doc.)

---

## Milestone 6 — Email Sequences & Automation  *(their M3, part 1)*

### 6a. Welcome / opt-in nurture — 🔷 GHL
- [ ] Create GHL **Custom Values**: `template_link`, `loom_link`, `business_phone`, `reengage_link`, `onboarding_form_link`
- [ ] Record the **90-second Loom** (Email 2 in the sequence)
- [ ] Decide what `template_link` points to (hosted template / walkthrough)
- [ ] Build the **7-email welcome sequence** — paste the AI-builder prompt from `docs/GHL-WELCOME-SEQUENCE.md` §7, or build by hand
- [ ] Add exit **Goals** (DFY Requested / Booked Call / Paid) so repliers exit early
- [ ] Test: tag a spare contact with the opt-in tag → confirm Email 1 fires + waits queue

### 6b. Post-payment fulfilment — 🔷 GHL
- [ ] Build the **payment-received workflow** per `docs/GHL-POST-PAYMENT-WORKFLOW.md`
- [ ] ⚠️ Filter the trigger to **this funnel's** order form / product (shared sub-account has 95+ workflows)
- [ ] Actions: tag `Paid` → move opportunity to **Won** → send receipt + onboarding email → notify you
- [ ] Test with a £0 / test-mode order; confirm each step fires

### 6c. CRM pipeline visibility — 🔷 GHL
- [ ] Confirm stages track progression: **Opt-in → Finished Quiz → Visited Order Page → Won**
- [ ] (Optional) Add automation to advance stage on "visited order page" so drop-off is visible

---

## Milestone 7 — QA & Launch Gate

- [ ] Full funnel walkthrough on **desktop** — opt-in → quiz → result → offer → buy → checkout → thank-you
- [ ] Full funnel walkthrough on **mobile** (real device): no scroll traps, modal not cut off, header not overflowing, prices show +VAT
- [ ] Every CTA/link goes to the right place; checkout prefills the lead's email/name
- [ ] One **real test purchase** (then refund) — confirms Stripe live + post-payment workflow + thank-you page + receipt email
- [ ] Contact email inbox actually receives mail
- [ ] Analytics events confirmed firing end-to-end
- [ ] Delete all test contacts/opportunities
- [ ] Client sign-off

---

## Milestone 8 — Outreach & Traffic  *(their M3 part 2 + M4)*

- [ ] Record the review-video / Loom per the Trades Lab script
- [ ] Scrape target prospect list (niche + area)
- [ ] Verify & validate emails (deliverability)
- [ ] Warm up sending domain / inboxes
- [ ] Load campaigns into **Instantly** (or chosen sender)
- [ ] Set up **AI Swarm** for personalised outreach at scale
- [ ] Launch campaigns → drive traffic to the funnel opt-in

---

## Milestone 9 — Operations, Tracking & Scaling  *(their M4 part 2)*

- [ ] Weekly: review campaign metrics (open / reply / booked / close rates)
- [ ] Review funnel conversion by stage (opt-in → quiz → order page → purchase) in GHL + GA4
- [ ] Identify + fix the biggest drop-off (copy / design / offer)
- [ ] Retarget non-buyers via the Meta Pixel audience you built
- [ ] Double down on what's converting; retire what isn't
- [ ] Log learnings back into this SOP so the next client is faster

---

## 🚀 WOW-Factor & Level-Up Ideas (make it unforgettable)

Beyond the baseline. Pick the ones that fit each client's budget/appetite — these
are what turn a good delivery into a "how did you do that?!" delivery.

### Instant "wow" in the demo
- [ ] **Personalised reveal:** record a 60-sec Loom scrolling THEIR cinematic demo with their name in the intro — send before they've even paid. Highest close-rate move you have.
- [ ] **Their real job as the hero** (not a stock transformation) — the emotional punch is watching *their own* tiling appear on screen.
- [ ] **Sound-on option:** subtle audio swell as the bathroom reveals (muted by default).
- [ ] **Ambient motion** on the hero before scroll (slow parallax / shimmer) so it's alive on load.

### Conversion & trust boosters
- [ ] **Real countdown timer** on the offer (genuine per-area scarcity, not fake).
- [ ] **Exit-intent popup** on the funnel — "Not ready? Grab the free template" to recover leaving traffic.
- [ ] **Calendar booking embed** (GHL Calendar) instead of "reply with a day" — removes friction on the call CTA.
- [ ] **Video testimonials** from past clients in the reviews section.
- [ ] **Auto-pull live Google reviews** so social proof stays fresh.
- [ ] **WhatsApp / live-chat widget** for instant enquiries.

### Follow-up & retention
- [ ] **SMS alongside email** in the welcome sequence (GHL) — massively higher open rates for trades.
- [ ] **Abandoned-checkout recovery:** fire on `begin_checkout` with no `Purchase` → SMS/email nudge.
- [ ] **Monthly performance report** auto-sent to the client (leads + enquiries their new site generated) — drives referrals & retainer upsells.

### Technical polish (professional credibility)
- [ ] **Lighthouse pass** — 90+ performance/SEO/accessibility before launch.
- [ ] **Accessibility pass** — focus states, alt text, reduced-motion (partially handled; verify per client).
- [ ] **Email deliverability:** SPF / DKIM / DMARC on the client's sending domain.
- [ ] **A/B test the hero headline** (GTM / GHL) to keep lifting conversion.
- [ ] **Custom OG/social preview image** so shared links look premium.
- [ ] **Favicon + branded 404** for the finishing touch.

---

*Keep this file updated every delivery — it's the company's compounding asset.*
