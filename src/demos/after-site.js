/* ══════════════════════════════════════════════════════════
   AFTER-SITE SHARED COMPONENT
   The Onyx & Oak website demo used in:
     - slide1-hook (embedded in browser chrome, scroll-driven)
     - demo.html?demo=hero (full-page iframe, auto-playing loop)

   Uses the exact same as-* CSS classes and HTML structure so
   both contexts render identically.
══════════════════════════════════════════════════════════ */

export const FRAME_COUNT = 193

/*
 * HTML for the full-page demo context (demo.html?demo=hero).
 * When embedded in slide1-hook.html the same markup is
 * rendered inline via EJS; only the wrapping class differs.
 */
export const DEMO_HTML = `
  <div class="after-site after-site-demo" id="afterSite">
    <nav class="as-nav">
      <a class="as-logo" href="#" tabindex="-1">
        <svg width="16" height="20" viewBox="0 0 22 28" fill="none" aria-hidden="true">
          <path d="M11 0C11 0 0 10.5 0 17.5C0 23.299 4.925 28 11 28C17.075 28 22 23.299 22 17.5C22 10.5 11 0 11 0Z" fill="#C9A227"/>
          <path d="M11 7C11 7 4 13.5 4 17.5C4 21.09 7.134 24 11 24C14.866 24 18 21.09 18 17.5C18 13.5 11 7 11 7Z" fill="#FAF7F2" opacity="0.45"/>
        </svg>
        Onyx &amp; Oak
      </a>
      <ul class="as-nav-links">
        <li>Services</li><li>Process</li><li>Gallery</li><li>Reviews</li><li>Contact</li>
      </ul>
      <span class="as-nav-cta">Get a Free Quote</span>
    </nav>
    <div class="as-hero">
      <canvas id="demoCanvas" class="as-canvas"></canvas>
      <div id="demoOverlay" class="as-hero-overlay" aria-hidden="true"></div>
      <div id="demoScrollHint" class="as-scroll-hint">
        <div class="as-scroll-copy">
          <span class="as-scroll-kicker">Interactive before &amp; after reveal</span>
          <span class="as-scroll-title">
            <span>Scroll Down</span>
            <span>To Transform This Bathroom</span>
          </span>
        </div>
        <div class="as-scroll-cue" aria-hidden="true">
          <span class="as-scroll-line"></span>
          <div class="as-chevrons">
            <div class="as-chevron"></div>
            <div class="as-chevron"></div>
            <div class="as-chevron"></div>
          </div>
        </div>
      </div>
      <div class="as-hero-content" id="demoHeroContent">
        <span class="as-label">Luxury Bathroom Fitters · Manchester</span>
        <h2 class="as-headline">From Dated<br>to Immaculate.</h2>
        <p class="as-sub">We transform tired bathrooms into stunning spaces.<br>Showroom-quality results, every single time.</p>
        <span class="as-cta-btn">Get Your Free Quote &nbsp;&rarr;</span>
      </div>
    </div>
  </div>`

/* ── Shared canvas renderer ────────────────────────────────
 * Called on every frame by both slide1's scroll scrubber and
 * the demo's auto-play loop. Expects canvas._ctx / _w / _h
 * to be set by the caller's init step.
──────────────────────────────────────────────────────────── */
export function renderFrame({ canvas, imgs, progress, overlay, hint, content }) {
  if (!canvas || !canvas._ctx) return
  const ctx = canvas._ctx
  const w   = canvas._w
  const h   = canvas._h

  const idx = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT))
  const img = imgs[idx]
  if (img && img.complete && img.naturalWidth) {
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
    const sw = img.naturalWidth  * scale
    const sh = img.naturalHeight * scale
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh)
  }

  /* Scroll hint fades out the moment playback starts */
  if (hint) {
    hint.style.opacity   = progress > 0.03 ? '0' : '1'
    hint.style.transform = progress > 0.03 ? 'translateY(-14px) scale(0.985)' : 'none'
  }

  /* Headline + overlay reveal in the final 20% of the sequence */
  const textStart = 0.80
  if (progress >= textStart) {
    const t = (progress - textStart) / (1 - textStart)
    if (overlay) overlay.style.background = `rgba(6,30,51,${(t * 0.55).toFixed(3)})`
    if (content) {
      content.style.opacity   = t.toFixed(3)
      content.style.transform = `translateY(${((1 - t) * 14).toFixed(1)}px)`
    }
  } else {
    if (overlay) overlay.style.background = 'rgba(6,30,51,0)'
    if (content) {
      content.style.opacity   = '0'
      content.style.transform = 'translateY(14px)'
    }
  }
}

/* ── Canvas init helper (shared DPR setup) ─────────────── */
export function initCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1
  const w   = canvas.offsetWidth
  const h   = canvas.offsetHeight
  canvas.width  = w * dpr
  canvas.height = h * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  canvas._ctx = ctx
  canvas._w   = w
  canvas._h   = h
}

/* ── Auto-play for the standalone demo iframe ──────────────
 * Loads all 193 frames from /frames/ (same path as slide1),
 * plays 0 → 1 over 5.5 s, holds 2.8 s, fades out 0.6 s,
 * then loops. Falls back to a timed run if frames are missing.
──────────────────────────────────────────────────────────── */
const ANIM_DURATION = 5500
const HOLD_DURATION = 2800
const FADE_DURATION = 600

export function initAutoPlay() {
  const canvas  = document.getElementById('demoCanvas')
  if (!canvas) return
  const overlay = document.getElementById('demoOverlay')
  const hint    = document.getElementById('demoScrollHint')
  const content = document.getElementById('demoHeroContent')

  /* Do NOT call initCanvas() synchronously — the flex layout hasn't
   * resolved yet so canvas.offsetHeight reads an incorrect value.
   * We defer to rAF so dimensions are read after the first paint. */

  const imgs = []
  let loaded  = 0
  let started = false

  let animStart = null
  let phase     = 'playing'
  let holdStart = null
  let fadeStart = null
  let progress  = 0

  function onResize() {
    initCanvas(canvas)
    renderFrame({ canvas, imgs, progress, overlay, hint, content })
  }
  window.addEventListener('resize', onResize)

  function tick(ts) {
    if (phase === 'playing') {
      if (!animStart) animStart = ts
      progress = Math.min(1, (ts - animStart) / ANIM_DURATION)
      renderFrame({ canvas, imgs, progress, overlay, hint, content })
      if (progress >= 1) { phase = 'holding'; holdStart = ts }
    } else if (phase === 'holding') {
      if (ts - holdStart >= HOLD_DURATION) { phase = 'fading'; fadeStart = ts }
    } else if (phase === 'fading') {
      const t = Math.min(1, (ts - fadeStart) / FADE_DURATION)
      if (content) content.style.opacity    = (1 - t).toFixed(3)
      if (overlay) overlay.style.background = `rgba(6,30,51,${(0.55 * (1 - t)).toFixed(3)})`
      if (t >= 1) {
        progress  = 0
        phase     = 'playing'
        animStart = null
        renderFrame({ canvas, imgs, progress, overlay, hint, content })
      }
    }
    requestAnimationFrame(tick)
  }

  function start() {
    if (started) return
    started = true
    /* Defer canvas init to next rAF so flex layout is resolved first */
    requestAnimationFrame(() => {
      initCanvas(canvas)
      requestAnimationFrame(tick)
    })
  }

  /* Preload all frames — /frames/ is served from public/ on the same Vite server */
  for (let i = 1; i <= FRAME_COUNT; i++) {
    const img = new Image()
    img.src = `frames/frame_${String(i).padStart(4, '0')}.jpg`
    img.onload = () => { loaded++; if (loaded === 1) start() }
    imgs[i - 1] = img
  }

  /* Fallback: run even if frames never arrive (canvas stays dark, overlays still animate) */
  setTimeout(start, 1500)
}
