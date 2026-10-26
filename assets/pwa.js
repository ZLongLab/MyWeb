(function () {
  'use strict';

  // File opening remains a complete static experience, without forbidden manifest
  // or service-worker requests. Installation is optional browser functionality.
  if ((location.protocol !== 'http:' && location.protocol !== 'https:') || !window.isSecureContext) return;

  if (!document.querySelector('link[rel="manifest"]')) {
    var manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = './manifest.webmanifest';
    document.head.appendChild(manifest);
  }

  if ('serviceWorker' in navigator) {
    function registerWorker() {
      navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' }).catch(function () {
        // Unsupported storage, a restricted browser or a failed install must not
        // prevent ordinary page navigation or local notes from working.
      });
    }
    if (document.readyState === 'complete') registerWorker();
    else window.addEventListener('load', registerWorker, { once: true });
  }

  var pendingPrompt = null;
  var installButton = null;
  var standalone = window.matchMedia ? window.matchMedia('(display-mode: standalone)') : null;

  function installed() {
    return Boolean((standalone && standalone.matches) || navigator.standalone === true);
  }

  function hideInstall() {
    pendingPrompt = null;
    if (installButton) installButton.remove();
    installButton = null;
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    if (installed() || typeof event.prompt !== 'function') return;
    var footer = document.querySelector('.footer-inner');
    if (!footer) return;
    event.preventDefault();
    pendingPrompt = event;
    if (installButton) return;

    installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.className = 'site-install';
    installButton.textContent = '安装小站';
    installButton.title = '添加到桌面或主屏幕';
    installButton.addEventListener('click', function () {
      if (!pendingPrompt || installed()) return;
      var prompt = pendingPrompt;
      pendingPrompt = null;
      installButton.disabled = true;
      // A real browser prompt can be used only once. Dismissal is not treated as
      // successful installation; a later browser event can offer it again.
      Promise.resolve().then(function () { return prompt.prompt(); }).then(function () {
        return prompt.userChoice;
      }).catch(function () {
        // Installation may be disallowed by the platform; browsing still works.
      }).then(hideInstall);
    });
    footer.appendChild(installButton);
  });

  window.addEventListener('appinstalled', hideInstall);
  if (standalone && standalone.addEventListener) {
    standalone.addEventListener('change', function () { if (installed()) hideInstall(); });
  }
})();
