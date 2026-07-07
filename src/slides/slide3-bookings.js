import { animate, stagger } from 'animejs'

export function init() {
  /* ── Slide 3: Bookings — stacked snap panels ── */

  // Reset helpers — snap elements back to their CSS "start" state instantly
  function resetEl(el, props = {}) {
    if (!el) return
    const base = { duration: 0, ease: 'linear', ...props }
    animate(el, { opacity: 0, translateY: 0, translateX: 0, scale: 1, ...base })
  }
  function resetAll(targets, extra = {}) {
    targets.forEach(el => {
      animate(el, { opacity: 0, translateY: 0, translateX: 0, scale: 1, duration: 0, ease: 'linear', ...extra })
    })
  }

  // Bidirectional observer — fires on enter AND on exit (for reset)
  // Scoped to .funnel-scroll so panels don't fire on page load while hidden behind the hook layer
  const scrollRoot = document.querySelector('.funnel-scroll')

  function watchPanel(el, onEnter, onExit) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onEnter(entry.target)
        } else {
          onExit && onExit(entry.target)
        }
      })
    }, { root: scrollRoot, threshold: 0.3 })
    obs.observe(el)
  }

  /* ─────────────────────────────────
     Panel 1 — Calendar
  ───────────────────────────────── */
  const calPanel = document.querySelector('.b-panel--calendar')
  if (calPanel) {
    let calRunning = false

    function triggerCalAnimation(panel) {
      if (calRunning) return
      calRunning = true

      const header = panel.querySelector('.b-cal-header')
      const card   = panel.querySelector('.cal-card')
      const jobs   = panel.querySelectorAll('.cal-job')

      animate(header, { opacity: 0, translateY: 14, duration: 0 })
      animate(card,   { opacity: 0, translateY: 28, duration: 0 })
      jobs.forEach(j => animate(j, { opacity: 0, translateY: 8, scale: 0.94, duration: 0 }))

      animate(header, { opacity: [0,1], translateY: [14,0], duration: 580, ease: 'outExpo' })
      animate(card,   { opacity: [0,1], translateY: [28,0], duration: 700, delay: 180, ease: 'outExpo' })
      animate(jobs, {
        opacity: [0, 1],
        translateY: [8, 0],
        scale: [0.94, 1],
        duration: 380,
        delay: (el) => 360 + parseInt(el.dataset.ms || 0),
        ease: 'outBack(1.2)',
        onComplete: () => { calRunning = false },
      })
    }

    function resetCalPanel(panel) {
      calRunning = false
      animate(panel.querySelector('.b-cal-header'), { opacity: 0, duration: 0 })
      animate(panel.querySelector('.cal-card'),     { opacity: 0, duration: 0 })
      panel.querySelectorAll('.cal-job').forEach(j => animate(j, { opacity: 0, scale: 0.94, translateY: 8, duration: 0 }))
    }

    // IO handles scroll-in from other slides (exit + re-enter)
    watchPanel(calPanel,
      (panel) => triggerCalAnimation(panel),
      (panel) => resetCalPanel(panel)
    )

    // When hook layer exits via button, the panel is already in-viewport (scrollTop: 0)
    // so the IO never fires. Detect hook exit and trigger manually if needed.
    const hookLayer = document.getElementById('hook-layer')
    if (hookLayer) {
      const hookWatcher = new MutationObserver(() => {
        if (hookLayer.hasAttribute('inert')) {
          hookWatcher.disconnect()
          // Only trigger if calendar panel is still the current panel in view
          if (scrollRoot.scrollTop < calPanel.offsetHeight * 0.7) {
            triggerCalAnimation(calPanel)
          }
        }
      })
      hookWatcher.observe(hookLayer, { attributes: true, attributeFilter: ['inert'] })
    }
  }

  /* ─────────────────────────────────
     Shared counter panel helper
  ───────────────────────────────── */
  function setupCounterPanel(selector, counterId, fromVal, toVal, formatFn) {
    const panel = document.querySelector(selector)
    if (!panel) return

    watchPanel(panel,
      (p) => {
        const meta    = p.querySelector('.b-panel-meta')
        const blocks  = p.querySelectorAll('.b-counter-block')
        const arrow   = p.querySelector('.b-counter-arrow')
        const copy    = p.querySelector('.b-stat-copy')
        const countEl = document.getElementById(counterId)

        // Reset
        animate(meta,  { opacity: 0, translateY: 12, duration: 0 })
        blocks.forEach(b => animate(b, { opacity: 0, translateY: 30, duration: 0 }))
        animate(arrow, { opacity: 0, translateX: -12, duration: 0 })
        if (copy) animate(copy, { opacity: 0, translateY: 16, duration: 0 })
        if (countEl) countEl.textContent = formatFn ? formatFn(fromVal) : fromVal

        // Reveal
        animate(meta,   { opacity: [0,1], translateY: [12,0], duration: 500, ease: 'outExpo' })
        animate(blocks, { opacity: [0,1], translateY: [30,0], duration: 700, delay: stagger(120, { start: 100 }), ease: 'outExpo' })
        animate(arrow,  { opacity: [0,1], translateX: [-12,0], duration: 600, delay: 200, ease: 'outExpo' })

        // Count up
        if (countEl) {
          const obj = { v: fromVal }
          animate(obj, {
            v: toVal,
            duration: 1400,
            delay: 480,
            ease: 'outExpo',
            onUpdate() {
              countEl.textContent = formatFn ? formatFn(obj.v) : Math.round(obj.v)
            },
          })
        }

        if (copy) animate(copy, { opacity: [0,1], translateY: [16,0], duration: 600, delay: 720, ease: 'outExpo' })
      },
      (p) => {
        // Reset on exit so the next entry animates fresh
        const meta   = p.querySelector('.b-panel-meta')
        const blocks = p.querySelectorAll('.b-counter-block')
        const arrow  = p.querySelector('.b-counter-arrow')
        const copy   = p.querySelector('.b-stat-copy')
        animate(meta,  { opacity: 0, duration: 0 })
        blocks.forEach(b => animate(b, { opacity: 0, duration: 0 }))
        animate(arrow, { opacity: 0, duration: 0 })
        if (copy) animate(copy, { opacity: 0, duration: 0 })
      }
    )
  }

  setupCounterPanel('.b-panel--bookings', 'counterJobs',    4,   30,    null)
  setupCounterPanel('.b-panel--conv',     'counterConv',    80,  8,     null)
  setupCounterPanel('.b-panel--revenue',  'counterRevenue', 0,   16000, (v) => Math.round(v).toLocaleString())
}
