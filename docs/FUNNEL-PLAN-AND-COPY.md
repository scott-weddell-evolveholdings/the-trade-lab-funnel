# The Trades Labs — Funnel Copy (v5 — COMPLETE: both pages, in order)

Mapped against the **full** source (`index.html` front page + `welcome.html` flow incl.
`welcome/main.js` quiz + dynamic ROI). Skinned to **cinematic bathrooms + £**, keeping the
template's proven mechanics. ⚠️ **[ILLUSTRATIVE]/[VERIFY]** = invented number/review that
must be set real or removed before go-live (real businesses, real claims).

**Positioning:** *Cinematic Websites for Plumbing Businesses* — sells the outcome
(before→after + timelapse) and gets found (local SEO). Ladder: free demo site → **£1,500
DFY** → ecosystem. Brand: The Trades Labs (navy/brass).

---

# PAGE 1 — FRONT (`index.html`), in scroll order

**1. Hook (`slide1-hook`)** — full-screen scroll-scrub
- Over-bg: "Scroll down to see how bathroom firms are winning the best jobs" · badge **FREE IN 2026** · cue ↓
- Demo browser (lumina-bathrooms.co.uk): "Scroll down **to transform this bathroom**" → "From dated **to immaculate.**"
- CTA band: "This website is winning jobs in 2026" → **[Get this template — FREE]** · **[See everything included →]**
- Anchor: This isn't a mockup. This is a real, working website.

**2. Booked + 3 stat reveals (`slide3-bookings`)**
- "Your diary, **full of bathroom jobs.**" — calendar: Thompson (full refit), Patel (wet room), Khan (en-suite), survey + quote, handover…
- **02 Enquiries / month: 4 → 30** — "More of the right people asking for a price." **[ILLUSTRATIVE]**
- **03 Conversion: 1 in 80 → 1 in 8** — "Most trade sites turn 1 in 80 visitors into an enquiry. A cinematic one turns 1 in 8." **[ILLUSTRATIVE]**
- **04 Extra jobs won / month: £0 → £16,000** — "Two extra bathrooms a month at £8k each." **[ILLUSTRATIVE — set defensible numbers]**

**3. What's inside (`slide4-features`)** — left-nav + animated preview (keep 5)
- Eyebrow "What's inside the template" · H "Every section your business needs — already built."
- 1 **Cinematic hero** — before→after scrubs as they scroll; stops them dead.
- 2 **Services** — priced packages; transparent pricing builds trust.
- 3 **Reviews** — 5-star testimonials, front and centre.
- 4 **Quote & booking** — live calendar/quote form; turns visitors into booked surveys.
- 5 **Deposits** — take a deposit online; secure the job before you arrive.
- (preview mock: "Everything your bathroom deserves" · Full Refit from £X · Wet Room from £X · En-suite from £X.)

**4. #1 on Google (`slide5-seo`)**
- Eyebrow "Performance & Rankings" · H "Get to **#1 on Google**"
- SERP (you top): `bathroom fitters manchester` → lumina-bathrooms.co.uk — "Manchester's 5★ Bathroom Fitters | Free Quote in 48 Hours" · ★★★★★ 4.9 · 37 reviews **[VERIFY]**
- Dull competitors below · "What's baked in: local SEO keywords pre-loaded for your town."

**5. Who we are (`slide6-who`)**
- Eyebrow "Who Are We" · H "We got tired of watching good fitters get ripped off by agencies."
- "Most agencies charge **£3,000–£5,000** for a site like this. We're giving it away **free to one bathroom business per town** — as a case study. You get a premium cinematic site; we get a success story."
- Badge "Helping trades businesses across the UK" **[VERIFY/soften until true]**

**6. Proof (`slide7-proof`)** — testimonials + stats bar
- H "Here's what fitters are saying." **[ILLUSTRATIVE testimonials — replace with real before live]**
  - ★★★★★ "Three quote requests in the first week…" — Mark T., Didsbury
  - ★★★★★ "My old site was embarrassing. This one I text to customers…" — Sandra R., Stockport
  - ★★★★★ "Finally showing up on Google. First enquiry day three…" — James K., Altrincham
- Stats bar **[VERIFY — true or remove]:** Sites built · Owners helped · Avg rating

**7. Close (`slide8-close`)**
- Ticker "_N_ towns claimed this week · your area is still open" **[VERIFY]**
- H "Want this template? We're giving it away **free in 2026.**" · "Building case studies — one business per town."
- Buttons: ✅ Yes — I want this free · 💬 I have questions first (→ question + email to GHL)

**Opt-in modal (`modal`):** Free Template · "Best Bathroom Website 2026" · ~~£997 value~~ **FREE** ·
fields Name/Email/**Town** · [Get my free template →] · "One spot per town · no credit card · we'll confirm within 24h." *(POST to GHL webhook.)*

---

# PAGE 2 — WELCOME (`welcome.html`): hero → quiz → result → offer → buy

**Hero / thank-you (`welcome-hero`)**
- "✓ YOU'RE CONFIRMED — Your free website template is on its way." · "Check your inbox — within 5 minutes (check spam)."
- **REAL TALK:** "Most fitters who grab this template never actually launch it. Not because it's hard — because you're on the tools, quoting jobs, managing customers, and building a website never reaches the top of the list. It sits in a folder. Weeks pass. Meanwhile another fitter in your town just got a brand-new site live and shows up every time someone Googles 'bathroom fitters near me.' Take 60 seconds — we'll tell you if it makes sense for us to just build it for you."
- CTA: "Take the quiz: should we just build it for you? →" · "Skip the quiz / see what's included"

**Quiz — 5 questions (`quiz`)** *(reworked for bathroom economics; fields keep names diy/delay/google/revenue/growth)*
- Q1 `diy`: If we send the template, how likely are you to actually get it set up? — Very likely, I'm tech savvy / I'd try but I'd get stuck / Probably not — no time / Not a chance, I want it handled.
- Q2 `delay`: How long have you been putting off a world-class website? — A few months / Over a year / Never a priority / Just getting started.
- Q3 `google`: When someone searches "bathroom fitters near me," where do you show up? — First page / On Google, not page one / Have a listing, never checked / No idea or not at all.
- Q4 `revenue` **(reframed):** What's a typical bathroom job worth to you? — **Under £4k / £4k–£8k / £8k–£12k / £12k+**.
- Q5 `growth` **(reframed):** How many extra bathroom jobs a month would make a real difference? — **1–2 / 3–4 / 5–6 / 7+**.

**Dynamic result (`result`)** — built from answers (logic in `main.js`):
- Eyebrow/H/sub branch on `diy`+`google` (e.g. "You could handle this yourself — but here's what's worth knowing" vs "It makes a lot of sense for us to build this for you").
- Answer chips from google/delay/growth.
- Breakdown paragraph from delay + diy + google copy maps (reworded for bathrooms — "every month you're not on page one, homeowners are calling another fitter").
- **ROI by job-value tier (rework `ROI_DATA` — one-off jobs, not annual):**
  - under-4k → jobValue **£3,500**, range **£7,000–£14,000**, "Two extra installs and your site's paid for itself several times over."
  - 4-8k → jobValue **£6,000**, range **£12,000–£24,000**, "At £6,000 a job, a single extra install covers this site four times over."
  - 8-12k → jobValue **£10,000**, range **£20,000–£40,000**, "One £10k install and you're miles into profit — for years."
  - 12k-plus → jobValue **£12,000+**, range **£24,000–£48,000**, "Your site pays for itself before the first job is even finished."
  - Highlight: "At £6,000 a job, **2 extra installs puts £12,000 back into your business.**" · "Most clients are profitable from the very first new job."
- CTA: "Yes, build my site for me — see what's included →"

**Offer (`offer`)** — value stack
- Bg = the cinematic demo · "DONE FOR YOU — 2026 DESIGN — Yes, build this cinematic website for me."
- Sub: "You're one step from a site that ranks on Google, turns visitors into calls, and sells your work 24/7 — while you're on the tools."
- **WHAT YOU GET | VALUE:**
  - Custom cinematic website, fully built for you — **£2,500**
  - Cinematic before/after + fit-out timelapse — **£600**
  - Local SEO optimisation — **£800**
  - Google Business Profile optimisation — **£400**
  - Professional copywriting — **£600**
  - Quote form + click-to-call — **£200**
  - Hosting, SSL & go-live handled — **£300**
  - **TOTAL VALUE £5,400+**
- Price card: "Total value £5,400+ · **YOUR PRICE TODAY £1,500** · One-time · No monthly fees · No retainer · No surprises."
- Profit line: "One extra bathroom job covers this several times over. The next job is pure upside — for years."
- Scarcity: "Only _N_ build spots this month — we cap it to keep quality high." **[VERIFY mechanic]**
- CTA: "Claim my spot — get my site built →" · "Live in days."

**Checkout (`buy`)**
- "Ready to get your site live? Lock in your spot — we'll reach out within 24h to kick off."
- Card: **Done-For-You Website — £1,500** · ✓ custom design & branding · ✓ written copy · ✓ cinematic before/after + timelapse · ✓ mobile-first & fast · ✓ local SEO · ✓ 1yr hosting · ✓ 30-day support.
- **[Pay securely — £1,500]** · Stripe · 100% money-back guarantee.

---

## Build notes (after sign-off)
- Text: pool/Aqua Elite/PoolMasters/Tampa/city/routes → bathroom/Lumina/The Trades Labs/town/on-the-tools.
- £: every `$`→`£`; `$1,497`→`£1,500`; value stack + ROI numbers as above.
- **JS logic:** rework `welcome/main.js` `ROI_DATA` (job-value tiers above), Q4/Q5 option values, and result breakdown copy maps; keep the step machine + chips.
- Embed Lumina cinematic demo (frames) in slide-1 + offer-page demo.
- Wire `modal.js` (front) + welcome opt-in → GHL webhook; verify a test lead.
- Swap logo/icon + hero bg to Trades Labs brand.
- Set/remove every **[ILLUSTRATIVE]/[VERIFY]** before live.
- `npm run build:single` → `index.single.html` + `welcome.single.html` for GHL.

---

**Sign-off:** this now covers 100% of the funnel — both pages, in order, with the dynamic
ROI reworked for bathroom job economics. Tell me: (1) the stat/ROI numbers (real, or "keep
illustrative for preview"), (2) keep the per-town scarcity? Then I customise source + JS,
build both pages, and show you the running preview before GoHighLevel.
