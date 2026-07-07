// ── Lead capture config ──────────────────────────────────────
// Paste your GoHighLevel inbound webhook URL here before deploying.
// Until then the form still works (shows success + goes to the welcome flow),
// it just won't push the lead to your CRM.
const GHL_WEBHOOK_URL = 'YOUR_GHL_WEBHOOK_URL'
const WELCOME_URL = 'welcome.html'

export function init() {
  /* ── Modal ── */
  const overlay   = document.getElementById('modalOverlay');
  const sheet     = document.getElementById('modalSheet');
  const formWrap  = document.getElementById('modalFormWrap');
  const success   = document.getElementById('modalSuccess');

  function openModal() {
    overlay.classList.add('is-open');
    sheet.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('f-name').focus(), 420);
  }
  function closeModal() {
    overlay.classList.remove('is-open');
    sheet.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function handleOverlayClick(e) {
    if (e.target === overlay) closeModal();
  }
  function handleSubmit(e) {
    e.preventDefault();
    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const city  = document.getElementById('f-city').value.trim();
    if (!name || !email || !city) return;

    // Send the lead to GoHighLevel (fire-and-forget). Swap the placeholder for
    // your real GHL inbound webhook URL before going live.
    if (GHL_WEBHOOK_URL && GHL_WEBHOOK_URL !== 'YOUR_GHL_WEBHOOK_URL') {
      fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, city, niche: 'plumbing', source: 'cinematic-funnel' }),
      }).catch(() => {});
    }

    // Show success, then hand off to the welcome flow (quiz → ROI → DFY offer).
    formWrap.classList.add('is-hidden');
    success.classList.add('is-visible');
    setTimeout(() => { window.location.href = WELCOME_URL; }, 1400);
  }

  window.openModal = openModal;
  window.closeModal = closeModal;
  window.handleOverlayClick = handleOverlayClick;
  window.handleSubmit = handleSubmit;

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
