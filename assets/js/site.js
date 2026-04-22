var EIS_CONSENT_KEY = "eis_cookie_preferences_v1";
var EIS_ANALYTICS_ID = "";

function eisReadConsent() {
  try {
    var saved = window.localStorage.getItem(EIS_CONSENT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

function eisWriteConsent(preferences) {
  try {
    window.localStorage.setItem(EIS_CONSENT_KEY, JSON.stringify(preferences));
  } catch (error) {
    return;
  }
}

function eisLoadGoogleAnalytics() {
  if (!EIS_ANALYTICS_ID || window.__eisAnalyticsLoaded) {
    return;
  }

  window.__eisAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", EIS_ANALYTICS_ID);

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(EIS_ANALYTICS_ID);
  document.head.appendChild(script);
}

function eisApplyConsent(preferences) {
  var analyticsGranted = !!(preferences && preferences.analytics);
  document.documentElement.setAttribute("data-analytics-consent", analyticsGranted ? "granted" : "denied");

  if (analyticsGranted) {
    eisLoadGoogleAnalytics();
  }

  document.dispatchEvent(
    new CustomEvent("eis:consent-updated", {
      detail: {
        analytics: analyticsGranted
      }
    })
  );
}

function eisSetConsentLauncherState(isOpen) {
  var button = document.querySelector("[data-open-cookie-settings]");
  if (!button) {
    return;
  }

  button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  button.classList.toggle("is-open", isOpen);
}

function eisCloseBanner() {
  var banner = document.querySelector("[data-cookie-banner]");
  if (banner) {
    banner.remove();
  }
  eisSetConsentLauncherState(false);
}

function eisOpenBanner() {
  if (document.querySelector("[data-cookie-banner]")) {
    return;
  }

  var banner = document.createElement("aside");
  banner.className = "cookie-banner";
  banner.setAttribute("data-cookie-banner", "true");
  banner.setAttribute("aria-label", "Cookie preferences");

  banner.innerHTML =
    '<div class="cookie-banner__content">' +
    '<p class="eyebrow">Cookies on this site</p>' +
    "<h2>Choose whether analytics cookies can be used</h2>" +
    "<p>This site uses essential storage to remember your cookie choice. Optional analytics cookies can be enabled later when Google Analytics is added, but they should not run unless you opt in.</p>" +
    '<div class="cookie-banner__actions">' +
    '<button class="button button--primary" type="button" data-cookie-accept>Accept analytics</button>' +
    '<button class="button button--secondary" type="button" data-cookie-reject>Reject analytics</button>' +
    '<a class="cookie-banner__link" href="cookie-policy.html">Cookie policy</a>' +
    "</div>" +
    "</div>";

  document.body.appendChild(banner);
  eisSetConsentLauncherState(true);

  var acceptButton = banner.querySelector("[data-cookie-accept]");
  var rejectButton = banner.querySelector("[data-cookie-reject]");

  acceptButton.addEventListener("click", function () {
    var preferences = {
      analytics: true,
      updatedAt: new Date().toISOString()
    };
    eisWriteConsent(preferences);
    eisApplyConsent(preferences);
    eisCloseBanner();
  });

  rejectButton.addEventListener("click", function () {
    var preferences = {
      analytics: false,
      updatedAt: new Date().toISOString()
    };
    eisWriteConsent(preferences);
    eisApplyConsent(preferences);
    eisCloseBanner();
  });
}

function eisEnsureConsentLauncher() {
  if (document.querySelector("[data-open-cookie-settings]")) {
    return;
  }

  var button = document.createElement("button");
  button.type = "button";
  button.className = "cookie-settings-launcher";
  button.setAttribute("data-open-cookie-settings", "true");
  button.setAttribute("aria-label", "Cookie settings");
  button.setAttribute("title", "Cookie settings");
  button.setAttribute("data-label", "Cookie settings");
  button.setAttribute("aria-expanded", "false");
  button.innerHTML =
    '<span class="cookie-settings-launcher__icon" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">' +
    '<g class="cookie-settings-launcher__sliders">' +
    '<path d="M5 6h14" />' +
    '<path d="M5 12h14" />' +
    '<path d="M5 18h14" />' +
    '<circle cx="9" cy="6" r="2.1" fill="currentColor" stroke="none" />' +
    '<circle cx="15" cy="12" r="2.1" fill="currentColor" stroke="none" />' +
    '<circle cx="11" cy="18" r="2.1" fill="currentColor" stroke="none" />' +
    "</g>" +
    '<g class="cookie-settings-launcher__close">' +
    '<path d="M7 7l10 10" />' +
    '<path d="M17 7L7 17" />' +
    "</g>" +
    "</svg>" +
    "</span>" +
    '<span class="sr-only">Cookie settings</span>';
  document.body.appendChild(button);

  button.addEventListener("click", function () {
    eisOpenBanner();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open");
    });
  }

  var yearNode = document.querySelector("[data-current-year]");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  var preferences = eisReadConsent();
  eisApplyConsent(preferences);
  eisEnsureConsentLauncher();

  if (!preferences) {
    eisOpenBanner();
  }

  document.querySelectorAll("[data-open-cookie-settings]").forEach(function (button) {
    button.addEventListener("click", function () {
      eisOpenBanner();
    });
  });
});
