import axios from "axios";

// Resolve API base URL for image links and non-axios requests.
// Priority:
// 1. VITE_API_BASE (recommended)
// 2. VITE_API_URL (legacy, may include /api)
// 3. axios.defaults.baseURL

const envBase =
  (import.meta.env.VITE_API_BASE as string | undefined) ||
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "";

// Support runtime-config injected by the hosting environment. This allows changing
// the API_BASE without rebuilding the SPA. The host can inject a global
// `window.__RUNTIME_CONFIG__ = { API_BASE: 'https://api.example.com' }` or
// provide a /config.json that index.html loads into that global before the app.
const runtimeBase = (typeof globalThis !== "undefined" &&
  (globalThis as any).__RUNTIME_CONFIG__?.API_BASE) as string | undefined;

// Normalize: remove trailing / and strip trailing /api if present
const normalize = (s: string) =>
  s.replace(/\/(api)?\/?$/, "").replace(/\/$/, "");

export const API_BASE =
  runtimeBase || envBase
    ? normalize(runtimeBase || envBase)
    : (axios.defaults.baseURL || "").replace(/\/(api)?\/?$/, "");

export function getImageUrl(imagePath?: string) {
  if (!imagePath) return "";
  if (/^https?:\/\//.test(imagePath)) return imagePath;
  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  // If API_BASE is empty, return the relative path (fallback)
  if (!API_BASE) return path;
  return `${API_BASE}${path}`;
}
