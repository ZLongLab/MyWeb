// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
export default function initialize(scope) {
  (function () {
    "use strict";

    // File opening remains a complete static experience, without forbidden manifest
    // or service-worker requests. Installation is optional browser functionality.
    if (
      (location.protocol !== "http:" && location.protocol !== "https:") ||
      !window.isSecureContext
    )
      return;

    var footer = document.querySelector(".footer-inner"),
      offlineSign,
      clearSign,
      wasOffline = false;
    if (footer) {
      offlineSign = document.createElement("p");
      offlineSign.className = "site-offline";
      offlineSign.setAttribute("role", "status");
      offlineSign.setAttribute("aria-live", "polite");
      offlineSign.setAttribute("aria-atomic", "true");
      var wordmark = footer.querySelector(".house-footer-wordmark");
      if (wordmark) wordmark.before(offlineSign);
      else footer.append(offlineSign);
      function syncConnection() {
        clearTimeout(clearSign);
        if (!navigator.onLine) {
          wasOffline = true;
          var text =
            navigator.serviceWorker && navigator.serviceWorker.controller
              ? "离线中 · 你看的是缓存里的小站"
              : "离线中 · 小站在当前设备上打开";
          if (offlineSign.textContent !== text) offlineSign.textContent = text;
          offlineSign.classList.add("is-offline");
        } else {
          if (wasOffline) offlineSign.textContent = "已恢复连接。";
          wasOffline = false;
          offlineSign.classList.remove("is-offline");
          clearSign = scope.timeout(function () {
            offlineSign.textContent = "";
          }, 250);
        }
      }
      scope.listen(window, "online", syncConnection);
      scope.listen(window, "offline", syncConnection);
      scope.listen(window, "pageshow", syncConnection);
      if ("serviceWorker" in navigator)
        scope.listen(
          navigator.serviceWorker,
          "controllerchange",
          syncConnection,
        );
      syncConnection();
    }

    if (!document.querySelector('link[rel="manifest"]')) {
      var manifest = document.createElement("link");
      manifest.rel = "manifest";
      manifest.href = "./manifest.webmanifest";
      document.head.appendChild(manifest);
    }

    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      function registerWorker() {
        navigator.serviceWorker
          .register("./sw.js", { scope: "./", updateViaCache: "none" })
          .catch(function () {
            // Unsupported storage, a restricted browser or a failed install must not
            // prevent ordinary page navigation or local notes from working.
          });
      }
      if (document.readyState === "complete") registerWorker();
      else scope.listen(window, "load", registerWorker, { once: true });
    }

    var pendingPrompt = null;
    var installButton = null;
    var standalone = window.matchMedia
      ? window.matchMedia("(display-mode: standalone)")
      : null;

    function installed() {
      return Boolean(
        (standalone && standalone.matches) || navigator.standalone === true,
      );
    }

    function hideInstall() {
      pendingPrompt = null;
      if (installButton) installButton.remove();
      installButton = null;
    }

    scope.listen(window, "beforeinstallprompt", function (event) {
      if (installed() || typeof event.prompt !== "function") return;
      var footer = document.querySelector(".footer-inner");
      if (!footer) return;
      event.preventDefault();
      pendingPrompt = event;
      if (installButton) return;

      installButton = document.createElement("button");
      installButton.type = "button";
      installButton.className = "site-install";
      installButton.textContent = "安装小站";
      installButton.title = "添加到桌面或主屏幕";
      scope.listen(installButton, "click", function () {
        if (!pendingPrompt || installed()) return;
        var prompt = pendingPrompt;
        pendingPrompt = null;
        installButton.disabled = true;
        // A real browser prompt can be used only once. Dismissal is not treated as
        // successful installation; a later browser event can offer it again.
        Promise.resolve()
          .then(function () {
            return prompt.prompt();
          })
          .then(function () {
            return prompt.userChoice;
          })
          .catch(function () {
            // Installation may be disallowed by the platform; browsing still works.
          })
          .then(hideInstall);
      });
      footer.appendChild(installButton);
    });

    scope.listen(window, "appinstalled", hideInstall);
    if (standalone && standalone.addEventListener) {
      scope.listen(standalone, "change", function () {
        if (installed()) hideInstall();
      });
    }
  })();
}
