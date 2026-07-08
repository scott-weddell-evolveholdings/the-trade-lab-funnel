import '../styles/slide1-hook.css'  /* as-* classes — identical to slide1 */
import './showcase.css'

import { DEMO_HTML, initAutoPlay } from './after-site.js'

/* ══════════════════════════════════════════════════════════
   ONYX & OAK — DEMO SHOWCASE
   The Trades Lab cinematic bathroom demo
   Cream / Navy / Brass — Playfair Display + Inter
══════════════════════════════════════════════════════════ */

const LOGO_SVG = `
  <svg width="18" height="23" viewBox="0 0 22 28" fill="none" aria-hidden="true">
    <path d="M11 0C11 0 0 10.5 0 17.5C0 23.299 4.925 28 11 28C17.075 28 22 23.299 22 17.5C22 10.5 11 0 11 0Z" fill="#C9A84C"/>
    <path d="M11 7C11 7 4 13.5 4 17.5C4 21.09 7.134 24 11 24C14.866 24 18 21.09 18 17.5C18 13.5 11 7 11 7Z" fill="#FAF7F2" opacity="0.45"/>
  </svg>`

/* DEMO_HTML for hero comes from ./after-site.js */

const NAV = `
  <header class="d-nav" aria-label="Site navigation">
    <a href="#" class="d-nav-logo">
      ${LOGO_SVG}
      <span class="d-nav-logo-text">Onyx &amp; Oak</span>
    </a>
    <nav aria-label="Primary">
      <ul class="d-nav-links">
        <li>Services</li>
        <li>Process</li>
        <li>Gallery</li>
        <li>Reviews</li>
        <li>Contact</li>
      </ul>
    </nav>
    <span class="d-nav-cta">Get a Free Quote</span>
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

const TEAM = [
  { name: 'James W.', role: 'Founder & Design Director', initials: 'JW' },
  { name: 'Laura B.', role: 'Senior Bathroom Designer',  initials: 'LB' },
  { name: 'Tom A.',   role: 'Lead Installation Fitter',   initials: 'TA' },
]

const teamPanel = `
  <div class="d-section d-section--cream">
    <p class="section-label">04 · The People Behind The Work</p>
    <h2 class="section-headline">Great work comes from great teams</h2>
    <div class="d-team-grid">
      ${TEAM.map(m => `
      <article class="d-team-card">
        <span class="d-team-avatar" aria-hidden="true">${m.initials}</span>
        <h3>${m.name}</h3>
        <span class="d-team-role">${m.role}</span>
        <span class="d-team-badge">✓ Vetted &amp; insured</span>
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

const reviewsPanel = `
  <div class="d-section d-section--navy">
    <p class="d-testi-label">05 · Loved By Homeowners</p>
    <h2 class="d-testi-headline">What our clients say</h2>
    <div class="d-stats-band">
      <div class="d-stat"><strong>5.0</strong><span>Average rating</span></div>
      <div class="d-stat"><strong>37</strong><span>Homeowner reviews</span></div>
      <div class="d-stat"><strong>10 yr</strong><span>Workmanship guarantee</span></div>
      <div class="d-stat"><strong>48 hr</strong><span>Fixed-price quote</span></div>
    </div>
    <div class="d-testi-grid">
      <article class="d-testi-card">
        <span class="d-testi-quote-mark" aria-hidden="true">"</span>
        <span class="d-testi-stars" aria-label="5 stars">★★★★★</span>
        <p class="d-testi-text">They designed exactly the bathroom we'd struggled to picture, and finished a day early. Spotless work and not a penny over the quote.</p>
        <span class="d-testi-author">Sarah C. — Didsbury</span>
      </article>
      <article class="d-testi-card">
        <span class="d-testi-quote-mark" aria-hidden="true">"</span>
        <span class="d-testi-stars" aria-label="5 stars">★★★★★</span>
        <p class="d-testi-text">Turned a cramped, dated en-suite into a hotel-style wet room. One team start to finish — no chasing different trades. Faultless.</p>
        <span class="d-testi-author">Mark J. — Altrincham</span>
      </article>
      <article class="d-testi-card">
        <span class="d-testi-quote-mark" aria-hidden="true">"</span>
        <span class="d-testi-stars" aria-label="5 stars">★★★★★</span>
        <p class="d-testi-text">We needed an accessible bathroom for mum that still looked beautiful — and that's exactly what we got. Kind, tidy, brilliant craftsmen.</p>
        <span class="d-testi-author">Priya D. — Stockport</span>
      </article>
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
