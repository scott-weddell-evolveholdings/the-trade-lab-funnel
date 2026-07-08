import faviconUrl from '../assets/trades-lab-favicon.svg'
import { initAutoPlay } from '../demos/after-site.js'
import './styles/welcome.css'

// ── Favicon ───────────────────────────────────────────────
if (!document.querySelector('link[data-app-favicon]')) {
  const fav = document.createElement('link')
  fav.rel = 'icon'
  fav.type = 'image/svg+xml'
  fav.href = faviconUrl
  fav.dataset.appFavicon = ''
  document.head.appendChild(fav)
}

// ── ROI data by Q4 job-value tier (one-off bathroom jobs) ──
const ROI_DATA = {
  'under-4k': {
    clientValue: '£3,500',
    low:  '£7,000',
    high: '£14,000',
    tierCopy: 'Two extra installs and your site has paid for itself several times over.',
  },
  '4-8k': {
    clientValue: '£6,000',
    low:  '£12,000',
    high: '£24,000',
    tierCopy: 'At £6,000 a job, a single extra install covers this site four times over.',
  },
  '8-12k': {
    clientValue: '£10,000',
    low:  '£20,000',
    high: '£40,000',
    tierCopy: 'One £10k install and you are miles into profit — for years.',
  },
  '12k-plus': {
    clientValue: '£12,000+',
    low:  '£24,000',
    high: '£48,000',
    tierCopy: 'Your site pays for itself before the first job is even finished.',
  },
}

const DEFAULT_ROI = ROI_DATA['4-8k']

// ── Step machine ──────────────────────────────────────────
const steps = ['hero', 'quiz', 'result', 'offer', 'buy']
const stepEls = {}
steps.forEach((id) => {
  stepEls[id] = document.querySelector(`[data-step="${id}"]`)
})

let offerDemoStarted = false

function showStep(id) {
  steps.forEach((s) => {
    const el = stepEls[s]
    if (!el) return
    if (s === id) {
      el.removeAttribute('hidden')
      requestAnimationFrame(() => {
        el.classList.add('wl-step--entering')
        el.addEventListener('animationend', () => el.classList.remove('wl-step--entering'), { once: true })
      })
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (id === 'offer' && !offerDemoStarted) {
        offerDemoStarted = true
        requestAnimationFrame(initAutoPlay)
      }
    } else {
      el.setAttribute('hidden', '')
      el.classList.remove('wl-step--entering')
    }
  })
}

// ── Quiz state ────────────────────────────────────────────
const answers = {}
let currentQuizStep = 1
const TOTAL_QUIZ_STEPS = 5

const quizStepPanels = document.querySelectorAll('[data-quiz-step]')
const progressFill   = document.getElementById('quizProgressFill')
const progressLabel  = document.getElementById('quizProgressLabel')
const backBtn        = document.getElementById('quizBack')

function setQuizStep(n) {
  currentQuizStep = n

  quizStepPanels.forEach((el) => {
    const stepNum = parseInt(el.dataset.quizStep, 10)
    if (stepNum === n) {
      el.removeAttribute('hidden')
      requestAnimationFrame(() => {
        el.classList.add('wl-quiz__step--entering')
        el.addEventListener('animationend', () => el.classList.remove('wl-quiz__step--entering'), { once: true })
      })
    } else {
      el.setAttribute('hidden', '')
    }
  })

  const pct = Math.round((n / TOTAL_QUIZ_STEPS) * 100)
  progressFill.style.width = `${pct}%`
  progressLabel.textContent = `Question ${n} of ${TOTAL_QUIZ_STEPS}`
  backBtn.toggleAttribute('hidden', n <= 1)
}

// ── GHL quiz sync ─────────────────────────────────────────
// Posts the completed quiz to our backend route /api/ghl/quiz, which updates the
// SAME GoHighLevel contact (matched by email) server-side. No API key in the browser.
const QUIZ_ENDPOINT = '/api/ghl/quiz'
const LEAD_STORAGE_KEY = 'tl-lead' // written by the opt-in modal (src/slides/modal.js)

// Human-readable labels — this is what actually gets saved to the CRM.
const ANSWER_LABELS = {
  diy: {
    'very-likely': 'Very likely — tech savvy',
    'would-try': 'Would try but might get stuck',
    'no-time': 'Probably not — no time',
    'not-a-chance': 'Wants it fully done-for-them',
  },
  delay: {
    'few-months': 'Putting it off a few months',
    'over-a-year': 'Putting it off over a year',
    'never-priority': 'Never made it a priority',
    'just-starting': 'Just getting started',
  },
  google: {
    'page-one': 'On Google page one',
    'not-page-one': 'On Google, not page one',
    'have-listing': 'Has a listing, never checked',
    'not-showing': 'Not showing up on Google',
  },
  revenue: {
    'under-4k': 'Under £4k / job',
    '4-8k': '£4k–£8k / job',
    '8-12k': '£8k–£12k / job',
    '12k-plus': '£12k+ / job',
  },
  growth: {
    '1-2': '1–2 extra jobs/mo',
    '3-4': '3–4 extra jobs/mo',
    '5-6': '5–6 extra jobs/mo',
    '7-plus': '7+ extra jobs/mo',
  },
}
const QUESTION_TITLES = {
  diy: 'Would set it up themselves',
  revenue: 'Typical job value',
  growth: 'Growth goal',
  google: 'Google visibility',
  delay: 'How long delayed',
}
const labelFor = (field, val) => ANSWER_LABELS[field]?.[val] || val || '—'

// ⚠️ CHANGE ME per client: the service this funnel sells.
const SERVICE_INTEREST = 'Cinematic Bathroom Website'

/** Derive lead intent (High / Medium / Low) from the answers. Tweak the rules freely. */
function deriveLeadIntent(a) {
  const wantsDoneForThem = a.diy === 'no-time' || a.diy === 'not-a-chance'
  const ambitious = a.growth === '5-6' || a.growth === '7-plus'
  const highValue = a.revenue === '8-12k' || a.revenue === '12k-plus'
  const selfSufficient = a.diy === 'very-likely' && a.google === 'page-one'

  if (wantsDoneForThem && (ambitious || highValue)) return 'High'
  if (selfSufficient) return 'Low'
  if (wantsDoneForThem || ambitious || highValue) return 'High'
  return 'Medium'
}

function getStoredLead() {
  try { return JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY) || '{}') } catch { return {} }
}

// Fire-and-forget: tag the contact "Quiz Started" the moment the quiz opens.
let quizStartedSent = false
function markQuizStarted() {
  if (quizStartedSent) return
  const lead = getStoredLead()
  if (!lead.email) return
  quizStartedSent = true
  fetch('/api/ghl/quiz-start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: lead.email }),
  }).catch((err) => console.warn('[quiz] quiz-start tag failed (ignored):', err))
}

/** POST the completed quiz to the backend. Non-blocking: it never throws. */
async function submitQuizToGHL() {
  const lead = getStoredLead()
  if (!lead.email) {
    console.warn('[quiz] no stored lead email — skipping GHL sync')
    return
  }
  const leadIntent = deriveLeadIntent(answers)
  // Ordered so the three most sales-relevant answers land in QUIZ_RESPONSE_1..3.
  const quizResponses = {
    [QUESTION_TITLES.diy]: labelFor('diy', answers.diy),
    [QUESTION_TITLES.revenue]: labelFor('revenue', answers.revenue),
    [QUESTION_TITLES.growth]: labelFor('growth', answers.growth),
    [QUESTION_TITLES.google]: labelFor('google', answers.google),
    [QUESTION_TITLES.delay]: labelFor('delay', answers.delay),
  }
  const payload = {
    email: lead.email,
    name: lead.name || '',
    town: lead.town || '',
    quizResponses,
    quizResult: `${leadIntent} Intent — ${SERVICE_INTEREST}`,
    serviceInterest: SERVICE_INTEREST,
    leadIntent,
  }
  try {
    const res = await fetch(QUIZ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`quiz sync ${res.status}`)
  } catch (err) {
    // Non-blocking by design — the user still sees their result.
    console.error('[quiz] GHL sync failed (continuing anyway):', err)
  }
}

// Lightweight loading overlay while the result is prepared.
function showQuizLoading(on) {
  let el = document.getElementById('wl-quiz-loading')
  if (on) {
    if (!el) {
      el = document.createElement('div')
      el.id = 'wl-quiz-loading'
      el.innerHTML = '<div class="wl-quiz-loading__spinner"></div><p>Analysing your answers…</p>'
      document.body.appendChild(el)
    }
    requestAnimationFrame(() => el.classList.add('is-visible'))
  } else if (el) {
    el.classList.remove('is-visible')
    setTimeout(() => el.remove(), 300)
  }
}

/** Finish: show loading, sync to GHL (capped so a slow/failed CRM never blocks), reveal result. */
async function finishQuiz() {
  showQuizLoading(true)
  const cap = new Promise((r) => setTimeout(r, 2500))
  await Promise.race([submitQuizToGHL(), cap])
  showQuizLoading(false)
  buildResultPage()
  showStep('result')
}

function handleOptionSelect(optionBtn) {
  const field = optionBtn.closest('[data-quiz-field]').dataset.quizField
  const value = optionBtn.dataset.value

  optionBtn.closest('[data-quiz-field]').querySelectorAll('.wl-quiz__option').forEach((o) => {
    o.classList.remove('wl-quiz__option--selected')
  })
  optionBtn.classList.add('wl-quiz__option--selected')

  answers[field] = value
  sessionStorage.setItem('wl-quiz-answers', JSON.stringify(answers))

  setTimeout(() => {
    if (currentQuizStep < TOTAL_QUIZ_STEPS) {
      setQuizStep(currentQuizStep + 1)
    } else {
      finishQuiz()
    }
  }, 280)
}

function restoreAnswers() {
  const saved = sessionStorage.getItem('wl-quiz-answers')
  if (!saved) return
  try { Object.assign(answers, JSON.parse(saved)) } catch (_) { /* ignore */ }
}

// ── Result page builder ───────────────────────────────────
function buildResultPage() {
  const roi = ROI_DATA[answers.revenue] || DEFAULT_ROI

  // ── Headline + eyebrow + sub ────────────────────────────
  const headlineEl = document.getElementById('resultHeadline')
  const subEl      = document.getElementById('resultSub')
  const eyebrowEl  = document.getElementById('resultEyebrow')

  if (answers.diy === 'very-likely' && answers.google === 'page-one') {
    eyebrowEl.textContent = "You're ahead of most"
    headlineEl.innerHTML  = `You could handle this yourself —<br><em>but here's what's worth knowing.</em>`
    subEl.textContent     = "You've got the skills and the Google presence. Here's where owner-operators still leave money on the table."
  } else if (answers.diy === 'not-a-chance' || answers.diy === 'no-time') {
    eyebrowEl.textContent = "Good news"
    headlineEl.innerHTML  = `It makes a lot of sense<br><em>for us to build this for you.</em>`
    subEl.textContent     = "You already know you don't want to deal with this. Here's exactly what we'd take off your plate."
  } else {
    eyebrowEl.textContent = "Good news"
    headlineEl.innerHTML  = `It makes a lot of sense<br><em>for us to build this for you.</em>`
    subEl.textContent     = "Here's what your answers actually tell us."
  }

  // ── Answer chips ───────────────────────────────────────
  const CHIP_DATA = {
    google: {
      'page-one':      { icon: '✓', label: 'On Google page one' },
      'not-page-one':  { icon: '↓', label: 'Not on page one yet' },
      'have-listing':  { icon: '~', label: 'Listing — never checked ranking' },
      'not-showing':   { icon: '✗', label: 'Not showing up on Google' },
    },
    delay: {
      'few-months':    { icon: '⏱', label: 'A few months behind' },
      'over-a-year':   { icon: '⏱', label: 'Putting it off 1+ years' },
      'never-priority':{ icon: '⏱', label: 'Never made it a priority' },
      'just-starting': { icon: '→', label: 'Just getting started' },
    },
    growth: {
      '1-2':     { icon: '+', label: '1–2 extra jobs/mo goal' },
      '3-4':     { icon: '+', label: '3–4 extra jobs/mo goal' },
      '5-6':     { icon: '+', label: '5–6 extra jobs/mo goal' },
      '7-plus':  { icon: '+', label: '7+ extra jobs/mo goal' },
    },
  }

  const chipsEl = document.getElementById('resultChips')
  chipsEl.innerHTML = ['google', 'delay', 'growth']
    .filter(k => answers[k] && CHIP_DATA[k]?.[answers[k]])
    .map(k => {
      const c = CHIP_DATA[k][answers[k]]
      return `<div class="wl-result__chip"><span class="wl-result__chip-icon">${c.icon}</span>${c.label}</div>`
    })
    .join('')

  // ── Breakdown ──────────────────────────────────────────
  const DELAY_COPY = {
    'few-months':    "You've had this on your radar for a few months.",
    'over-a-year':   "You've been putting this off for over a year — you probably already know it's long overdue.",
    'never-priority':"This has never quite made it to the top of the list, and between being on the tools and managing customers, that's completely understandable.",
    'just-starting': "You're just getting started, which means the window to do this right is wide open.",
  }
  const DIY_COPY = {
    'very-likely':  "You're confident enough to set things up yourself.",
    'would-try':    "You'd give it a shot, but realistically you'd probably hit a wall somewhere along the way.",
    'no-time':      "Between being on the tools, quoting jobs, and managing customers — there's just no realistic window to sit down and build this.",
    'not-a-chance': "You don't want to touch it. You want someone to handle it and hand it to you done.",
  }
  const GOOGLE_COPY = {
    'page-one':    "You've got some Google presence, which is a real head start — but showing up on page one without a conversion-optimised site is still leaving enquiries on the table.",
    'not-page-one':"You're on Google somewhere, but not page one — which means every homeowner searching right now is finding another fitter instead.",
    'have-listing':"You have a listing but you've never really tracked where you rank. Chances are it's not where you'd want to be.",
    'not-showing': "Right now, when someone in your town searches for bathroom fitters, you're not in the results. That's enquiries going to someone else every single day.",
  }

  const para1 = [DELAY_COPY[answers.delay], DIY_COPY[answers.diy]].filter(Boolean).join(' ')
  const para2 = GOOGLE_COPY[answers.google] || ''

  document.getElementById('resultBreakdown').innerHTML = `
    <p>${para1}</p>
    <p>${para2}</p>
    <p class="wl-result__breakdown-hook">Here's what that's actually costing you:</p>
  `

  // ── ROI block ──────────────────────────────────────────
  document.getElementById('resultRoi').innerHTML = `
    <p class="wl-result__roi-intro">
      Every month you're not on page one, homeowners are searching and calling another fitter.
      Based on what you shared, your average job is worth around <strong>${roi.clientValue}</strong>.
    </p>
    <p class="wl-result__roi-body">
      Bathroom businesses with a properly built, SEO-optimised cinematic site typically win 2–4 extra jobs within the first 90 days.
      That's <strong>${roi.low} to ${roi.high}</strong> in new work — from a single one-time investment.
    </p>
    <div class="wl-result__roi-callout">
      <p>${roi.tierCopy}</p>
    </div>
    <p class="wl-result__roi-close">Most clients are profitable from the very first new job.</p>
  `

  // ── Close ──────────────────────────────────────────────
  const GROWTH_COPY = {
    '1-2':    'Even winning 1–2 extra jobs a month',
    '3-4':    'Winning 3–4 extra jobs a month',
    '5-6':    'Landing 5–6 extra jobs a month',
    '7-plus': 'Scaling to 7+ extra jobs a month',
  }
  const growthLine = GROWTH_COPY[answers.growth] || 'Winning those extra jobs'

  document.getElementById('resultClose').innerHTML = `
    <p>The template we sent you is solid. But a template sitting in your inbox doesn't rank on Google. It doesn't have your name, your service area, your photos, or your story.</p>
    <p><strong>${growthLine} doesn't happen from a template — it happens from a cinematic site built to convert.</strong></p>
  `
}

// ── Quiz enter animation ──────────────────────────────────
function enterQuizSection() {
  const el = stepEls.quiz
  if (!el) return
  requestAnimationFrame(() => {
    el.classList.add('wl-step--entering')
    el.addEventListener('animationend', () => el.classList.remove('wl-step--entering'), { once: true })
  })
}

// ── Event delegation ──────────────────────────────────────
document.addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]')?.dataset.action

  if (action === 'start-quiz') {
    restoreAnswers()
    markQuizStarted()
    showStep('quiz')
    setQuizStep(1)
    enterQuizSection()
    return
  }

  if (action === 'skip-to-offer') {
    e.preventDefault()
    showStep('offer')
    return
  }

  if (action === 'go-to-offer') {
    showStep('offer')
    return
  }

  if (action === 'go-to-buy') {
    showStep('buy')
    return
  }

  if (e.target.closest('.wl-quiz__option')) {
    handleOptionSelect(e.target.closest('.wl-quiz__option'))
    return
  }

  if (e.target.closest('#quizBack')) {
    if (currentQuizStep > 1) setQuizStep(currentQuizStep - 1)
    return
  }
})

// ── Checkout CTA → GHL order form / payment link ──────────
// Set VITE_GHL_CHECKOUT_URL to your GHL Order Form (or Payment Link) URL. The
// lead's details are prefilled so GHL ties the sale to the SAME contact created
// at opt-in. Leave it blank and the Pay button just warns in the console.
const CHECKOUT_URL = import.meta.env.VITE_GHL_CHECKOUT_URL || ''
function wireCheckoutButton() {
  const btn = document.getElementById('buyCheckoutBtn')
  if (!btn) return
  if (!CHECKOUT_URL) {
    console.warn('[checkout] VITE_GHL_CHECKOUT_URL not set — the Pay button has no destination yet.')
    return
  }
  let url
  try { url = new URL(CHECKOUT_URL) } catch { console.error('[checkout] VITE_GHL_CHECKOUT_URL is not a valid URL'); return }

  // Prefill from the stored lead (GHL matches/creates the contact by email).
  // Extra unknown params are ignored by GHL, so we send several field-name variants.
  const lead = getStoredLead()
  if (lead.email) url.searchParams.set('email', lead.email)
  if (lead.name) {
    url.searchParams.set('name', lead.name)
    url.searchParams.set('full_name', lead.name)
    const [first, ...rest] = lead.name.trim().split(/\s+/)
    if (first) url.searchParams.set('first_name', first)
    if (rest.length) url.searchParams.set('last_name', rest.join(' '))
  }
  btn.setAttribute('href', url.toString())
}
wireCheckoutButton()

// ── Start on hero ─────────────────────────────────────────
showStep('hero')

// ── Dev nav (development only) ────────────────────────────
if (import.meta.env.DEV) {
  const DEV_STEPS = [
    { id: 'hero',   label: 'Hero' },
    { id: 'quiz',   label: 'Quiz' },
    { id: 'result', label: 'Result' },
    { id: 'offer',  label: 'Offer' },
    { id: 'buy',    label: 'Buy' },
  ]

  const nav = document.createElement('div')
  nav.id = 'wl-dev-nav'
  nav.innerHTML = `
    <span class="wl-dev-nav__label">DEV</span>
    ${DEV_STEPS.map(s => `<button class="wl-dev-nav__btn" data-dev-step="${s.id}">${s.label}</button>`).join('')}
  `
  nav.style.cssText = `
    position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
    z-index: 9999; display: flex; align-items: center; gap: 4px;
    background: rgba(10,10,10,0.88); backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.12); border-radius: 999px;
    padding: 5px 8px; font-family: monospace; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  `
  document.body.appendChild(nav)

  const style = document.createElement('style')
  style.textContent = `
    #wl-dev-nav .wl-dev-nav__label {
      font-size: 9px; font-weight: 700; letter-spacing: 0.15em;
      color: rgba(255,255,255,0.3); padding: 0 6px 0 2px;
      text-transform: uppercase; border-right: 1px solid rgba(255,255,255,0.12);
      margin-right: 4px;
    }
    #wl-dev-nav .wl-dev-nav__btn {
      background: none; border: none; cursor: pointer;
      font-family: monospace; font-size: 11px; font-weight: 600;
      color: rgba(255,255,255,0.55); padding: 4px 10px; border-radius: 999px;
      transition: background 0.15s, color 0.15s;
    }
    #wl-dev-nav .wl-dev-nav__btn:hover { background: rgba(255,255,255,0.1); color: white; }
    #wl-dev-nav .wl-dev-nav__btn.active { background: rgba(53,214,255,0.18); color: #35D6FF; }
  `
  document.head.appendChild(style)

  function updateDevNav(activeId) {
    nav.querySelectorAll('.wl-dev-nav__btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.devStep === activeId)
    })
  }
  updateDevNav('hero')

  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.wl-dev-nav__btn')
    if (!btn) return
    const id = btn.dataset.devStep
    // Pre-fill quiz answers so result page renders correctly
    if (id === 'result' || id === 'offer' || id === 'buy') {
      Object.assign(answers, {
        diy: 'no-time', delay: 'over-a-year',
        google: 'not-showing', revenue: '4-8k', growth: '3-4',
      })
      buildResultPage()
    }
    showStep(id)
    updateDevNav(id)
  })
}
