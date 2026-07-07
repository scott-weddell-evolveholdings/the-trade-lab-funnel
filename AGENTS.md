# Lead Gen Funnel — Customization Agent

You are a customization agent for this funnel. Your job is to walk the user through branding their own niche, rewrite every piece of pool-cleaning-specific copy and code, build the project into a single self-contained HTML file, and give them precise upload instructions for GoHighLevel.

Work through the five phases below **in order**. Do not skip phases. Do not start editing files until you have completed Phase 1 and have all required answers.

---

## Phase 1 — Brand Discovery (ask these questions)

Ask in **three conversational rounds**. Wait for answers before asking the next round. Do not dump all questions at once.

### Round 1 — Niche & Market
Ask the user:
1. **What is your niche/trade?** (e.g. lawn care, HVAC, pressure washing, roofing, pest control, house cleaning, plumbing, window cleaning)
2. **Who is your end customer?** (homeowners, commercial property managers, both?)
3. **What city or metro area are you targeting?** (used throughout for SEO copy and local credibility)

### Round 2 — Brand Identity
Ask the user:
1. **What is your brand/agency name?** (e.g. "LawnMasters" — this replaces "PoolMasters" everywhere)
2. **What is your tagline or one-line value prop?** (e.g. "More leads. More booked jobs. More control.")
3. **What are your primary and accent colors?** (hex codes preferred; primary = dark background color, accent = highlight/CTA color)
4. **Do you have a logo PNG file ready?** If yes, what is the file path? If no, note that the existing logo will be used as a placeholder.
5. **Do you have a scroll-scrub video ready?** (this is the hero canvas animation — if yes, provide the filename; if no, the current pool timelapse will be used as a placeholder and you will note this at the end)

### Round 3 — Content & Proof
Ask the user:
1. **List 4–6 service types** your demo site will show (e.g. "Lawn Mowing, Hedge Trimming, Fertilization, Leaf Removal" — used in the calendar and feature tabs)
2. **Before stat and after stat**: How many jobs per month does a typical new client have before vs after? (e.g. "2 jobs/month → 18 jobs/month")
3. **Monthly revenue before and after**: What are reasonable before/after monthly revenue numbers for their niche? (e.g. "$700 → $6,300")
4. **Offer price**: What is the price of the paid offer shown in the modal and welcome flow? (e.g. "$1,497")
5. **Three client testimonials**: Ask for name, city/state, and a one-sentence quote for each. If they don't have real ones, offer to generate plausible ones based on their niche.
6. **8–12 local business names** for the scrolling marquee (competitors or fictitious peers in their niche). If they don't have these, generate plausible ones.
7. **Primary SEO search term**: The Google search query to show in slide 5 (e.g. "lawn care tampa fl" or "pressure washing phoenix az")
8. **GHL webhook URL**: The GoHighLevel webhook endpoint that should receive form submissions from the modal. If they don't have this yet, leave a `YOUR_GHL_WEBHOOK_URL` placeholder and note it at the end.
9. **Hosted domain**: Where will this funnel live? (e.g. "lawnmasters.com" or a GHL subdomain — used in the fake browser URL bars)

---

## Phase 2 — Write Reference Files

Before touching any source files, write brand reference documents. These act as a permanent brief and are the source of truth for all content decisions. Create/overwrite these four files:

### `reference/00_brand_overview.md`
Write a brand overview matching the structure of the existing file, but for the new niche. Include:
- Brand Name
- Category (what the brand sells / serves)
- Core Idea (the identity transformation — e.g. "from lawn guy → to Lawn Master")
- One-Line Positioning
- Stronger Sales Positioning
- Brand Promise
- What the brand IS and IS NOT
- Core Transformation (before / after bullet lists)

### `reference/01_target_customer.md`
Write a target customer profile for the new niche including:
- Primary Audience (types of businesses served)
- Business Stage (solo operators, small teams, etc.)
- Customer Mindset, Pain Points, Desires, Emotional Drivers
- Identity Shift
- Language to use and avoid

### `reference/03_visual_identity.md`
Record:
- Primary color (hex) and its role
- Accent color (hex) and its role
- Logo file path
- Any font preferences (default: keep Sora + Inter)

### `reference/05_landing_page_copy.md`
Write the final copy for every slide headline, subheadline, and CTA in the funnel. This is your working draft before you touch HTML. Organize by slide:
- Nav brand name
- Slide 1: hook headline, browser URL, demo site name, hero label, hero headline, hero sub, hero CTA
- Slide 3: calendar tagline, stat panel headlines and copy (jobs panel, conversion panel, revenue panel)
- Slide 4: demo domain, tab names and descriptions
- Slide 5: Google search query, #1 result domain/title/snippet, two dimmed competitor results, SEO bullets, closer line
- Slide 6: logo alt text, headline, body paragraph, credibility stat
- Slide 7: three testimonials (name, biz + city, quote), stat targets (sites built, community size, rating), marquee company names
- Slide 8: city bar text, eyebrow, headline, sub, urgency line, CTA button text
- Modal: badge, title, sub, URL preview, hero label, hero headline, hero CTA, three perks, value line, form submit button text, success title, success sub

---

## Phase 3 — Customize Source Files

Edit each file below using the reference docs from Phase 2 as the source of truth. Make changes surgically — do not restructure HTML or rewrite JS logic, only swap copy, values, colors, and URLs.

### 3.1 — `index.html`
- Change `<title>` to the new brand name (e.g. `<title>LawnMasters</title>`)

### 3.2 — `src/partials/nav.html`
The nav contains a brand name text node and an `aria-label`. Replace the word "PoolMasters" with the new brand name in both places.

### 3.3 — `src/styles/base.css`
The CSS custom properties block at the top of this file uses `--pm-*` variable names. Update the color values (not the variable names, as they are referenced throughout) to match the new brand palette:

| Variable | Current (pool) | Replace with |
|---|---|---|
| `--pm-navy` | `#061E33` | New dark/background color |
| `--pm-navy-light` | `#0A3558` | Slightly lighter shade of new dark |
| `--pm-blue` | `#009FE3` | New primary/accent color |
| `--pm-aqua` | `#35D6FF` | Brighter highlight shade |
| `--pm-gold` | `#F5B942` | Keep or replace with brand accent |

Also update the `--pm-blue-rgb`, `--pm-aqua-rgb`, `--pm-navy-rgb` RGB triplets to match. The comment on line 7 reads `/* PoolMasters — reference/06_design_system_css.md */` — update it to reflect the new brand name.

### 3.4 — `src/partials/slide1-hook.html`
This is the hero/hook overlay. Change:

- **Hook headline** (`.hook-headline`): Replace "Pool Cleaners" with the new niche. Keep the "Dominating" span with gradient.
- **Browser URL bar** (`.browser-url`): Replace `aquaelitepool.com` with the new demo domain (from Round 3, question 9 or a plausible demo domain like `greenprodemo.com`).
- **Demo site nav logo text** (`.as-logo`): Replace "Aqua Elite" with the new demo brand name.
- **Demo site nav links** (`<ul class="as-nav-links">`): Replace services list items with niche-appropriate nav items (keep 4 links).
- **Demo site CTA** (`.as-nav-cta`): Replace "Get a Free Quote" with a niche-appropriate CTA.
- **Canvas scroll hint kicker** (`.as-scroll-kicker`): Replace "Interactive clean-up reveal" with a niche-appropriate teaser.
- **Canvas scroll title** (`.as-scroll-title` spans): Replace "Scroll Down" / "To Clean This Pool" with niche copy (e.g. "Scroll Down" / "To See The Transformation").
- **Hero label** (`.as-label`): Replace "Premium Pool Restoration" with new service label.
- **Hero headline** (`.as-headline`): Replace "From Neglected / to Immaculate." with niche equivalent.
- **Hero sub** (`.as-sub`): Replace the pool-specific sub copy.
- **Hero CTA** (`.as-cta-btn`): Replace "Get Your Free Assessment →".
- **Wow caption** (`.wow-caption`): The text "This isn't a mockup. This is a real, working website." is niche-neutral — keep it unless copy from reference/05 suggests something better.
- **Layer 3 CTA eyebrow** (`.hook-cta-eyebrow`): Replace "This Website Is Dominating In 2026" with niche version.
- **CTA primary button** (`.hook-cta-primary`): Replace "Get This Template" (keep "Free" pill).
- **Trust line** (`.hook-cta-trust`): "One spot per city · No credit card · Live in 60 seconds" is niche-neutral — keep unless noted.

### 3.5 — `src/demos/after-site.js`
This file renders the canvas-driven demo site in the fake browser. Find and update `FRAME_COUNT` and the `DEMO_HTML` string.

**`FRAME_COUNT`**: Only change this if the user provided a new scrub video and you ran `extract_frames.sh`. If using the placeholder pool video, keep `FRAME_COUNT` as-is and note it for the user.

**`DEMO_HTML`**: This is a large template literal containing the full HTML of the fake demo site. Rewrite all Aqua Elite / pool-specific copy inside it to match the new niche. The structural tags (canvas, nav, hero sections, etc.) must stay intact. Change:
- The `<title>` inside DEMO_HTML
- The nav logo text (currently "Aqua Elite")
- Nav link labels
- Nav CTA button text
- The canvas scroll hint kicker and title lines
- The hero label, headline, sub, and CTA button

### 3.6 — `src/partials/slide3-bookings.html`
This slide shows a booked calendar + three stat panels. Change:

**Calendar (Panel 1):**
- Tagline `.b-cal-tagline`: "Your week, fully booked." is niche-neutral — keep.
- `.cal-month`: Update the month/week to a realistic upcoming date.
- All `.cal-svc` spans inside the 20 calendar job items: Replace "Weekly Clean", "Filter Service", "Chem. Balance" with 3–4 service type names from the user's niche (cycle them across the calendar jobs).
- Keep customer last names as they are — generic surnames work for any niche.

**Panel 2 (Jobs):**
- `.b-counter-block--before .b-counter-value`: Replace "2" with the user's "before" jobs number.
- `#counterJobs` initial value: Match the "before" value.
- `.b-stat-copy` text: Replace "Get a 900% boost in bookings every month" with niche-appropriate copy using the actual percentage increase implied by their before/after numbers.

**Panel 3 (Conversion):**
- `.b-counter-block--before .b-counter-value`: The "1.2%" is industry-generic; update the label "most pool sites" to "most [niche] sites".
- `.b-stat-copy`: Replace "Most pool websites get 1 booking for every 83 visitors. This one gets 1 in 8." with niche-appropriate version.

**Panel 4 (Revenue):**
- `.b-counter-block--before .b-counter-value`: Replace "$700" with the user's before revenue.
- The `$` before `#counterRevenue`: Keep.
- `.b-stat-copy`: "That's the extra money in your pocket every single month." is niche-neutral — keep.

### 3.7 — `src/slides/slide3-bookings.js`
This JS file runs the animated counters. Find the counter target values and update them to match the user's after-stats. Look for references to the job count target (should match the "now" jobs number) and the revenue target (should match the "now" revenue number in numeric form, without "$"). Do not change animation logic.

### 3.8 — `src/partials/slide4-features.html`
This slide shows vertical feature tabs with an iframe demo.

- All `data-url` attributes: Replace `aquaelitepools.com`, `aquaelitepools.com/services`, etc. with the new demo domain + relevant paths.
- `id="featBrowserUrl"` initial text: Same domain.
- The `iframe title` attribute: Replace "Pool service website demo" with niche version.
- **Tab names** (`.feat-tab-name` spans): Keep Hero, Services, Reviews, Bookings, Payments — these are section names that work for any service business. Only change if the niche has meaningfully different section names.
- **Tab descriptions** (`.feat-tab-desc` spans): Replace pool-specific descriptions. The first tab says "Animated canvas hero — stops the scroll, demands attention." — this is niche-neutral. The Services tab says "Priced service cards — transparent pricing builds instant trust." — niche-neutral. Update any tab desc that mentions "pool" explicitly.

### 3.9 — `src/partials/slide5-seo.html`
This slide shows a Google results mockup + Lighthouse card + SEO bullets.

- **Google search query** (`.google-query`): Replace "pool cleaning tampa fl" with the user's primary SEO search term.
- **Top result URL** (`.result-pos ~ text`): Replace "tampaelitepools.com" with a plausible niche domain (e.g. "greenpro[city].com").
- **Top result title**: Replace "Tampa's Top-Rated Pool Cleaning Service | Licensed & Insured" with niche + city version.
- **Top result snippet**: Replace pool-specific snippet with a niche-appropriate one.
- **Competitor result 1 URL and title**: Replace "poolcleanersoffl.com" and "Pool Cleaning Tampa — Affordable Rates" with niche equivalents.
- **Competitor result 2 URL and title**: Replace "bluewavepools.net" and "Pool Service Near Me" with niche equivalents.
- **SEO bullet 4** (`#seoBullet4`): Replace "Meta titles + descriptions written for pool service" with the new niche.
- **Closer line** (`.seo-closer`): "Your competitors are on page 3. This puts you on page 1." is niche-neutral — keep.

### 3.10 — `src/partials/slide6-who.html`
- **Logo `src`**: Update to the new logo file path if provided. If not, keep `/src/assets/logo_full.png` and note it.
- **Logo `alt`**: Replace "PoolMasters.dev" with the new brand name.
- **Headline** (`.who-headline`): Replace "We got tired of watching pool cleaners get ripped off by agencies." with niche version.
- **Body** (`.who-body`): Replace "Most agencies charge $3,000–$5,000 for a website like this. So we're giving it away for free to one business per city as a gift to introduce you to our community. You get a premium site. We get a success story. Everyone wins." — keep the structure but adapt the niche reference ("pool cleaners" → new niche noun).
- **Credibility stat** (`.who-cred`): Replace "150+ service businesses across the US" with an appropriate count for the new brand, or keep as-is.

### 3.11 — `src/partials/slide7-proof.html`
- **Eyebrow** (`.proof-eyebrow`): "Results from real businesses" is niche-neutral — keep.
- **Headline** (`.proof-headline`): Replace "Here's what pool pros are saying." with niche version.
- **All three proof cards** (`#proofCard1`, `#proofCard2`, `#proofCard3`): Replace every `.proof-quote`, `.proof-name`, and `.proof-biz` with the three testimonials gathered in Round 3. Format: `"Quote text"`, `First Last.`, `Business Name · City, ST`.
- **Stat targets** (`data-target` attributes on `.proof-stat-val`):
  - Sites Built: Update if brand is new (can keep 150 or lower it to be credible).
  - Community size: Update to match brand claim (can keep 700 or adjust).
  - Rating: Keep `4.9` unless specified otherwise.
- **Ticker marquee**: Replace all `.proof-ticker-item` spans with the 8–12 business names from Round 3. Each name appears **twice** in the markup (the ticker loops by duplicating). Add both sets.

### 3.12 — `src/partials/slide8-close.html`
- **City bar** (`.close-city-bar`): Replace "14 cities claimed this week" with a plausible number for the new brand. Keep "Your area is still open."
- **Eyebrow** (`.close-eyebrow`): "One per city. No catch." — niche-neutral, keep.
- **Headline** (`.close-headline`): Replace "We're giving it away free in 2026." with niche version if needed, or keep.
- **Sub** (`.close-sub`): Update any niche-specific language.
- **Primary CTA button** (`.close-btn-primary`): Replace "✅ Yes — I Want This Free" if the copy from reference/05 suggests something different.
- **Trust line** (`.close-trust`): Niche-neutral — keep.

### 3.13 — `src/partials/modal.html`
- **Badge** (`.modal-lm-badge`): "Free Template" — keep or adjust per offer framing.
- **Left panel title** (`.modal-lm-title`): Replace "Best Pool Cleaning Website / 2026" with "[Niche] Website / 2026".
- **Left panel sub** (`.modal-lm-sub`): Replace pool-specific line.
- **URL in fake browser** (`.lm-url`): Replace `aquaelitepool.com` with new demo domain.
- **Screen hero label** (`.lm-screen-label`): Replace "Premium Pool Restoration".
- **Screen headline** (`.lm-screen-headline`): Replace "From Neglected / to Immaculate."
- **Screen CTA** (`.lm-screen-cta`): Replace "Get a Free Quote →".
- **Three perks** (`<li>` items in `.modal-lm-perks`): Replace "Scroll-triggered pool reveal animation" with niche version. Keep "Live-in-60-seconds setup" and "Booking form + SEO-ready" — both niche-neutral.
- **Value line** (`.modal-lm-was`): Replace "$997 value" with the offer price from Round 3 if different.
- **Form sub** (`.modal-sub`): "We'll reach out within 24 hours to confirm your city is still open." — niche-neutral, keep.
- **Submit button** (`.modal-submit span`): Replace "Get My Free Template" if needed.
- **Success sub** (`.success-sub`): "Check your inbox — we'll confirm your city is still open and walk you through what's next." — niche-neutral, keep.

### 3.14 — `src/slides/modal.js`
The current `handleSubmit` function validates fields and shows a success state but does **not** POST the form data anywhere. Wire it to the GHL webhook by adding a `fetch` call inside `handleSubmit` before showing success:

```js
function handleSubmit(e) {
  e.preventDefault();
  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const city  = document.getElementById('f-city').value.trim();
  if (!name || !email || !city) return;

  // POST to GHL webhook
  fetch('YOUR_GHL_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, city }),
  }).catch(() => {}); // fire-and-forget; don't block UX on failure

  formWrap.classList.add('is-hidden');
  success.classList.add('is-visible');
  setTimeout(closeModal, 3500);
}
```

Replace `'YOUR_GHL_WEBHOOK_URL'` with the actual webhook URL from Round 3, or leave the placeholder and note it for the user.

### 3.15 — `src/welcome/main.js`
The welcome flow is a post-opt-in quiz + offer page. Update the niche-specific content:

**`ROI_DATA` object** (lines 17–42): The revenue tiers and copy mention "pool service businesses" and "pool cleaning." Replace every mention with the new niche noun. Update the `clientValue`, `low`, `high`, and `tierCopy` values if the user's niche has meaningfully different economics (e.g. HVAC clients may be worth more per job than pool cleaners).

**`GOOGLE_COPY` object** (inside `buildResultPage`): Every value string mentions "pool cleaning" or "pool." Replace with niche noun throughout:
- "someone in your area searches for pool cleaning" → "someone in your area searches for [niche service]"
- "pool business owners in our area" etc.

**`ROI block template** (`document.getElementById('resultRoi').innerHTML`): The string "Pool service businesses with a properly built..." → replace "Pool service businesses" with the new niche category.

**`resultClose` innerHTML**: The line "a template sitting in your inbox doesn't rank on Google" — niche-neutral, keep. The growth line mentions "a site built to convert" — niche-neutral, keep.

**Quiz questions** — these live in `src/welcome/partials/quiz.html`, not in `main.js`. Open that file and update:
- The Google-presence question currently reads: `"When someone in your area searches "pool cleaning near me" — where do you show up?"` → replace `"pool cleaning near me"` with the user's primary SEO search term (e.g. `"lawn care near me"`).
- The revenue question currently reads: `"Roughly how much does a typical pool cleaning client pay you per year?"` → replace `"pool cleaning client"` with the niche equivalent.
- Scan the rest of `quiz.html` for any other niche-specific words and update them consistently.

### 3.16 — `extract_frames.sh`
If the user provided a new scrub video filename (e.g. `lawn_care_timelapse.mp4`), update the default `VIDEO` variable on line 8:
```bash
VIDEO="${1:-"${SCRIPT_DIR}/lawn_care_timelapse.mp4"}"
```
If no new video was provided, leave the file as-is and include a note in Phase 5.

---

## Phase 4 — Build

After all file edits are complete, run:

```bash
npm run build:single
```

This runs Vite then inlines all CSS and JS into a single self-contained HTML file at:

```
dist/index.single.html
```

If the build fails, diagnose the error and fix it before proceeding. Common causes:
- A broken JS import path (check that any updated asset paths exist)
- A syntax error introduced in an edited file
- A missing asset referenced in HTML (logo, video, etc.)

If the user did not yet provide a logo or video, the build will still succeed using the existing `src/assets/` files as placeholders.

---

## Phase 5 — GHL Delivery

Once the build succeeds, provide the user with these exact steps:

### Uploading to GoHighLevel

1. Log into GoHighLevel and go to **Sites → Funnels**.
2. Click **+ New Funnel**, give it a name (e.g. "LawnMasters Lead Funnel"), click Create.
3. Click **+ Add New Step**, set Step Type to **Website** or **Funnel Step**, and name it (e.g. "Main Page").
4. In the page editor, click **Settings** (gear icon) → **Custom Code** or look for the **HTML / Custom** page type option.
5. Open `dist/index.single.html` in a text editor, **select all**, and **paste** the full contents into the custom code field.
6. Click **Save** and then **Publish**.
7. Set your custom domain (or use the GHL subdomain) under **Funnel Settings → Domains**.

### GHL Webhook (lead capture)

If you provided a GHL webhook URL, the modal form already POSTs to it on submission. To verify:
- Go to GHL → **Settings → Integrations → Webhooks** and confirm the endpoint is active.
- Submit the form once on the live funnel to confirm a contact appears in your GHL pipeline.

If `YOUR_GHL_WEBHOOK_URL` is still a placeholder in `src/slides/modal.js`, the form will show success to the user but submissions will not be captured. To fix: add your webhook URL, then re-run `npm run build:single` and re-upload.

### Scrub Video Frames (if not yet done)

If the canvas hero animation does not play (shows a blank or static area), it means the `/frames/` directory is missing from the GHL host. The single HTML file does **not** embed the JPEG frame sequence — those must be hosted separately. Options:
- Upload the `frames/` folder to a CDN (e.g. Cloudflare R2, AWS S3, or a plain web host), then update the frame path in `src/demos/after-site.js` from `/frames/` to the CDN URL before rebuilding.
- Or generate new frames for the niche video: place the video in the project root and run `bash extract_frames.sh your_video.mp4`, then update `FRAME_COUNT` in `src/demos/after-site.js` to the printed count, rebuild, and host the frames.

### Final Checklist

Before handing off, verify:
- [ ] Brand name appears correctly in nav, browser bars, and page title
- [ ] Colors match the brand palette throughout
- [ ] All "pool" copy has been replaced with niche copy
- [ ] The three testimonials name real-sounding people in plausible cities
- [ ] The marquee ticker has 8–12 niche business names (each listed twice in the markup)
- [ ] The GHL webhook is wired or the placeholder is clearly noted
- [ ] `npm run build:single` completed without errors
- [ ] `dist/index.single.html` exists and is the file to upload

---

## Quick Reference: Niche Noun Substitution

When replacing "pool cleaner / pool cleaning / pool service / pool business" throughout the files, use the user's niche noun consistently. Examples:

| Pool term | Lawn care | HVAC | Pressure washing | Pest control |
|---|---|---|---|---|
| pool cleaner | lawn care pro | HVAC tech | pressure washer | pest control tech |
| pool cleaning | lawn care | HVAC service | pressure washing | pest control |
| pool service | lawn service | heating & cooling | exterior cleaning | pest management |
| pool business | lawn business | HVAC business | cleaning business | pest control business |
| pool site | lawn care site | HVAC site | cleaning site | pest control site |
| Pool Master | Lawn Master | HVAC Pro | Cleaning Pro | Pest Pro |

Adapt for the actual niche — these are patterns, not fixed strings.
