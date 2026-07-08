import '../styles/slide1-hook.css'  /* as-* classes — identical to slide1 */
import './showcase.css'

import { DEMO_HTML, initAutoPlay } from './after-site.js'

/* ══════════════════════════════════════════════════════════
   ONYX & OAK — DEMO SHOWCASE
   The Trades Lab cinematic bathroom demo
   Cream / Navy / Brass — Playfair Display + Inter
══════════════════════════════════════════════════════════ */

/* DEMO_HTML for hero comes from ./after-site.js */

// Shared header — identical across every tab (see .d-nav in showcase.css and the
// matching .as-nav on the hero tab in slide1-hook.css).
const PHONE_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`

const NAV = `
  <header class="d-nav" aria-label="Site navigation">
    <a href="#" class="d-nav-logo"><span class="d-nav-logo-text">Onyx &amp; Oak<span class="d-nav-dot">.</span></span></a>
    <nav aria-label="Primary">
      <ul class="d-nav-links">
        <li>Services</li>
        <li>Process</li>
        <li>Gallery</li>
        <li>Reviews</li>
        <li>Contact</li>
      </ul>
    </nav>
    <div class="d-nav-right">
      <span class="d-nav-phone">${PHONE_ICON} +44 7911071673</span>
      <span class="d-nav-cta">Get a Free Quote</span>
    </div>
  </header>`


/* ══ DEMO PANELS ══════════════════════════════════════════
 * Hero uses DEMO_HTML from the shared after-site component
 * (identical structure to slide1-hook's after-site div).
 * All other panels use the cream/navy/gold branded layout.
══════════════════════════════════════════════════════════ */

const servicesPanel = `
  <div class="d-section d-section--cream">
    <p class="section-label">01 · Bathroom Design &amp; Installation</p>
    <h2 class="section-headline">Every bathroom, beautifully handled</h2>
    <div class="d-cards-grid">
      <article class="d-card">
        <span class="d-card-icon" aria-hidden="true">◈</span>
        <h3>Full Bathroom Renovations</h3>
        <p>Complete installations from concept to completion — tiling, plumbing, electrics and finishing under one roof. Dated to immaculate, project-managed throughout.</p>
        <div class="d-card-price"><strong>From £6,500</strong><span>Get a Quote</span></div>
      </article>
      <article class="d-card">
        <span class="d-card-icon" aria-hidden="true">◆</span>
        <h3>Wet Rooms &amp; En-suites</h3>
        <p>Sleek, fully-waterproofed wet rooms and space-smart en-suites that add real value to your home. Level-access showers and premium fittings throughout.</p>
        <div class="d-card-price"><strong>From £4,500</strong><span>Get a Quote</span></div>
      </article>
      <article class="d-card">
        <span class="d-card-icon" aria-hidden="true">✦</span>
        <h3>Accessible &amp; Mobility</h3>
        <p>Walk-in showers and easy-access bathrooms that stay elegant — designed for comfort and independence, finished to showroom standard.</p>
        <div class="d-card-price"><strong>From £3,500</strong><span>Get a Quote</span></div>
      </article>
    </div>
  </div>`

const processPanel = `
  <div class="d-section d-section--navy">
    <p class="section-label">02 · How It Works</p>
    <h2 class="section-headline" style="color:#fff">Your new bathroom in three simple steps</h2>
    <p class="d-process-sub">No juggling trades, no stress — we handle the lot.</p>
    <div class="d-steps-grid">
      <article class="d-step">
        <span class="d-step-num">01</span>
        <h3>Get your free quote</h3>
        <p>Tell us about your space. We visit, measure up, and give you a clear fixed price within 48 hours — no obligation.</p>
      </article>
      <span class="d-step-arrow" aria-hidden="true">→</span>
      <article class="d-step">
        <span class="d-step-num">02</span>
        <h3>We design &amp; fit</h3>
        <p>One vetted, insured team handles everything — design, supply, tiling, plumbing and electrics — start to finish.</p>
      </article>
      <span class="d-step-arrow" aria-hidden="true">→</span>
      <article class="d-step">
        <span class="d-step-num">03</span>
        <h3>Enjoy your new bathroom</h3>
        <p>Finished on schedule, left spotless, and backed by our 10-year workmanship guarantee. That's it.</p>
      </article>
    </div>
  </div>`

// Shared eyebrow: teal number + rule + label (matches the real site's 01..06 marks).
const eyebrow = (num, label) =>
  `<p class="d-eyebrow"><span class="d-eyebrow-num">${num}</span><span class="d-eyebrow-line"></span>${label}</p>`

const TEAM = [
  { name: 'James W.', role: 'Founder & Design Director', img: 'james-w' },
  { name: 'Laura B.', role: 'Senior Bathroom Designer',  img: 'laura-b' },
  { name: 'Tom A.',   role: 'Lead Installation Fitter',   img: 'tom-a' },
]

const teamPanel = `
  <div class="d-section d-section--cream d-section--center">
    ${eyebrow('04', 'The People Behind The Work')}
    <h2 class="section-headline">Great work comes from great teams</h2>
    <p class="d-section-sub">Meet the designers and craftsmen who bring every Onyx &amp; Oak bathroom to life.</p>
    <div class="d-team-grid">
      ${TEAM.map(m => `
      <article class="d-team-frame">
        <img src="team/${m.img}.jpg" alt="${m.name}, ${m.role}" loading="lazy">
        <div class="d-team-caption">
          <span class="d-team-name">${m.name}</span>
          <span class="d-team-role">${m.role}</span>
        </div>
      </article>`).join('')}
    </div>
  </div>`

/* before = the clean dated state (frame 0001, no demolition in shot);
   after  = a fully finished frame (180+). Same room across cards — this is
   an illustrative template showcase, not a real project archive. */
const GALLERY_PROJECTS = [
  { title: 'Family bathroom', loc: 'Didsbury',   tag: '5-day full refit',  before: '0001', after: '0193' },
  { title: 'Master en-suite', loc: 'Altrincham', tag: 'walk-in wet room',  before: '0001', after: '0186' },
  { title: 'Accessible bathroom', loc: 'Stockport', tag: '1-week install', before: '0001', after: '0180' },
]

const galleryPanel = `
  <div class="d-section d-section--cream">
    <p class="section-label">Our Work</p>
    <h2 class="section-headline">Drag to reveal the transformation</h2>
    <p class="d-gallery-sub">Real bathroom renovations across Manchester. Slide across to see tired bathrooms become showpieces.</p>
    <div class="d-gallery-grid">
      ${GALLERY_PROJECTS.map(p => `
      <article class="d-gallery-card">
        <div class="d-ba">
          <img class="d-ba-img" src="frames/frame_${p.after}.jpg" alt="${p.title} in ${p.loc} — after renovation" loading="lazy">
          <div class="d-ba-before"><img class="d-ba-img" src="frames/frame_${p.before}.jpg" alt="${p.title} in ${p.loc} — before renovation" loading="lazy"></div>
          <span class="d-ba-label d-ba-label--before">Before</span>
          <span class="d-ba-label d-ba-label--after">After</span>
          <div class="d-ba-divider"><span class="d-ba-handle" aria-hidden="true">‹&nbsp;›</span></div>
        </div>
        <div class="d-gallery-cap">
          <div class="d-gallery-meta">
            <h3>${p.title}</h3>
            <span class="d-gallery-loc">${p.loc}</span>
          </div>
          <span class="d-gallery-pill">${p.tag}</span>
        </div>
      </article>`).join('')}
    </div>
  </div>`

const REVIEWS = [
  { init: 'SC', name: 'Sarah C.', loc: 'Didsbury',   text: "They designed exactly the bathroom we'd struggled to picture, and finished a day early. Spotless work and not a penny over the quote." },
  { init: 'MJ', name: 'Mark J.',  loc: 'Altrincham', text: "Turned a cramped, dated en-suite into a hotel-style wet room. One team start to finish — no chasing different trades. Faultless." },
  { init: 'PD', name: 'Priya D.', loc: 'Stockport',  text: "We needed an accessible bathroom for mum that still looked beautiful — and that's exactly what we got. Kind, tidy, brilliant craftsmen." },
]

const reviewsPanel = `
  <div class="d-section d-section--mist d-section--center">
    ${eyebrow('05', 'Loved By Homeowners')}
    <h2 class="section-headline">What our clients say</h2>
    <div class="d-stats-row">
      <div class="d-statbox"><b>5.0</b><span>Average rating</span></div>
      <div class="d-statbox"><b>37</b><span>Homeowner reviews</span></div>
      <div class="d-statbox"><b>10</b><span>Year guarantee</span></div>
      <div class="d-statbox"><b>48</b><span>Hour fixed quote</span></div>
    </div>
    <div class="d-review-grid">
      ${REVIEWS.map(r => `
      <article class="d-review-card">
        <span class="d-review-quote" aria-hidden="true">&ldquo;</span>
        <p class="d-review-text">${r.text}</p>
        <div class="d-review-author">
          <span class="d-review-avatar" aria-hidden="true">${r.init}</span>
          <div class="d-review-meta">
            <span class="d-review-name">${r.name}</span>
            <span class="d-review-loc">${r.loc} · ★★★★★</span>
          </div>
        </div>
      </article>`).join('')}
    </div>
  </div>`

const quotePanel = `
  <div class="d-section d-section--navy d-section--quote">
    <div class="d-quote-grid">
      <div class="d-quote-left">
        <h2 class="d-quote-headline">Ready for a bathroom you'll <em>love coming home to?</em></h2>
        <p class="d-quote-sub">Book a free, no-pressure quote. We'll measure up, talk through ideas, and give you a fixed price — no obligation.</p>
        <ul class="d-quote-list">
          <li><span aria-hidden="true">✓</span> Free home design consultation</li>
          <li><span aria-hidden="true">✓</span> Fixed-price quote within 48 hours</li>
          <li><span aria-hidden="true">✓</span> 10-year workmanship guarantee</li>
        </ul>
        <div class="d-quote-rule"></div>
        <p class="d-quote-call">Call <span>+44 7911071673</span></p>
      </div>
      <div class="d-quote-card">
        <h3>Get a free quote</h3>
        <p class="d-quote-card-sub">We'll call you back within 24 hours.</p>
        <div class="d-qfield">Your name</div>
        <div class="d-qfield">Phone number</div>
        <div class="d-qfield d-qfield--select">Full bathroom renovation<span aria-hidden="true">▾</span></div>
        <p class="d-quote-rating"><span class="d-quote-stars">★★★★★</span> Rated 5.0 by 37 Manchester homeowners</p>
        <button class="d-quote-btn" type="button">Get A Free Quote</button>
        <p class="d-quote-fine">No obligation · No spam · We'll only call about your project.</p>
      </div>
    </div>
  </div>`

/* ══ CANVAS ANIMATION ══════════════════════════════════════
 * Handled by initAutoPlay() from ./after-site.js
══════════════════════════════════════════════════════════ */

/* ══ RENDER ════════════════════════════════════════════════ */
const panels = {
  services: servicesPanel,
  process:  processPanel,
  gallery:  galleryPanel,
  team:     teamPanel,
  reviews:  reviewsPanel,
  quote:    quotePanel,
}

const params = new URLSearchParams(window.location.search)
const key = params.get('demo') || 'hero'
const root = document.getElementById('demoRoot')

if (key === 'hero') {
  /* Full-page after-site clone — identical to slide1's browser-demo */
  root.innerHTML = DEMO_HTML
  initAutoPlay()
} else {
  const content = panels[key] || panels.services
  root.innerHTML = `
    <div class="demo-site">
      ${NAV}
      <div class="d-content">
        ${content}
      </div>
    </div>`
}
