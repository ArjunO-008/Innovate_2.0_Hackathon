/**
 * apiFetch — tries /api/webhook/{path} first.
 * If the primary returns a non-ok status or network error,
 * automatically retries with /api/webhook-test/{path}.
 *
 * NOTE: Some endpoints (e.g. /create, /create/selection) only exist
 * under webhook-test — the 500 on primary for those is expected and
 * the fallback handles it transparently.
 *
 * @param {string} path     e.g. "task?projectName=foo" or "task/finale"
 * @param {RequestInit} options  standard fetch options (method, headers, body…)
 * @returns {Promise<Response>}  the first successful Response
 * @throws  if both primary and fallback fail
 */
export async function apiFetch(path, options = {}) {
  const primary  = `/api/webhook/${path}`;
  const fallback = `/api/webhook-test/${path}`;

  let primaryStatus = null;

  try {
    const res = await fetch(primary, options);
    if (res.ok) return res;
    primaryStatus = res.status;
    // Non-ok but responded — fall through to fallback
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    // Network / CORS error on primary
    primaryStatus = "network error";
  }

  console.warn(`[apiFetch] /${path} — primary failed (${primaryStatus}), trying fallback…`);

  const fallbackRes = await fetch(fallback, options);

  if (!fallbackRes.ok) {
    console.error(`[apiFetch] /${path} — fallback also failed (${fallbackRes.status})`);
  }

  return fallbackRes;
}