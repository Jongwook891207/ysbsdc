import { SITE_URL } from "./seo";

/**
 * IndexNow protocol client (https://www.indexnow.org/documentation).
 * Server-side only (calls out to api.indexnow.org) — never imported from a
 * Client Component.
 *
 * This module only knows how to *submit* URLs. Deciding *which* URLs
 * changed is scripts/indexnow.ts's job (git-diff based change detection) —
 * kept separate so this stays a small, directly testable HTTP client.
 */

/**
 * The IndexNow key. IndexNow's own documentation calls this a value "only
 * you and search engines should know" — not because it's a security
 * boundary (submitting a URL you don't own just gets rejected by the host
 * check), but so a stranger can't spam submissions that look like they
 * came from this site. It still has to be published, verifiable, and
 * fetchable at `${SITE_URL}/${INDEXNOW_KEY}.txt` (public/<key>.txt in this
 * repo) for the protocol's ownership check to work at all — so keeping it
 * out of chat/log output is reasonable hygiene, but there's no reason to
 * hide it behind an env var: it lives here as a plain constant, matched by
 * the identical public/{key}.txt file. Rotating the key means updating
 * this constant and renaming that file together — the only two places it
 * appears.
 */
const INDEXNOW_KEY = "00770b51e6314d84b08b46c8159b5158";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** Every URL indexnow.org accepts submissions for a given host must resolve to this — the fixed production origin, never localhost/preview. */
const PRODUCTION_ORIGIN = new URL(SITE_URL).origin;

export interface IndexNowSubmitResult {
  submitted: string[];
  status: number;
  ok: boolean;
  /** Human-readable reason, filled in for non-2xx responses. Never includes the key. */
  error?: string;
}

/**
 * Validates a candidate URL/path against the production origin and returns
 * the absolute URL to submit, or null if it doesn't belong to this site.
 * Accepts either a root-relative path ("/column/foo") or a full URL that
 * must match PRODUCTION_ORIGIN exactly — anything else (localhost, a
 * *.vercel.app preview, a different host entirely) is rejected here so a
 * bad argument can never reach the API call.
 */
export function toProductionUrl(pathOrUrl: string): string | null {
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/")) {
    return new URL(trimmed, SITE_URL).toString();
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.origin === PRODUCTION_ORIGIN ? parsed.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Submits a batch of already-validated production URLs to IndexNow.
 * Caller is expected to have run every entry through toProductionUrl()
 * first — this function itself doesn't re-validate host, only rejects an
 * empty list.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowSubmitResult> {
  if (urls.length === 0) {
    return { submitted: [], status: 0, ok: true };
  }

  const host = PRODUCTION_ORIGIN.replace(/^https?:\/\//, "");
  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  let response: Response;
  try {
    response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return {
      submitted: [],
      status: 0,
      ok: false,
      error: `network error calling IndexNow: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (response.ok) {
    return { submitted: urls, status: response.status, ok: true };
  }

  const reason =
    response.status === 429
      ? "429 Too Many Requests — IndexNow is rate-limiting this host, try again later"
      : response.status === 403
        ? "403 Forbidden — key verification failed (check public/<key>.txt is reachable at keyLocation)"
        : response.status === 422
          ? "422 Unprocessable — one or more URLs don't belong to this host/key"
          : `HTTP ${response.status}`;

  return { submitted: [], status: response.status, ok: false, error: reason };
}
