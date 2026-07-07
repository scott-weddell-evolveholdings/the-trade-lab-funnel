export function init() {
  /* ── Slide 7: Social Proof + count-up ── */
  function animateCount(el, target, isFloat, duration) {
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = isFloat ? val.toFixed(1) : Math.round(val) + '+';
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? target.toFixed(1) + '★' : Math.round(target) + '+';
    }
    requestAnimationFrame(step);
  }

  const proofObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.played) {
        entry.target.dataset.played = '1';
        document.getElementById('proofEyebrow').classList.add('is-visible');
        document.getElementById('proofHeadline').classList.add('is-visible');
        setTimeout(() => document.getElementById('proofCard1').classList.add('is-visible'), 200);
        setTimeout(() => document.getElementById('proofCard2').classList.add('is-visible'), 370);
        setTimeout(() => document.getElementById('proofCard3').classList.add('is-visible'), 530);
        setTimeout(() => {
          const statsEl = document.getElementById('proofStats');
          statsEl.classList.add('is-visible');
          statsEl.querySelectorAll('.proof-stat-val').forEach(el => {
            animateCount(el, parseFloat(el.dataset.target), el.dataset.float === 'true', 1400);
          });
        }, 700);
        setTimeout(() => document.getElementById('proofTickerWrap').classList.add('is-visible'), 950);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.slide--proof').forEach(s => proofObs.observe(s));
}
