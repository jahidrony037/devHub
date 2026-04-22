/**
 * lib/axios.ts
 *
 * WHY AXIOS (instead of just fetch everywhere)?
 * - Automatic JSON parsing — no need for `.json()` on every response
 * - Interceptors — one place to attach auth headers, log requests, handle 401s
 * - Timeout support out of the box
 * - Cleaner error objects (error.response vs raw fetch rejection)
 * - Ideal for CLIENT components where you need request cancellation (AbortController)
 *
 * We keep Axios on the CLIENT side only and use native `fetch` in Server
 * Components so Next.js can inject its caching layer (cache, revalidate, tags).
 */

import axios, { AxiosError, InternalAxiosRequestConfig, isCancel } from "axios";

// ─── Base Instance ─────────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Good place to: attach JWT tokens, add tracing headers, log outgoing calls

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // In production you'd do: config.headers.Authorization = `Bearer ${getToken()}`;
    console.log(
      `[Axios ▶] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  },
  (error: AxiosError) => {
    console.error("[Axios Request Error]", error.message);
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ──────────────────────────────────────────────────────
// Good place to: normalise error shapes, refresh tokens on 401, toast errors

apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Axios ◀] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // ✅ Intentional AbortController cancels are NOT errors — skip them entirely.
    // This happens in React StrictMode (double-mount) and on component unmount.
    if (isCancel(error)) return Promise.reject(error);

    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 404) console.warn(`[Axios 404] Not found: ${url}`);
    else if (status === 500) console.error(`[Axios 500] Server error: ${url}`);
    else if (!status) console.error("[Axios Network Error] No response received");

    return Promise.reject(error);
  }
);

export default apiClient;
