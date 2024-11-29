import { configureLocalization } from "@lit/localize";
import { initRouter } from "./router.js";
import { store } from "./store/store.js";
import "./components/employee-list.js";
import "./components/employee-form.js";
import "./components/nav-menu.js";
import { sourceLocale, targetLocales } from "./generated/locale-codes.js";

async function initializeApplication() {
  const { setLocale } = configureLocalization({
    sourceLocale,
    targetLocales,
    loadLocale: (locale) => import(`./generated/locales/${locale}.js`),
  });

  // Set initial locale based on html lang attribute
  const locale = document.documentElement.lang || "en";
  await setLocale(locale === "tr" ? "tr" : "en");

  try {
    // Initialize router
    const outlet = document.querySelector("#app");
    if (!outlet) {
      throw new Error("Application root element not found");
    }

    initRouter(outlet);

    // Initialize store with default state
    store.dispatch({ type: "INIT_APPLICATION" });

    return true;
  } catch (error) {
    console.error("Application initialization failed:", error);
    const app = document.querySelector("#app");
    if (app) {
      app.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h1>Application Error</h1>
          <p>Please refresh the page or try again later.</p>
        </div>
      `;
    }
  }
}

// Start the application
initializeApplication();
