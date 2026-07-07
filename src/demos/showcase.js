import '../styles/slide1-hook.css'  /* as-* classes — identical to slide1 */
import './showcase.css'

import { DEMO_HTML, initAutoPlay } from './after-site.js'

/* ══════════════════════════════════════════════════════════
   LUMINA BATHROOMS — DEMO SHOWCASE
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

/* ── Calendar helpers ───────────────────────────────────── */
const MAY_DAYS = [
  { n: 27, cls: '' }, { n: 28, cls: '' }, { n: 29, cls: '' }, { n: 30, cls: '' },
  { n: 1,  cls: 'open' }, { n: 2, cls: 'open' }, { n: 3, cls: 'full' },
  { n: 4,  cls: 'full' }, { n: 5, cls: 'open' }, { n: 6, cls: 'open' },
  { n: 7,  cls: 'open' }, { n: 8, cls: 'open' }, { n: 9, cls: 'full' }, { n: 10, cls: 'full' },
  { n: 11, cls: 'full' }, { n: 12, cls: 'open' }, { n: 13, cls: 'open' },
  { n: 14, cls: 'picked' }, { n: 15, cls: 'open' }, { n: 16, cls: 'open' }, { n: 17, cls: 'full' },
  { n: 18, cls: 'full' }, { n: 19, cls: 'open' }, { n: 20, cls: 'open' },
  { n: 21, cls: 'open' }, { n: 22, cls: 'open' }, { n: 23, cls: 'full' }, { n: 24, cls: 'full' },
  { n: 25, cls: 'full' }, { n: 26, cls: 'open' }, { n: 27, cls: 'open' },
  { n: 28, cls: 'open' }, { n: 29, cls: 'open' }, { n: 30, cls: 'open' }, { n: 31, cls: 'full' },
]

const calGrid = MAY_DAYS.map(d => `<span class="${d.cls}">${d.n}</span>`).join('')

/* ══ DEMO PANELS ══════════════════════════════════════════
 * Hero uses DEMO_HTML from the shared after-site component
 * (identical structure to slide1-hook's after-site div).
 * All other panels use the cream/navy/gold branded layout.
══════════════════════════════════════════════════════════ */

const servicesPanel = `
  <div class="d-section d-section--cream">
    <p class="section-label">What We Offer</p>
    <h2 class="section-headline">Everything Your Bathroom Deserves</h2>
    <div class="d-cards-grid">
      <article class="d-card">
        <span class="d-card-icon" aria-hidden="true">◈</span>
        <h3>Full Bathroom Refit</h3>
        <p>A complete transformation — design, strip-out, tiling, plumbing and fitting. We take your bathroom from dated to immaculate, project-managed end to end.</p>
        <div class="d-card-price"><strong>From £6,500</strong><span>Get a Quote</span></div>
      </article>
      <article class="d-card">
        <span class="d-card-icon" aria-hidden="true">◆</span>
        <h3>Wet Rooms</h3>
        <p>Sleek, fully waterproofed wet rooms built to last. Level-access showers, premium tiling and modern fittings — designed around your space.</p>
        <div class="d-card-price"><strong>From £4,500</strong><span>Get a Quote</span></div>
      </article>
      <article class="d-card">
        <span class="d-card-icon" aria-hidden="true">✦</span>
        <h3>En-suites</h3>
        <p>Compact, beautifully finished en-suites that add real value to your home. Expert fitting by time-served tradespeople, finished to showroom standard.</p>
        <div class="d-card-price"><strong>From £3,500</strong><span>Get a Quote</span></div>
      </article>
    </div>
  </div>`

const reviewsPanel = `
  <div class="d-section d-section--navy">
    <p class="d-testi-label">Client Stories</p>
    <h2 class="d-testi-headline">What Our Clients Say</h2>
    <div class="d-testi-grid">
      <article class="d-testi-card">
        <span class="d-testi-quote-mark" aria-hidden="true">"</span>
        <span class="d-testi-stars" aria-label="5 stars">★★★★★</span>
        <p class="d-testi-text">They transformed our dated bathroom into something straight out of a showroom. The whole process was effortless on our end. We won't use anyone else.</p>
        <span class="d-testi-author">Victoria H. — Didsbury</span>
      </article>
      <article class="d-testi-card">
        <span class="d-testi-quote-mark" aria-hidden="true">"</span>
        <span class="d-testi-stars" aria-label="5 stars">★★★★★</span>
        <p class="d-testi-text">From quote to completion they handled everything. The finish is immaculate and the en-suite looks like something from a luxury hotel. Worth every penny.</p>
        <span class="d-testi-author">James &amp; Sarah T. — Altrincham</span>
      </article>
      <article class="d-testi-card">
        <span class="d-testi-quote-mark" aria-hidden="true">"</span>
        <span class="d-testi-stars" aria-label="5 stars">★★★★★</span>
        <p class="d-testi-text">Our old bathroom was tired and dated. I was almost embarrassed to have guests use it. Onyx &amp; Oak turned it around in under two weeks — it looks brand new.</p>
        <span class="d-testi-author">Margaret L. — Stockport</span>
      </article>
    </div>
  </div>`

const bookingsPanel = `
  <div class="d-section d-section--cream">
    <div class="d-two-col">
      <div class="d-col-left">
        <h2>Book Your<br>Appointment</h2>
        <div class="d-gold-rule"></div>
        <p>We confirm within 2 hours.<br>Same-week slots available.</p>
        <div class="d-trust-icons">
          <div class="d-trust-icon-row">
            <div class="d-trust-icon-badge" aria-hidden="true">✓</div>
            <span class="d-trust-icon-text">No Deposit Required</span>
          </div>
          <div class="d-trust-icon-row">
            <div class="d-trust-icon-badge" aria-hidden="true">◈</div>
            <span class="d-trust-icon-text">Free Cancellation</span>
          </div>
          <div class="d-trust-icon-row">
            <div class="d-trust-icon-badge" aria-hidden="true">★</div>
            <span class="d-trust-icon-text">Confirmed in 2 Hours</span>
          </div>
        </div>
      </div>

      <div class="d-form-wrap">
        <div class="d-cal-header">
          <span class="d-cal-month">May 2026</span>
          <span class="section-label" style="margin:0">Open Slots</span>
        </div>
        <div class="d-cal-days-row">
          <span class="d-cal-day-name">S</span><span class="d-cal-day-name">M</span>
          <span class="d-cal-day-name">T</span><span class="d-cal-day-name">W</span>
          <span class="d-cal-day-name">T</span><span class="d-cal-day-name">F</span>
          <span class="d-cal-day-name">S</span>
        </div>
        <div class="d-cal-grid">${calGrid}</div>

        <p class="d-slots-label">Available Times — Wed, May 14</p>
        <div class="d-slots">
          <span class="d-slot">8:00 AM</span>
          <span class="d-slot active">10:00 AM</span>
          <span class="d-slot">12:00 PM</span>
          <span class="d-slot full">2:00 PM</span>
          <span class="d-slot">4:00 PM</span>
        </div>

        <div class="d-form-row-2col">
          <div class="d-form-row">
            <label>Full Name</label>
            <input type="text" value="Victoria Harris" readonly>
          </div>
          <div class="d-form-row">
            <label>Phone</label>
            <input type="tel" value="0161 555 2600" readonly>
          </div>
        </div>
        <div class="d-form-row">
          <label>Service</label>
          <input type="text" value="Full Bathroom Refit — Free Survey" readonly>
        </div>
        <button class="d-btn-submit">Book My Free Survey &nbsp;&rarr;</button>
      </div>
    </div>
  </div>`

const paymentsPanel = `
  <div class="d-section d-section--cream">
    <div class="d-two-col">
      <div class="d-col-left">
        <h2>Secure Your<br>Booking</h2>
        <div class="d-gold-rule"></div>
        <p>Pay a deposit online to lock in your dates.<br>No hidden fees. No surprises.</p>
        <div class="d-summary-lines">
          <div class="d-summary-service">Full Bathroom Refit</div>
          <div class="d-summary-date">Start date: Wed, May 14</div>
          <div class="d-summary-line">
            <span>Booking deposit</span>
            <span>£500.00</span>
          </div>
          <div class="d-summary-line">
            <span>Balance on completion</span>
            <span style="color:var(--gold)">£6,000.00</span>
          </div>
          <div class="d-summary-total">
            <span>Due Today</span>
            <strong>£500.00</strong>
          </div>
        </div>
      </div>

      <div class="d-form-wrap">
        <div class="d-credit-card" aria-label="Credit card preview">
          <div class="d-card-chip"></div>
          <div class="d-card-row">
            <span class="d-card-num">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</span>
            <span class="d-card-brand">VISA</span>
          </div>
          <div class="d-card-row">
            <span class="d-card-name">Victoria Harris</span>
            <span class="d-card-exp">09 / 28</span>
          </div>
        </div>

        <div class="d-form-row">
          <label>Card Number</label>
          <input type="text" value="4242  4242  4242  4242" readonly>
        </div>
        <div class="d-form-row-2col">
          <div class="d-form-row">
            <label>Expiry</label>
            <input type="text" value="09 / 28" readonly>
          </div>
          <div class="d-form-row">
            <label>CVC</label>
            <input type="text" value="•••" readonly>
          </div>
        </div>
        <div class="d-form-row">
          <label>Name on Card</label>
          <input type="text" value="Victoria Harris" readonly>
        </div>
        <button class="d-btn-submit">Pay £500 Deposit Securely &nbsp;&rarr;</button>
        <div class="d-security-strip">
          <span>256-bit SSL</span>
          <span>No Hidden Fees</span>
          <span>Powered by Stripe</span>
        </div>
      </div>
    </div>
  </div>`

/* ══ CANVAS ANIMATION ══════════════════════════════════════
 * Handled by initAutoPlay() from ./after-site.js
══════════════════════════════════════════════════════════ */

/* ══ RENDER ════════════════════════════════════════════════ */
const panels = { services: servicesPanel, reviews: reviewsPanel, bookings: bookingsPanel, payments: paymentsPanel }

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
