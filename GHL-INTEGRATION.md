# GoHighLevel (GHL) Integration

Reusable CRM integration for the bathroom lead-magnet + quiz funnel. Every
client-specific value lives in environment variables, so the **same code runs
for any client / GHL sub-account** — you only swap the `.env`.

The GHL API key is **never** in the browser bundle. The frontend only calls two
of our own backend routes; those routes (Netlify Functions) call GHL server-side.

---

## How it fits together

```
Browser (opt-in form)            Backend (Netlify Functions)         GoHighLevel
─────────────────────            ───────────────────────────         ───────────
opt-in submit ───────POST /api/ghl/lead──▶ services/ghl.js ──────▶ create/update contact
                                            createOrUpdateContact      + opt-in tag + source
        ▼ (on success → welcome.html)
quiz complete ───────POST /api/ghl/quiz──▶ services/ghl.js ──────▶ update same contact
                                            updateContactWithQuiz      + quiz fields + tags
                                            addNote                    + summary note
                                            createOpportunity          + opportunity (optional)
```

### Files

| File | What it is |
|------|------------|
| `services/ghl.js` | Reusable, framework-agnostic GHL API client. **Server-only.** |
| `netlify/functions/ghl-lead.js` | Serves `POST /api/ghl/lead` (opt-in). |
| `netlify/functions/ghl-quiz-start.js` | Serves `POST /api/ghl/quiz-start` (quiz opened → "Quiz Started" tag). |
| `netlify/functions/ghl-quiz.js` | Serves `POST /api/ghl/quiz` (quiz completion). |
| `.env.example` | Every config value. Copy to `.env`. |
| `netlify.toml` | Build + functions config. |
| `src/slides/modal.js` | Opt-in form → `/api/ghl/lead`. |
| `src/welcome/main.js` | Quiz completion → `/api/ghl/quiz`. |

> The public URLs `/api/ghl/lead` and `/api/ghl/quiz` are set by
> `export const config = { path: '...' }` inside each function — no redirects
> needed.

---

## Configuration — where each value goes

All configuration is environment variables. **Copy `.env.example` → `.env`** and
fill it in (local dev), and/or paste the same values into
**Netlify → Site settings → Environment variables** (production). Never commit a
real `.env`.

### 1. GHL API key
`GHL_API_KEY=` — a **Private Integration token** (GHL → *Settings → Private
Integrations → Create*, with **Contacts** and **Opportunities** scopes) or a
Location API key. This is the only secret; it stays server-side.

### 2. Location ID
`GHL_LOCATION_ID=` — the sub-account ID (GHL → *Settings → Business Info*, or the
`locationId` in the URL when inside the sub-account).

### 3. Custom field IDs
Paste the **field ID** (not the label) for each:

```
GHL_FIELD_TOWN=
GHL_FIELD_FUNNEL_SOURCE=
GHL_FIELD_QUIZ_RESPONSE_1=
GHL_FIELD_QUIZ_RESPONSE_2=
GHL_FIELD_QUIZ_RESPONSE_3=
GHL_FIELD_QUIZ_RESULT=
GHL_FIELD_SERVICE_INTEREST=
GHL_FIELD_LEAD_INTENT=
```

Find IDs in GHL → *Settings → Custom Fields* (create these fields first if they
don't exist), or list them via
`GET https://services.leadconnectorhq.com/locations/{locationId}/customFields`
(with the `Authorization: Bearer` and `Version: 2021-07-28` headers).
**Any field left blank is simply skipped** — nothing breaks.

### 4. Pipeline / Stage IDs
```
GHL_PIPELINE_ID=
GHL_STAGE_ID=
```
Set **both** to create an opportunity when the quiz completes. Leave either blank
to skip opportunity creation entirely. Find them in GHL → *Settings → Pipelines*
(or `GET /opportunities/pipelines?locationId=...`).

### 5. Tags (plain names — auto-created in GHL)
```
GHL_TAG_OPTIN=Bathroom Template Lead     # added on opt-in
GHL_TAG_QUIZ_STARTED=Quiz Started        # added when the quiz is opened (/api/ghl/quiz-start)
GHL_TAG_QUIZ_COMPLETED=Quiz Completed    # added on quiz completion
GHL_TAG_HIGH_INTENT=High Intent Lead     # added when leadIntent = "High"
```
The quiz also adds a **dynamic town tag** (`"{town} Lead"`, e.g. `Manchester Lead`)
and a service tag (`GHL_TAG_SERVICE`, default `Bathroom Remodel Lead`).

### 6. Optional overrides (defaults applied if blank)
```
GHL_FUNNEL_SOURCE=Bathroom Website Template Funnel   # saved to the funnel-source field
GHL_TAG_SERVICE=Bathroom Remodel Lead                # extra tag after quiz
GHL_OPPORTUNITY_NAME_SUFFIX=Bathroom Funnel Lead     # opp title = "{name} - {suffix}"
```

---

## Reuse for another client (change only `.env`)

1. Create the client's GHL sub-account custom fields, tags, and (optionally) a
   pipeline + stage.
2. Copy `.env.example` and fill in **that client's** `GHL_API_KEY`,
   `GHL_LOCATION_ID`, field IDs, pipeline/stage IDs, and any tag/label overrides.
3. Deploy (or point a new Netlify site at the same repo with that client's env
   vars). **No code changes.**

The only funnel-specific copy in code is in `src/welcome/main.js`
(`SERVICE_INTEREST` and the `deriveLeadIntent` rules) — both marked with
`⚠️ CHANGE ME` comments if you want to tailor the quiz mapping per niche.

---

## API reference

### `POST /api/ghl/lead`
```json
{ "name": "Mark Thompson", "email": "mark@example.com", "town": "Manchester" }
```
→ validates, creates/updates the contact, adds the opt-in tag, saves the funnel
source. Response: `{ "success": true, "contactId": "..." }`. The quiz only starts
after a successful response.

### `POST /api/ghl/quiz-start`
```json
{ "email": "mark@example.com" }
```
→ adds the `Quiz Started` tag to the contact (fire-and-forget when the quiz
opens, so you can see quiz opens vs completions). Non-blocking.

### `POST /api/ghl/quiz`
```json
{
  "email": "mark@example.com",
  "name": "Mark Thompson",
  "town": "Manchester",
  "quizResponses": { "Q1": "A1", "Q2": "A2", "Q3": "A3" },
  "quizResult": "High Intent Remodel Lead",
  "serviceInterest": "Bathroom Remodeling",
  "leadIntent": "High"
}
```
→ finds the same contact by email, saves quiz custom fields, adds
`Quiz Completed` + `High Intent Lead` (if `leadIntent` is `High`) +
`{town} Lead` + service tag, writes a summary note, and creates an opportunity
if a pipeline/stage is configured. Response:
`{ "success": true, "contactId": "...", "tags": [...], "opportunity": {...}|null }`.
Errors here are non-blocking on the frontend — the user still sees their result.

---

## Local development

Vite's dev server (`npm run dev`) does **not** run the functions. To exercise the
API routes locally use the Netlify CLI:

```bash
npm i -g netlify-cli      # once
cp .env.example .env      # fill in real values
netlify dev               # serves the site + /api/ghl/* on one port
```

Without a `.env`/CLI, the funnel still works end-to-end visually — the opt-in
will just show the friendly error (no backend to answer `/api/ghl/lead`), which
is expected until deployed or run under `netlify dev`.

## Deploy (Netlify)

1. Connect the repo to Netlify (build command `npm run build`, publish `dist`,
   functions `netlify/functions` — already in `netlify.toml`).
2. Add all `.env` values under **Site settings → Environment variables**.
3. Deploy. The routes are live at `https://<site>/api/ghl/lead` and `/api/ghl/quiz`.

---

## Security notes

- `GHL_*` variables are **not** prefixed with `VITE_`, so Vite never inlines them
  into the browser bundle. Only the functions runtime can read them.
- The browser only ever sees `/api/ghl/lead` and `/api/ghl/quiz`.
- Never `import '../../services/ghl.js'` from anything under `src/` — that would
  pull the key into the frontend. Frontend talks to the routes via `fetch` only.
