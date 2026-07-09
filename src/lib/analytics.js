// ── Conversion event tracking ────────────────────────────────────────────────
// Pushes to the GTM dataLayer only. GTM (configured in the container itself,
// not here) fans each event out to GA4 + Meta Pixel — see docs/ANALYTICS-SETUP.md.
// If VITE_GTM_ID is unset, GTM's snippet never loads, dataLayer.push() below is
// still safe (array grows in memory, nothing reads it) — so this is a no-op.

/**
 * @param {string} event - dataLayer event name (matches a GTM Custom Event trigger)
 * @param {Record<string, unknown>} [params] - extra fields available to GTM tags
 */
export function track(event, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
