export function init() {
  const featIframe = document.getElementById('featIframe');
  const featTabs   = document.getElementById('featTabs');
  const featBrowserUrl = document.getElementById('featBrowserUrl');

  if (!featIframe || !featTabs) return;

  featTabs.querySelectorAll('.feat-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      featTabs.querySelectorAll('.feat-tab').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const demo = btn.dataset.demo;
      if (featBrowserUrl && btn.dataset.url) {
        featBrowserUrl.textContent = btn.dataset.url;
      }
      if (demo && featIframe.src !== new URL(demo, window.location.href).href) {
        featIframe.classList.add('is-loading');
        featIframe.src = demo;
      }
    });
  });

  featIframe.addEventListener('load', () => {
    featIframe.classList.remove('is-loading');
  });

  const featObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.played) {
        entry.target.dataset.played = '1';
        entry.target.querySelectorAll(
          '.features-eyebrow, .features-headline, .features-body'
        ).forEach(el => el.classList.add('is-visible'));
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.slide--features').forEach(s => featObs.observe(s));
}
