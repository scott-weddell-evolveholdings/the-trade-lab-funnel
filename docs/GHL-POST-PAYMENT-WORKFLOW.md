# GHL Post-Payment Workflow — Build Spec

Build this by hand in **GHL → Automation → Workflows** (the API can't create
workflows). It fires when someone buys the £1,500 site and: tags them **Paid**,
moves their opportunity to **Won**, emails a receipt + onboarding form, and
notifies you.

> ⚠️ **This is a shared agency sub-account** (95+ workflows). The trigger MUST be
> filtered to *this funnel's* order form / product, or it will act on every
> payment in the whole account.

---

## Reference IDs (this location)

- **Pipeline:** Bathroom Funnel — `sVxnmxXTl4zSd8o50LER`
- **Stage → Won:** `c2f50a38-fe66-4869-ad10-d81a9efd7922`
- Checkout: `https://go.thetradeslabs.com/checkout`

---

## Workflow: "Bathroom Funnel — Payment Received (Fulfilment)"

### Trigger
Use **one** of these, and **filter it to this funnel only**:
- **Order Form Submitted** → filter: *Funnel/Website = (your Bathroom Funnel checkout)* (and Step = the order-form step). ← preferred
- or **Payment Received** → filter: *Product = "Done-For-You Cinematic Website"* (or Amount = 1500 GBP).

### Actions (in order)

1. **Add Contact Tag** → `Paid`  *(optionally also `Bathroom Funnel Customer`)*
2. **Create/Update Opportunity**
   - Pipeline: **Bathroom Funnel**
   - Stage: **Won**
   - Status: **Won**
   - (Leave name/value as-is — it updates the opportunity created at quiz completion.)
3. **Send Email** → the customer receipt + onboarding (copy below).
4. **Send Internal Notification** (Email or Slack) → notify you of the sale (copy below).
5. *(optional)* **Wait 1 day** → **If/Else**: onboarding form NOT submitted → send a reminder email/SMS.

Publish the workflow. Do a £0/test order (or GHL test mode) to confirm each step fires.

---

## Copy to paste

### 1) Customer email — receipt + onboarding
**Subject:** You're in — your new website build has started 🎉

```
Hi {{contact.first_name}},

Payment received — thank you! Your Done-For-You Cinematic Website is officially
in production.

What happens next:
1. Complete your 2-minute onboarding form → {{onboarding_form_link}}
2. We design, write and build your site.
3. It's live within 7 days of receiving your details — or your money back.

Your order:
• Done-For-You Cinematic Website — £1,500 (paid in full)
• One-off · you own it outright · 1 year hosting + 30 days support included

The sooner you complete the onboarding form, the sooner your 7-day clock starts.
Any questions, just reply to this email.

— The Trades Lab
hello@thetradeslabs.com
```
> Replace `{{onboarding_form_link}}` with your GHL onboarding form/survey URL.

### 2) Internal notification — notify you
**Subject:** 💷 New sale — {{contact.first_name}} {{contact.last_name}} (£1,500 Bathroom Funnel)

```
New Done-For-You Website sale.

Name:  {{contact.first_name}} {{contact.last_name}}
Email: {{contact.email}}
Phone: {{contact.phone}}
Town:  {{contact.town}}
Amount: £1,500 — Opportunity moved to WON (Bathroom Funnel).

Next: confirm onboarding form is submitted, then start the build.
```
> Send to your address (e.g. scott@evolvemediasolutions.com) or a Slack channel.

---

## Onboarding form (build as a GHL Form/Survey, link it in the email)

Keep it short — the funnel promised "2 minutes":

1. Business name
2. Your name + best contact number
3. Service area / towns you cover
4. Services offered (checkboxes: full bathroom refit · wet rooms · en-suites · accessible · other)
5. Before/after photos (file upload) — or "none yet"
6. Logo (upload) — or "need one designed?"
7. Brand colours / style preference (optional)
8. Google Business Profile link (optional)
9. 2–3 recent reviews (paste or link)
10. Domain — own one already? (yes: which / no: need help)
11. Anything specific you want on the site?

> Then point workflow **"1. Onboarding Form Submitted"** (already in this account)
> or a new step at the onboarding form so you're notified when it's returned.
