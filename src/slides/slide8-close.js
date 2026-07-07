export function init() {
  /* ── Slide 8: The Close ── */
  const closeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.played) {
        entry.target.dataset.played = '1';
        ['closeCityBar','closeEyebrow','closeHeadline','closeSub','closeUrgency','closeCtaBtns','closeTrust'].forEach((id, i) => {
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.classList.add('is-visible');
          }, i * 90);
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.slide--close').forEach(s => closeObs.observe(s));

  document.getElementById('closeQBtn').addEventListener('click', () => {
    document.getElementById('closeQForm').classList.toggle('is-open');
  });
  document.getElementById('closeQSubmit').addEventListener('click', () => {
    const q = document.getElementById('qText').value.trim();
    const email = document.getElementById('qEmail').value.trim();
    if (!q || !email) return;
    document.getElementById('closeQSubmit').style.display = 'none';
    document.getElementById('closeQSent').classList.add('is-visible');
  });
}
