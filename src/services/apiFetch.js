/**
 * apiFetch — tries /api/webhook/{path} first.
 * If the server responds with a non-ok status or network error,
 * automatically retries with /api/webhook-test/{path}.
 *
 * @param {string} path  - e.g. "task?projectName=foo" or "task/finale"
 * @param {RequestInit} options - standard fetch options (method, headers, body…)
 * @returns {Promise<Response>} the successful Response object
 */
export async function apiFetch(path, options = {}) {
  const primary  = `/api/webhook/${path}`;
  const fallback = `/api/webhook-test/${path}`;

  try {
    const res = await fetch(primary, options);
    if (res.ok) return res;

    // Primary responded but with an error status — try fallback
    console.warn(`[apiFetch] Primary failed (${res.status}), retrying fallback…`);
  } catch (err) {
    // Primary had a network/CORS error — try fallback
    console.warn(`[apiFetch] Primary network error, retrying fallback…`, err.message);
  }

  const res = await fetch(fallback, options);
  return res;
}




























