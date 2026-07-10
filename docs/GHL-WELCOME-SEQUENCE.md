# GHL Welcome Email Sequence — Build Spec (Template Delivery Nurture)

Build this by hand in **GHL → Automation → Workflows** (the API can't create
workflows). It's the 7-email nurture that runs after someone opts in for the
free template — delivers it, then nudges toward "reply DFY" / a booked call
over 13 days.

> ⚠️ **Shared agency sub-account.** The trigger tag below (`Bathroom Template
> Lead`) is already unique to this funnel — it's the exact tag `services/handlers.js`
> applies on opt-in (`GHL_TAG_OPTIN` in `.env`). Just confirm no *other* funnel
> in this sub-account reuses that same tag name before you publish.

---

## 1. Trigger — no code change needed

The trigger already fires today: the moment someone submits the opt-in modal,
`POST /api/ghl/lead` tags the contact **`Bathroom Template Lead`**
(`src/slides/modal.js` → `handleLead` → `createOrUpdateContact`). You just need
a workflow listening for that tag.

**Workflow → Trigger → Tag Added → `Bathroom Template Lead`**

Workflow settings:
- **Re-entry:** Off (a contact should only run this sequence once).
- **Name:** `Bathroom Funnel — Template Welcome Sequence`

---

## 2. Tags this workflow needs

| Tag | Applied by | Purpose |
|---|---|---|
| `Bathroom Template Lead` | Already automatic (opt-in) | **Trigger** for this workflow |
| `Welcome Sequence Active` | Step 1 of this workflow (add on entry) | Reporting / filter who's mid-sequence |
| `DFY Requested` | **You, manually**, when a lead replies "DFY" or "YES" to any email | Exit signal |
| `Booked Call` | **You, manually**, when a lead replies with a day/books the call | Exit signal |
| `Paid` | Already automatic — set by the post-payment workflow (`docs/GHL-POST-PAYMENT-WORKFLOW.md`) | Exit signal |
| `Welcome Sequence Complete` | Last step of this workflow | Reporting — reached Email 7 with no response |

GHL doesn't parse email-reply *content* automatically — "DFY"/"YES" replies land
in **Conversations**, and you tag them yourself when you see one. That tag is
what stops the sequence (see Goals below), so a lead who replies never gets a
"someone else in {{city}}" email after they've already said yes. Turn on
reply notifications (Settings → Notifications) so you don't miss one during
the 13-day window.

### Goals (auto-exit the sequence early)

In the workflow builder → **Settings → Goals**, add all three — the contact
exits the moment *any* one is met:
- Tag Added → `DFY Requested`
- Tag Added → `Booked Call`
- Tag Added → `Paid`

---

## 3. Merge fields — gather these before you build

| Email placeholder | Source | Notes |
|---|---|---|
| `{{first_name}}` | `{{contact.first_name}}` — **native**, already populated at opt-in | No setup needed |
| `{{city}}` | `{{contact.city}}` — **native**, already populated (opt-in's "town" field is saved to both the standard City field and a custom field) | No setup needed |
| `{{template_link}}` | **New Custom Value** — Settings → Custom Values → `template_link` | The actual link/file for "your WOW template" — you need to decide what this points to (hosted template, Loom-recorded walkthrough + download, etc.) and paste the URL in once |
| `{{loom_link}}` | **New Custom Value** → `loom_link` | Record the 90-second "Google is killing bathroom fitters' websites" Loom, paste the share link |
| `{{phone}}` | **New Custom Value** → `business_phone` | **This is *your* number**, not the lead's — don't use `{{contact.phone}}` |
| `{{link}}` (Email 7) | Reuse `{{custom_values.template_link}}`, or a separate `{{custom_values.reengage_link}}` if you want a different destination | Your call |
| `{{business}}` | **Not captured today** — see below | |

Insert Custom Values in the GHL email editor as `{{custom_values.template_link}}`
(GHL's merge-tag picker will show them once created).

### `{{business}}` — the one gap

The opt-in form only collects name, email, and town — no business/company
name, so `{{business}}` has nothing to pull from for most leads (and Email 7
specifically targets people who *never replied*, so you can't rely on a
manual reply to fill it in either).

Two options, your call:
1. **Fallback copy (no code change, works today)** — in the workflow, add an
   **If/Else** before Email 7: *If Company Name is known → Email 7 Variant A*
   (uses `{{business}}`); *else → Email 7 Variant B* (generic close, no
   business mention). Both versions are below.
2. **Add a "Business name" field to the opt-in modal** so it's captured going
   forward (optional field, so it won't add friction/hurt conversion). Say
   the word and I'll wire it in — it's a small change (`src/slides/modal.html`
   + `modal.js` + one line in `services/ghl.js` mapping it to GHL's native
   `companyName` field).

This spec uses **option 1** so you're not blocked waiting on a code change.

---

## 4. Workflow steps (build in this order)

| # | Step | Timing |
|---|---|---|
| 1 | **Add Tag** → `Welcome Sequence Active` | On entry |
| 2 | **Send Email 1** — Delivery | Immediately |
| 3 | **Wait** | 2 days |
| 4 | **Send Email 2** — The Loom | Day 2 |
| 5 | **Wait** | 2 days |
| 6 | **Send Email 3** — Need a hand? | Day 4 |
| 7 | **Wait** | 2 days |
| 8 | **Send Email 4** — Guarantee | Day 6 |
| 9 | **Wait** | 2 days |
| 10 | **Send Email 5** — The call | Day 8 |
| 11 | **Wait** | 2 days |
| 12 | **Send Email 6** — Scarcity | Day 10 |
| 13 | **Wait** | 3 days |
| 14 | **If/Else** → Company Name known? → **Send Email 7A** / **Send Email 7B** | Day 13 |
| 15 | **Add Tag** → `Welcome Sequence Complete` | After Email 7 |

*(Optional polish: in workflow Settings you can set an execution window, e.g.
8am–7pm, so emails never send at 3am if a step lands overnight.)*

---

## 5. Email copy (paste into GHL — subject + body)

### Email 1 — Delivery
**Subject:** Your WOW template
```
Hey {{contact.first_name}},

Here's your template: {{custom_values.template_link}}

Fair warning — it's the skeleton, not the finished thing. The magic only shows up once your own photos and your own work are in it.

Set it up yourself and you'll get there. Or reply "DFY" and we'll do the whole lot for you, live on your domain, while you get on with the job.

Scott
Founder, TradesLab
```

### Email 2 — The Loom
**Subject:** Google is killing bathroom fitters' websites
```
Hey {{contact.first_name}},

Google's just done something to bathroom fitters' websites that almost nobody in the trade has clocked yet.

90 seconds. I'll show you rather than tell you: {{custom_values.loom_link}}

Scott
```

### Email 3 — Need a hand?
**Subject:** how's the setup going?
```
Hey {{contact.first_name}},

Just checking in — did you get the template up and running, or is it still sat in your downloads?

Most fitters get stuck in the same two places: the photo sizing, and the scroll timing. If that's you, reply and tell me where you're at. I'll point you in the right direction, no charge.

And if you've decided you'd rather not spend your evenings fighting a website — say the word. We'll build it for you.

Scott
```

### Email 4 — Guarantee
**Subject:** if you don't love it, you don't pay
```
Hey {{contact.first_name}},

Let me take the risk off the table entirely.

We build your site. You see it live, scroll it yourself, watch your own work reveal on the screen.

If it doesn't give you goosebumps — you walk. You pay nothing.

I'll only take that bet because I've seen what happens when a fitter watches his own tiling come up on that screen for the first time. Nobody walks.

Want yours built? Reply YES.

Scott
```

### Email 5 — The call
**Subject:** free today?
```
Hey {{contact.first_name}},

I've got a bit of time today to go through your website with you — what's working, what's costing you jobs, and what it'd look like with the Cinematic Effect on it.

Twenty minutes, no pitch you can't hang up on.

Today, or is Tuesday better? Just reply with a day.

Or ring me direct: {{custom_values.business_phone}}

Scott
```

### Email 6 — Scarcity
**Subject:** someone else in {{contact.city}}
```
Hey {{contact.first_name}},

Heads up — I'm speaking to another bathroom fitter in {{contact.city}} this week.

We only build one of these per area. Can't have two firms in the same town with the same weapon, wouldn't be fair on either of you. So it goes to whoever says yes first.

You've had first refusal since I sent that video. I'd rather it was you.

Reply YES and I'll hold {{contact.city}} for you. Or ring me: {{custom_values.business_phone}}

Scott
```

### Email 7A — The breakup (Company Name known)
**Subject:** closing your file
```
Hey {{contact.first_name}},

I've come at you a few times now and not heard back, so I'll take the hint — the timing's probably not right, and I'd rather not clutter your inbox.

I'll close your file today. No hard feelings at all.

If it ever changes, you know where I am: {{link}}

Either way — good luck with {{business}}. From what I've seen of your work, you deserve to be found.

Scott
```

### Email 7B — The breakup (Company Name unknown — fallback)
**Subject:** closing your file
```
Hey {{contact.first_name}},

I've come at you a few times now and not heard back, so I'll take the hint — the timing's probably not right, and I'd rather not clutter your inbox.

I'll close your file today. No hard feelings at all.

If it ever changes, you know where I am: {{custom_values.reengage_link}}

Either way — good luck out there. From what I've seen of your work, you deserve to be found.

Scott
```

---

## 6. Before you publish — checklist

1. Create the 3 Custom Values: `template_link`, `loom_link`, `business_phone`
   (Settings → Custom Values). `reengage_link` too if you want Email 7B to
   point somewhere different from the template link.
2. Record the 90-second Loom for Email 2.
3. Decide what `{{template_link}}` actually is (hosted duplicate-able
   template? A page with instructions + download? The live demo?) and get
   that link ready.
4. Build the workflow steps above, add the 3 Goals, publish.
5. Test: tag a spare/test contact `Bathroom Template Lead` manually, confirm
   Email 1 fires immediately and the wait steps are queued correctly (GHL
   shows the scheduled send times on the contact's timeline).

---

## 7. Prompt for GHL's Workflow AI builder

Do the 3 Custom Values + the Loom recording (checklist above) **first** —
paste this into GHL's AI workflow builder afterward so it can reference them.

```
Create a workflow called "Bathroom Funnel — Template Welcome Sequence".

Trigger: Contact Tag Added — tag = "Bathroom Template Lead". Turn re-entry off.

Step 1: Add Tag "Welcome Sequence Active".

Step 2: Send Email, immediately.
Subject: Your WOW template
Body:
Hey {{contact.first_name}},

Here's your template: {{custom_values.template_link}}

Fair warning — it's the skeleton, not the finished thing. The magic only shows up once your own photos and your own work are in it.

Set it up yourself and you'll get there. Or reply "DFY" and we'll do the whole lot for you, live on your domain, while you get on with the job.

Scott
Founder, TradesLab

Step 3: Wait 2 days.

Step 4: Send Email.
Subject: Google is killing bathroom fitters' websites
Body:
Hey {{contact.first_name}},

Google's just done something to bathroom fitters' websites that almost nobody in the trade has clocked yet.

90 seconds. I'll show you rather than tell you: {{custom_values.loom_link}}

Scott

Step 5: Wait 2 days.

Step 6: Send Email.
Subject: how's the setup going?
Body:
Hey {{contact.first_name}},

Just checking in — did you get the template up and running, or is it still sat in your downloads?

Most fitters get stuck in the same two places: the photo sizing, and the scroll timing. If that's you, reply and tell me where you're at. I'll point you in the right direction, no charge.

And if you've decided you'd rather not spend your evenings fighting a website — say the word. We'll build it for you.

Scott

Step 7: Wait 2 days.

Step 8: Send Email.
Subject: if you don't love it, you don't pay
Body:
Hey {{contact.first_name}},

Let me take the risk off the table entirely.

We build your site. You see it live, scroll it yourself, watch your own work reveal on the screen.

If it doesn't give you goosebumps — you walk. You pay nothing.

I'll only take that bet because I've seen what happens when a fitter watches his own tiling come up on that screen for the first time. Nobody walks.

Want yours built? Reply YES.

Scott

Step 9: Wait 2 days.

Step 10: Send Email.
Subject: free today?
Body:
Hey {{contact.first_name}},

I've got a bit of time today to go through your website with you — what's working, what's costing you jobs, and what it'd look like with the Cinematic Effect on it.

Twenty minutes, no pitch you can't hang up on.

Today, or is Tuesday better? Just reply with a day.

Or ring me direct: {{custom_values.business_phone}}

Scott

Step 11: Wait 2 days.

Step 12: Send Email.
Subject: someone else in {{contact.city}}
Body:
Hey {{contact.first_name}},

Heads up — I'm speaking to another bathroom fitter in {{contact.city}} this week.

We only build one of these per area. Can't have two firms in the same town with the same weapon, wouldn't be fair on either of you. So it goes to whoever says yes first.

You've had first refusal since I sent that video. I'd rather it was you.

Reply YES and I'll hold {{contact.city}} for you. Or ring me: {{custom_values.business_phone}}

Scott

Step 13: Wait 3 days.

Step 14: If/Else — condition: Contact's Company Name is known (not empty).

  IF branch — Send Email.
  Subject: closing your file
  Body:
  Hey {{contact.first_name}},

  I've come at you a few times now and not heard back, so I'll take the hint — the timing's probably not right, and I'd rather not clutter your inbox.

  I'll close your file today. No hard feelings at all.

  If it ever changes, you know where I am: {{custom_values.template_link}}

  Either way — good luck with {{contact.company_name}}. From what I've seen of your work, you deserve to be found.

  Scott

  ELSE branch — Send Email.
  Subject: closing your file
  Body:
  Hey {{contact.first_name}},

  I've come at you a few times now and not heard back, so I'll take the hint — the timing's probably not right, and I'd rather not clutter your inbox.

  I'll close your file today. No hard feelings at all.

  If it ever changes, you know where I am: {{custom_values.reengage_link}}

  Either way — good luck out there. From what I've seen of your work, you deserve to be found.

  Scott

Step 15: Add Tag "Welcome Sequence Complete".

Goals (exit the workflow immediately if any of these happen, at any step):
- Contact Tag Added = "DFY Requested"
- Contact Tag Added = "Booked Call"
- Contact Tag Added = "Paid"
```

If the AI builder asks you to confirm merge fields it can't resolve, point it
at: `template_link`, `loom_link`, `business_phone`, `reengage_link` (all
Custom Values you created in the checklist above) and the native `Company
Name` contact field.
