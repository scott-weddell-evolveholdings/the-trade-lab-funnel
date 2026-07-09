// ── Lead capture ─────────────────────────────────────────────────────────────
// The opt-in POSTs to our own backend route /api/ghl/lead (a Netlify Function),
// which talks to GoHighLevel server-side. The GHL API key is NEVER in this file
// or anywhere in the browser bundle.
import { track } from '../lib/analytics.js';

const LEAD_ENDPOINT = '/api/ghl/lead'
const WELCOME_URL = 'welcome.html'
// Where we stash the lead so welcome.html's quiz can update the SAME contact.
const LEAD_STORAGE_KEY = 'tl-lead'

export function init() {
  /* ── Modal ── */
  const overlay   = document.getElementById('modalOverlay');
  const sheet     = document.getElementById('modalSheet');
  const formWrap  = document.getElementById('modalFormWrap');
  const success   = document.getElementById('modalSuccess');
  const submitBtn = document.getElementById('modalSubmitBtn');
  const errorEl   = document.getElementById('modalFormError');

  let submitting = false;

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

  function setLoading(on) {
    submitting = on;
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.classList.toggle('is-loading', on);
  }
  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }
  function clearError() {
    if (errorEl) errorEl.hidden = true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const town  = document.getElementById('f-city').value.trim(); // "Your Town" field
    if (!name || !email || !town) {
      showError('Please fill in your name, email and town.');
      return;
    }

    clearError();
    setLoading(true);

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, town }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Request failed');
      }

      // Persist the lead so the quiz (on welcome.html) can update the same GHL
      // contact by email.
      try {
        localStorage.setItem(
          LEAD_STORAGE_KEY,
          JSON.stringify({ name, email, town, contactId: data.contactId || null })
        );
      } catch { /* storage may be unavailable — quiz will simply skip */ }

      // Conversion event: fires the GTM Custom Event trigger for "generate_lead"
      // (GA4 recommended event name; map to Meta's "Lead" standard event in GTM).
      // No PII in the payload — GA4/Meta terms prohibit sending emails as event params.
      track('generate_lead');

      // Success → show confirmation, then continue to the quiz flow.
      // (Quiz only starts AFTER a successful lead response.)
      formWrap.classList.add('is-hidden');
      success.classList.add('is-visible');
      setTimeout(() => { window.location.href = WELCOME_URL; }, 1400);
    } catch (err) {
      console.error('[opt-in] lead submit failed:', err);
      showError("Sorry — we couldn't save your details. Please check your connection and try again.");
      setLoading(false);
    }
  }

  window.openModal = openModal;
  window.closeModal = closeModal;
  window.handleOverlayClick = handleOverlayClick;
  window.handleSubmit = handleSubmit;

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
