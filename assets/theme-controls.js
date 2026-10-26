(function () {
  'use strict';

  var root = document.documentElement;
  var navigation = document.getElementById('site-nav');
  var storageKey = 'myweb_theme_v1';
  if (!navigation || navigation.querySelector('.nav-theme')) return;

  function isTheme(value) { return value === 'paper' || value === 'night'; }
  function timeDefault() {
    var hour = new Date().getHours();
    return hour >= 20 || hour < 6 ? 'night' : 'paper';
  }
  function savedTheme() {
    try { return localStorage.getItem(storageKey); } catch (error) { return null; }
  }

  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'nav-theme';
  button.setAttribute('aria-pressed', 'false');
  var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('width', '18');
  icon.setAttribute('height', '18');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '1.7');
  icon.setAttribute('stroke-linecap', 'round');
  icon.setAttribute('stroke-linejoin', 'round');
  icon.setAttribute('aria-hidden', 'true');
  var shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  icon.appendChild(shape);
  var label = document.createElement('span');
  label.className = 'nav-theme-label';
  button.append(icon, label);
  navigation.insertBefore(button, navigation.querySelector('.nav-search') || navigation.querySelector('.nav-contact'));

  function applyTheme(theme, persist) {
    var mode = isTheme(theme) ? theme : timeDefault();
    root.setAttribute('data-theme', mode);
    root.style.colorScheme = mode === 'night' ? 'dark' : 'light';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = mode === 'night' ? '#1e2420' : '#faf7f2';
    var night = mode === 'night';
    var action = night ? '切换为纸色模式' : '切换为夜色模式';
    button.setAttribute('aria-pressed', String(night));
    button.setAttribute('aria-label', action);
    button.title = action;
    label.textContent = night ? '切换纸色' : '切换夜色';
    shape.setAttribute('d', night
      ? 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42'
      : 'M20.3 14.1A8.2 8.2 0 0 1 9.9 3.7 8.3 8.3 0 1 0 20.3 14.1Z');
    if (persist) {
      try { localStorage.setItem(storageKey, mode); } catch (error) { /* This page still switches when storage is unavailable. */ }
    }
    document.dispatchEvent(new CustomEvent('myweb:theme-change', { detail: { theme: mode, manual: Boolean(persist) } }));
  }

  var stored = savedTheme();
  applyTheme(isTheme(stored) ? stored : (isTheme(root.dataset.theme) ? root.dataset.theme : timeDefault()), false);
  button.addEventListener('click', function () { applyTheme(root.dataset.theme === 'night' ? 'paper' : 'night', true); });
  window.addEventListener('storage', function (event) {
    if (event.key !== storageKey && event.key !== null) return;
    applyTheme(isTheme(event.newValue) ? event.newValue : timeDefault(), false);
  });
})();
