import axios from "axios";
import { navigateTo } from "../utils/navigation";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// ─── Refresh state ────────────────────────────────────────────────────────────

/**
 * True while a /auth/refresh call is in-flight.
 * Prevents multiple simultaneous refresh calls.
 */
let isRefreshing = false;

/**
 * Every request that arrives with TOKEN_EXPIRED *while a refresh is already
 * running* gets a pair of { resolve, reject } pushed here.
 * Once the refresh settles we drain the queue — resolving wakes up the request
 * so it can retry; rejecting surfaces the error to the caller.
 */
type Waiter = { resolve: () => void; reject: (err: unknown) => void };
let queue: Waiter[] = [];

function drainQueue(err: unknown | null) {
  queue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve()));
  queue = [];
}

// ─── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  // ── Case 1: request succeeded — pass it straight through ──────────────────
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ── Case 2: the /auth/refresh route itself failed ──────────────────────
    // Never retry this — would create an infinite refresh loop.
    // Let it fall through so the catch block in the calling code handles it.
    if (originalRequest.url === "/auth/refresh") {
      return Promise.reject(error);
    }

    // ── Case 3: access token expired on a normal request ──────────────────
    // Conditions:
    //   • 401 status  (authentication failed)
    //   • code === "TOKEN_EXPIRED"  (specifically the JWT expiry, not a wrong
    //     token, missing token, or any other auth error)
    //   • _retry not yet set  (guards against retrying the retry itself)
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // mark so this config is never retried twice

      // ── Case 3a: a refresh is already running ──────────────────────────
      // Park this request in the queue. When the in-flight refresh settles,
      // drainQueue() will either resolve (retry) or reject (propagate error).
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          queue.push({ resolve, reject });
        })
          .then(() => api(originalRequest)) // refresh succeeded → retry
          .catch((err) => Promise.reject(err)); // refresh failed  → surface error
      }

      // ── Case 3b: no refresh running — we are the first expired request ──
      isRefreshing = true;

      try {
        // Ask the server for a new access token using the refresh-token cookie.
        // The server responds by setting a fresh accessToken cookie; we don't
        // need the response body.
        await api.post("/auth/refresh");

        // Refresh succeeded:
        // 1. Wake up every queued request so they can retry with the new cookie.
        drainQueue(null);

        // 2. Retry our own original request.
        return api(originalRequest);
      } catch (refreshError) {
        // ── Case 3c: refresh token is also expired / missing ──────────────
        // The session is truly over.

        // 1. Reject every queued request so their callers get the error.
        drainQueue(refreshError);

        // 2. Tell AuthContext to wipe user state (custom event avoids a
        //    circular import between this file and AuthContext.tsx).
        window.dispatchEvent(new CustomEvent("auth:session-expired"));

        // 3. Redirect to login.
        navigateTo("/login");

        return Promise.reject(refreshError);
      } finally {
        // Always reset the flag so the next expiry cycle works correctly.
        isRefreshing = false;
      }
    }

    // ── Case 4: any other error (404, 500, wrong password, etc.) ──────────
    // Nothing to do — just forward it to the calling code.
    return Promise.reject(error);
  },
);
