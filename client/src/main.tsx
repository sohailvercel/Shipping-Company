import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Load runtime config asynchronously (non-blocking)
async function loadRuntimeConfig(timeoutMs = 2000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch("/config.json", { signal: controller.signal });
    clearTimeout(id);
    if (res.ok) {
      try {
        const cfg = await res.json();
        (window as any).__RUNTIME_CONFIG__ = cfg;
      } catch (e) {
        // ignore JSON parse errors
      }
    }
  } catch (e) {
    // network errors or timeout - ignore and continue with env fallbacks
  }
}

async function bootstrap() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  // Attempt to load runtime config but don't block indefinitely
  await loadRuntimeConfig();

  // Dynamically import the app entry so module initialization can read
  // window.__RUNTIME_CONFIG__ if needed.
  const { default: App } = await import("./App.tsx");

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap().catch((err) => {
  // If bootstrap fails, log and attempt a fallback immediate render
  // so the app still shows an error UI instead of a blank page.
  // eslint-disable-next-line no-console
  console.error("Bootstrap failed:", err);
  const rootElement = document.getElementById("root");
  if (rootElement) {
    // If dynamic import failed earlier, try to render by importing App here.
    import("./App.tsx")
      .then(({ default: App }) => {
        ReactDOM.createRoot(rootElement).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
      })
      .catch((e) => {
        // If even this fails, at least show an error in console.
        // eslint-disable-next-line no-console
        console.error("Failed to load App after bootstrap failure", e);
      });
  }
});
