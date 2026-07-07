import markUrl from './assets/trades-lab-mark-cream.svg'
import faviconUrl from './assets/trades-lab-favicon.svg'
import appleUrl from './assets/apple-touch-180.png'

// Styles
import './styles/base.css'
import './styles/slide1-hook.css'
import './styles/slide3-bookings.css'
import './styles/modal.css'
import './styles/slide4-features.css'
import './styles/slide5-seo.css'
import './styles/slide6-who.css'
import './styles/slide7-proof.css'
import './styles/slide8-close.css'

// Slide scripts
import { init as initModal } from './slides/modal.js'
import { init as initSlide1 } from './slides/slide1-hook.js'
import { init as initSlide3 } from './slides/slide3-bookings.js'
import { init as initSlide4 } from './slides/slide4-features.js'
import { init as initSlide5 } from './slides/slide5-seo.js'
import { init as initSlide6 } from './slides/slide6-who.js'
import { init as initSlide7 } from './slides/slide7-proof.js'
import { init as initSlide8 } from './slides/slide8-close.js'

document.querySelectorAll('img.nav-logo').forEach((img) => {
  img.src = markUrl
})

if (!document.querySelector('link[data-app-favicon]')) {
  const fav = document.createElement('link')
  fav.rel = 'icon'
  fav.type = 'image/svg+xml'
  fav.href = faviconUrl
  fav.dataset.appFavicon = ''
  document.head.appendChild(fav)
  const apple = document.createElement('link')
  apple.rel = 'apple-touch-icon'
  apple.href = appleUrl
  apple.dataset.appFavicon = ''
  document.head.appendChild(apple)
}

initModal()
initSlide1()
initSlide3()
initSlide4()
initSlide5()
initSlide6()
initSlide7()
initSlide8()

// ── Sticky template bar ──────────────────────────────────────
const templateBar = document.getElementById('template-bar')
const hookLayer   = document.getElementById('hook-layer')
const funnelScrollEl = document.querySelector('.funnel-scroll')

function setBarVisible(visible) {
  templateBar.classList.toggle('template-bar--hidden', !visible)
}

// Hide while hook layer is active; show once it exits
const hookObserver = new MutationObserver(() => {
  const isActive = !hookLayer.hasAttribute('inert')
  setBarVisible(!isActive)
})
hookObserver.observe(hookLayer, { attributes: true, attributeFilter: ['inert', 'class'] })

// Per-slide hide toggle via data-hide-template-bar attribute
const slideObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const hide = entry.target.hasAttribute('data-hide-template-bar')
      const hookActive = !hookLayer.hasAttribute('inert')
      setBarVisible(!hide && !hookActive)
    }
  })
}, { root: funnelScrollEl, threshold: 0.5 })

funnelScrollEl.querySelectorAll('.slide, .b-panel').forEach((el) => {
  slideObserver.observe(el)
})
