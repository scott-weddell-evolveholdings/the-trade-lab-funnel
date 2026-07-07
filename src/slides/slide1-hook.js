import { renderFrame, initCanvas, FRAME_COUNT as DEMO_FRAME_COUNT } from '../demos/after-site.js'

export function init() {
  /* ── SLIDE 1: Hook + Reveal ── */
  /* ── Preload frames ── */
  const demoImgs = [];
  for (let di = 1; di <= DEMO_FRAME_COUNT; di++) {
    const img = new Image();
    img.src = `frames/frame_${String(di).padStart(4, '0')}.jpg`;
    demoImgs[di - 1] = img;
  }

  let demoScrollAcc   = 0;
  const DEMO_SCROLL_MAX = 900;
  /** Accumulated scroll (wheel / touch) to advance from opening hook text → demo */
  let hookIntroScrollAcc = 0;
  const HOOK_INTRO_SCROLL_THRESHOLD = 90;
  let demoRafPending  = false;
  let demoCurProgress = 0;
  let demoDone        = false;
  let demoReady       = false;
  let hookDone        = false;  // true once slide-1 sequence hands off to scroll-snap

  function initDemoCanvas() {
    const canvas = document.getElementById('demoCanvas');
    if (!canvas) return;
    initCanvas(canvas);
    const firstImg = demoImgs[0];
    if (firstImg.complete && firstImg.naturalWidth) { renderDemoFrame(0); }
    else { firstImg.onload = () => renderDemoFrame(0); }
  }

  function renderDemoFrame(progress) {
    const canvas = document.getElementById('demoCanvas');
    renderFrame({
      canvas,
      imgs:    demoImgs,
      progress,
      overlay: document.getElementById('demoOverlay'),
      hint:    document.getElementById('demoScrollHint'),
      content: document.getElementById('demoHeroContent'),
    });
    if (progress >= 1 && !demoDone) {
      demoDone = true;
      setTimeout(() => { hookState = 2; document.getElementById('hookCta').classList.add('is-visible'); }, 300);
    }
  }

  function scrubDemo(deltaY) {
    demoScrollAcc = Math.max(0, Math.min(demoScrollAcc + deltaY, DEMO_SCROLL_MAX));
    demoCurProgress = demoScrollAcc / DEMO_SCROLL_MAX;
    if (deltaY < 0 && demoDone && demoScrollAcc < DEMO_SCROLL_MAX) {
      demoDone = false; hookState = 1;
      document.getElementById('hookCta').classList.remove('is-visible');
    }
    if (!demoRafPending) {
      demoRafPending = true;
      requestAnimationFrame(() => { renderDemoFrame(demoCurProgress); demoRafPending = false; });
    }
  }

  let hookState     = 0;
  let hookThrottled = false;
  const funnelScroll = document.querySelector('.funnel-scroll');
  // No overflow toggling needed — #hook-layer is a fixed overlay; .funnel-scroll always has scroll-snap

  function advanceHook() {
    if (hookThrottled) return;
    if (hookState === 1 && !demoReady) return; // prevent premature advance during 900ms init window
    hookThrottled = true;
    setTimeout(() => { hookThrottled = false; }, 950);
    hookState++;
    if (hookState === 1) {
      document.getElementById('hookText').classList.add('fade-out');
      setTimeout(() => {
        document.getElementById('hookDemo').classList.add('is-visible');
        setTimeout(initDemoCanvas, 50);
        setTimeout(() => {
          document.getElementById('liveBadge')?.classList.add('is-visible');
          document.getElementById('wowCaption').classList.add('is-visible');
        }, 500);
        setTimeout(() => { demoScrollAcc = 0; demoCurProgress = 0; demoReady = true; }, 900);
      }, 420);
    } else if (hookState >= 3) {
      hookDone = true;

      // Remove hook event listeners — scroll container now handles itself
      window.removeEventListener('wheel',      onHookWheel);
      window.removeEventListener('touchstart', onHookTouchStart);
      window.removeEventListener('touchmove',  onHookTouchMove);
      window.removeEventListener('touchend',   onHookTouchEnd);

      // Animate hook layer out
      const hookLayer = document.getElementById('hook-layer');
      hookLayer.classList.add('is-exiting');

      // Set inert after transition (fallback timeout for reduced-motion / transitionend miss)
      let exitDone = false;
      const finishExit = () => {
        if (exitDone) return;
        exitDone = true;
        hookLayer.setAttribute('inert', '');
      };
      hookLayer.addEventListener('transitionend', finishExit, { once: true });
      setTimeout(finishExit, 700);

      // No scrollTo needed — .funnel-scroll starts at scrollTop:0 with Slide 2 already in position
    }
  }

  window.advanceHook = advanceHook;

  let hookTouchY = 0;
  let touchStartY = 0;

  function onHookWheel(e) {
    if (hookDone) return;
    e.preventDefault();
    if (hookState === 0) {
      if (e.deltaY > 0) hookIntroScrollAcc += e.deltaY;
      else hookIntroScrollAcc = Math.max(0, hookIntroScrollAcc + e.deltaY);
      if (hookIntroScrollAcc >= HOOK_INTRO_SCROLL_THRESHOLD) {
        hookIntroScrollAcc = 0;
        advanceHook();
      }
      return;
    }
    if (demoReady && hookState === 1) { scrubDemo(e.deltaY); return; }
    if (demoReady && hookState === 2 && e.deltaY < 0) { scrubDemo(e.deltaY); return; }
  }

  function onHookTouchStart(e) {
    hookTouchY = e.touches[0].clientY;
    touchStartY = e.touches[0].clientY;
  }

  function onHookTouchMove(e) {
    if (hookDone) return;
    e.preventDefault();
    const delta = hookTouchY - e.touches[0].clientY;
    hookTouchY = e.touches[0].clientY;
    if (hookState === 0) {
      hookIntroScrollAcc += Math.max(0, delta) * 2;
      if (hookIntroScrollAcc >= HOOK_INTRO_SCROLL_THRESHOLD) {
        hookIntroScrollAcc = 0;
        advanceHook();
      }
      return;
    }
    if (demoReady && (hookState === 1 || (hookState === 2 && delta < 0))) { scrubDemo(delta * 2); return; }
  }

  function onHookTouchEnd(e) {
    // advancement is button-only; nothing to do on swipe
  }

  window.addEventListener('wheel',      onHookWheel,      { passive: false });
  window.addEventListener('touchstart', onHookTouchStart, { passive: true });
  window.addEventListener('touchmove',  onHookTouchMove,  { passive: false });
  window.addEventListener('touchend',   onHookTouchEnd,   { passive: true });

  /* ── Restore hook layer on scroll-up from slide 2 ── */
  function restoreHookLayer() {
    const hookLayer = document.getElementById('hook-layer');
    hookLayer.removeAttribute('inert');
    hookLayer.classList.remove('is-exiting');
    hookDone  = false;
    hookState = 2; // back to: demo visible + CTA visible
    window.addEventListener('wheel',      onHookWheel,      { passive: false });
    window.addEventListener('touchstart', onHookTouchStart, { passive: true });
    window.addEventListener('touchmove',  onHookTouchMove,  { passive: false });
    window.addEventListener('touchend',   onHookTouchEnd,   { passive: true });
  }

  funnelScroll.addEventListener('wheel', (e) => {
    if (!hookDone) return;
    if (funnelScroll.scrollTop === 0 && e.deltaY < 0) {
      e.preventDefault();
      restoreHookLayer();
    }
  }, { passive: false });

  let funnelTouchRestoreY = 0;
  funnelScroll.addEventListener('touchstart', (e) => {
    funnelTouchRestoreY = e.touches[0].clientY;
  }, { passive: true });
  funnelScroll.addEventListener('touchend', (e) => {
    if (!hookDone) return;
    if (funnelScroll.scrollTop === 0 && e.changedTouches[0].clientY - funnelTouchRestoreY > 30) {
      restoreHookLayer();
    }
  }, { passive: true });
}
