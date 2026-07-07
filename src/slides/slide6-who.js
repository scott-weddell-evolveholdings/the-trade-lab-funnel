export function init() {
  /* ── Slide 6: Who We Are ── */
  const whoObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.played) {
        entry.target.dataset.played = '1';
        document.getElementById('whoAvatarCol').classList.add('is-visible');
        document.getElementById('whoText').classList.add('is-visible');
      }
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('.slide--who').forEach(s => whoObs.observe(s));
}
