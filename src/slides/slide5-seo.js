export function init() {
  /* ── Slide 5: SEO ── */
  const seoObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.played) {
        entry.target.dataset.played = '1';
        document.getElementById('seoEyebrow').classList.add('is-visible');
        document.getElementById('seoHeadline').classList.add('is-visible');
        setTimeout(() => document.getElementById('seoSearchCard').classList.add('is-visible'), 200);
        setTimeout(() => {
          document.getElementById('seoLhCard').classList.add('is-visible');
          document.getElementById('seoBulletsCard').classList.add('is-visible');
        }, 380);
        setTimeout(() => document.getElementById('lhArc').classList.add('is-filled'), 550);
        [1, 2, 3, 4].forEach(i => {
          setTimeout(() => document.getElementById('seoBullet' + i).classList.add('is-visible'), 500 + i * 130);
        });
        setTimeout(() => document.getElementById('seoCloser').classList.add('is-visible'), 1100);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.slide--seo').forEach(s => seoObs.observe(s));
}
