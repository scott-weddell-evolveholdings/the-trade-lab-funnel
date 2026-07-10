# Analytics Setup — GTM, GA4, Meta Pixel

Conversion tracking for the funnel, wired the same reusable way as the GHL
integration: **one container ID in `.env`**, everything else configured
inside Google Tag Manager so you never touch code again to add or change a tag.

Nothing here is a secret. GTM/GA4/Meta IDs are public identifiers meant to sit
in the page source — that's why they're `VITE_`-prefixed (frontend, in the bundle),
unlike the GHL API key.

---

## How it fits together

```
Browser                                GTM container                 Ad platforms
───────                                ─────────────                 ────────────
page loads ─────────────────────────▶ (auto) Page View  ───────────▶ GA4 page_view
opt-in success  ── dataLayer.push ──▶ Custom Event trigger ────────▶ GA4 generate_lead
  (src/slides/modal.js)                "generate_lead"                Meta Lead
quiz starts     ── dataLayer.push ──▶ "quiz_start"       ────────────▶ GA4/Meta custom event
quiz completed  ── dataLayer.push ──▶ "quiz_complete"    ────────────▶ GA4/Meta custom event
offer viewed    ── dataLayer.push ──▶ "view_offer"       ────────────▶ GA4 view_item / Meta ViewContent
Pay button click── dataLayer.push ──▶ "begin_checkout"   ────────────▶ GA4 begin_checkout
                                                                       Meta InitiateCheckout
```

The frontend only ever pushes plain events to `window.dataLayer` (see
`src/lib/analytics.js`). It has **no GA4 or Meta code in it at all** — GTM owns
the fan-out. That's what makes this reusable: swap the GTM container for a new
client and every tag inside it can be reconfigured without a redeploy.

### Files

| File | What it is |
|------|------------|
| `src/lib/analytics.js` | `track(event, params)` → pushes to `window.dataLayer`. |
| `src/slides/modal.js` | Fires `generate_lead` after a successful opt-in POST. |
| `src/welcome/main.js` | Fires `quiz_start`, `quiz_complete`, `view_offer`, `begin_checkout`. |
| `index.html`, `welcome.html` | GTM snippet, injected only if `VITE_GTM_ID` is set (EJS `<% if %>` in `<head>`/`<body>`, wired via `vite.config.js`). |
| `.env` → `VITE_GTM_ID` | The only ID that lives in code. Everything else lives in the GTM UI. |

`demo.html` (the iframed "What's Inside" preview) intentionally has **no** GTM
snippet — it's not a page real traffic lands on directly, so tagging it would
just double-count.

---

## 1. Google Tag Manager (do this first)

1. Go to [tagmanager.google.com](https://tagmanager.google.com) → **Create Account**.
   - Account name: the client's business name (e.g. "Onyx & Oak").
   - Container name: the domain (e.g. `thetradeslabs.com`).
   - Target platform: **Web**.
2. You'll get a container ID like `GTM-ABC1234`. Copy it.

   > **Web container vs. Server container.** If you later connect Meta's
   > Conversions API through GTM (Events Manager → Connect Data Sources →
   > choose the GTM server-side option), Meta auto-creates a **second**
   > container labelled "Server" (e.g. `GTM-PD6CS9LX`) alongside your "Web"
   > one. `VITE_GTM_ID` is **always the Web container** — the one bound to
   > your actual domain. The Server container is a separate GTM **Server-Side**
   > instance that needs its own hosting (Google Cloud) and its own URL; it
   > never goes in this repo or in any env var here. It's an optional
   > accuracy upgrade (better iOS/ad-blocker resilience via Conversions API),
   > not required for GA4/Meta Pixel tracking to work — skip it until the
   > browser-side setup below is confirmed working.

3. Set the **Web** container ID as an env var and redeploy:
   - **Vercel** → Project → Settings → Environment Variables → `VITE_GTM_ID` = `GTM-ABC1234` → redeploy.
   - **Railway** → Project → Variables → same.
   - **Netlify** → Site settings → Environment variables → same.
   - Locally: add `VITE_GTM_ID=GTM-ABC1234` to `.env`, restart `npm run dev`.
4. Confirm it's live: view page source on the deployed site, search for `GTM-`. You should see the snippet in `<head>` and the `<noscript>` iframe right after `<body>`.

Everything from here on happens **inside the GTM UI** — no more code changes.

---

## 2. GA4

1. [analytics.google.com](https://analytics.google.com) → Admin → **Create Property** (name it after the client/site).
2. Add a **Web** data stream for the funnel's domain → copy the **Measurement ID** (`G-XXXXXXX`).
3. Back in GTM:
   - **Tags → New → Google Tag** (the current GA4 tag type).
   - Tag ID: your `G-XXXXXXX`.
   - Trigger: **Initialization - All Pages** (built-in trigger).
   - Name it `GA4 - Config` and save. This single tag now sends `page_view` automatically on every page load.

### GA4 event tags (per conversion)

For each event below: **Triggers → New → Custom Event**, name matching exactly, then **Tags → New → GA4 Event** tag referencing the `GA4 - Config` tag as "Configuration Tag", using that trigger.

| dataLayer event (fires from code) | GTM trigger name | GA4 event name to send | Notes |
|---|---|---|---|
| `generate_lead` | `CE - generate_lead` | `generate_lead` | GA4 recommended event — opt-in submitted |
| `quiz_start` | `CE - quiz_start` | `quiz_start` | Custom event |
| `quiz_complete` | `CE - quiz_complete` | `quiz_complete` | Custom event; carries `lead_intent` (High/Medium/Low) as an event parameter — worth adding as a GA4 custom dimension later if you want to segment by it |
| `view_offer` | `CE - view_offer` | `view_offer` | Fires once, when the offer/pricing step is reached |
| `begin_checkout` | `CE - begin_checkout` | `begin_checkout` | GA4 recommended event — fires on the Pay button click, carries `currency: GBP`, `value: 1500` |

Use **Preview mode** in GTM (top-right "Preview" button) while clicking through the live funnel to confirm each trigger actually fires, then check **GA4 → Admin → DebugView** to see the events land in real time.

---

## 3. Meta (Facebook/Instagram) Pixel

1. [business.facebook.com/events_manager](https://business.facebook.com/events_manager) → **Connect Data Sources → Web → Meta Pixel** → name it, add the funnel domain → copy the **Pixel ID**.
2. Back in GTM, easiest path is the official template:
   - **Tags → New → choose a tag type → Discover more tag types in the Community Template Gallery** → search "Facebook Pixel" (by Meta/Facebook, "Community" verified) → Add.
   - Configure: Pixel ID = your ID, Trigger = **Initialization - All Pages**, Standard Event = `PageView`. Name it `Meta - Base Pixel`.
3. Add one more Facebook Pixel tag per conversion event, using the **same Custom Event triggers** created for GA4 above:

| GTM trigger (reused from above) | Meta standard/custom event | Notes |
|---|---|---|
| `CE - generate_lead` | `Lead` (standard) | Meta's core conversion event — use this one for ad optimisation |
| `CE - quiz_start` | Custom event `QuizStart` | Standard events don't cover this; use "Track as Custom Event" in the template |
| `CE - quiz_complete` | Custom event `QuizComplete` | Same |
| `CE - view_offer` | `ViewContent` (standard) | Closest standard match |
| `CE - begin_checkout` | `InitiateCheckout` (standard) | Pair with GHL's own Stripe purchase webhook (outside this repo) for the final `Purchase` event — the funnel itself never sees payment confirmation, only the checkout click |

4. Verify with the **Meta Pixel Helper** Chrome extension while clicking through the funnel in GTM Preview mode, or **Events Manager → Test Events** with your domain.

---

## 4. What this doesn't cover: the actual `Purchase` event

The funnel hands off to a GHL checkout page for payment (`VITE_GHL_CHECKOUT_URL`).
Nothing in this repo sees whether the payment succeeded, so **`begin_checkout` /
`InitiateCheckout` is the last event this code can fire.** To close the loop
with a true `Purchase` event:

- In **GHL**, add the Meta Pixel + GA4 Measurement Protocol (or GTM) to the
  checkout/thank-you page itself (GHL → Settings → Tracking Code, or a Custom
  HTML element on the order-confirmation step) — separate from this repo, since
  that page is hosted by GHL.
- For higher accuracy (and to survive iOS ad blockers), consider Meta's
  **Conversions API** fired server-side from the GHL "Payment Received" workflow
  (`docs/GHL-POST-PAYMENT-WORKFLOW.md` already documents that trigger) — that's
  a future enhancement, not required to get GA4/Meta reporting working today.

---

## Per-client reuse

Same pattern as GHL: new client = new GTM container + `VITE_GTM_ID`, nothing
in `src/` changes. The dataLayer event names (`generate_lead`, `quiz_start`,
`quiz_complete`, `view_offer`, `begin_checkout`) stay constant across every
funnel built off this codebase, so the same GTM container template can be
copied client-to-client (GTM → Admin → Export Container → import into the new
one) and only the GA4 Measurement ID + Meta Pixel ID inside it need swapping.
