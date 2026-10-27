(function () {
  'use strict';

  var selector = '.home-section, .portfolio-project, .article-row:not(.related-entry), .about-story, .about-contact, .workbench-section, .article-body-section, .project-body-section, .related-section';
  var media = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var observer = null;
  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;
  var pending = new Set();
  var introReady = false;
  var marqueeObserver = null;

  function markHeadingLanguage(scope) {
    scope.querySelectorAll('h1, h2, h3, h4').forEach(function (node) {
      if (!node.hasAttribute('lang') && /[A-Za-z]/.test(node.textContent) && !/[\u3400-\u9fff]/.test(node.textContent)) node.lang = 'en';
    });
  }

  function observeMarquee() {
    if (marqueeObserver) marqueeObserver.disconnect();
    document.querySelectorAll('.home-marquee').forEach(function (node) { node.classList.remove('is-marquee-visible'); });
    if (media.matches || !('IntersectionObserver' in window)) return;
    marqueeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle('is-marquee-visible', entry.isIntersecting && !media.matches); });
    });
    document.querySelectorAll('.home-marquee').forEach(function (node) { marqueeObserver.observe(node); });
  }

  function setupHeader() {
    var header = document.querySelector('.site-header');
    if (!header || !('IntersectionObserver' in window)) return;
    var desktop = window.matchMedia('(min-width: 1024px)');
    var sentinel = document.createElement('span');
    sentinel.className = 'site-header-sentinel'; sentinel.setAttribute('aria-hidden', 'true');
    document.body.prepend(sentinel);
    function updateHeader() { header.classList.toggle('is-scrolled', desktop.matches && window.scrollY > 24); }
    var headerObserver = new IntersectionObserver(updateHeader);
    headerObserver.observe(sentinel);
    desktop.addEventListener('change', updateHeader);
    window.addEventListener('pageshow', updateHeader);
    updateHeader();
  }

  function finishIntro() {
    document.querySelectorAll('.motion-intro, .motion-highlight').forEach(function (node) {
      node.classList.remove('motion-intro', 'motion-highlight');
      node.style.removeProperty('--intro-delay');
    });
    introReady = true;
    if (window.SITE_MOTION) window.SITE_MOTION.introReady = true;
    document.dispatchEvent(new Event('myweb:intro-complete'));
  }

  function complete(node, immediate) {
    node.classList.remove('motion-pending');
    pending.delete(node);
    if (observer) observer.unobserve(node);
    if (immediate || media.matches) {
      node.classList.remove('motion-reveal');
      node.style.removeProperty('--reveal-delay');
    } else {
      node.classList.add('motion-reveal');
    }
  }

  function clearMotion() {
    if (observer) observer.disconnect();
    observer = null;
    document.querySelectorAll('.motion-pending, .motion-reveal, .motion-intro, .motion-highlight').forEach(function (node) {
      node.classList.remove('motion-pending', 'motion-reveal', 'motion-intro', 'motion-highlight');
      node.style.removeProperty('--reveal-delay');
      node.style.removeProperty('--intro-delay');
    });
    pending.clear();
  }

  function hashTarget() {
    try { return document.getElementById(decodeURIComponent(location.hash.slice(1))); }
    catch (error) { return null; }
  }

  function revealTarget(target) {
    if (!(target instanceof Element)) return;
    var node = target;
    while (node) {
      if (node.classList.contains('motion-pending') || node.classList.contains('motion-reveal')) complete(node, true);
      if (node.classList.contains('motion-intro')) {
        node.classList.remove('motion-intro');
        node.style.removeProperty('--intro-delay');
      }
      node = node.parentElement;
    }
  }

  function ensureObserver() {
    if (media.matches || !('IntersectionObserver' in window)) return false;
    if (observer) return true;
    try {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) complete(entry.target, false);
        });
      }, { threshold: .04, rootMargin: '0px 0px -16px 0px' });
      return true;
    } catch (error) {
      clearMotion();
      return false;
    }
  }

  function reveal(container) {
    var scope = container && typeof container.querySelectorAll === 'function' ? container : document;
    markHeadingLanguage(scope);
    if (!ensureObserver()) return;
    var nodes = Array.from(scope.querySelectorAll(selector));
    if (scope instanceof Element && scope.matches(selector)) nodes.unshift(scope);
    var target = hashTarget();
    nodes.forEach(function (node, index) {
      if (seen && seen.has(node)) return;
      if (seen) seen.add(node);
      // Already visible/previous content and explicit fragment destinations stay immediate.
      var rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height || rect.top < innerHeight ||
          (target && (node === target || node.contains(target) || target.contains(node)))) return;
      node.style.setProperty('--reveal-delay', Math.min(index % 5, 4) * 60 + 'ms');
      node.classList.add('motion-pending');
      pending.add(node);
      try { observer.observe(node); }
      catch (error) { complete(node, true); }
    });
  }

  function intro() {
    if (media.matches) return finishIntro();
    ['.home-opening h1', '.home-bio', '.home-opening-actions'].forEach(function (item, index) {
      var node = document.querySelector(item);
      if (!node || !node.getClientRects().length) return;
      node.style.setProperty('--intro-delay', index * 80 + 'ms');
      node.classList.add('motion-intro');
    });
    document.querySelectorAll('.home-bio .bio-highlight').forEach(function (node) { node.classList.add('motion-highlight'); });
    // Clean up even when animationend is unavailable or the document was backgrounded.
    window.setTimeout(finishIntro, 700);
  }

  document.addEventListener('animationend', function (event) {
    var node = event.target;
    if (!(node instanceof Element)) return;
    if (event.animationName === 'site-reveal') {
      node.classList.remove('motion-reveal');
      node.style.removeProperty('--reveal-delay');
    }
  });
  document.addEventListener('focusin', function (event) { revealTarget(event.target); });
  window.addEventListener('hashchange', function () { revealTarget(hashTarget()); });
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) clearMotion(); // Back/forward cache restoration never replays entry motion.
  });

  function preferenceChanged() {
    if (media.matches) clearMotion();
    else reveal(document);
    observeMarquee();
  }
  if (typeof media.addEventListener === 'function') media.addEventListener('change', preferenceChanged);
  else if (typeof media.addListener === 'function') media.addListener(preferenceChanged);

  window.SITE_MOTION = { reveal: reveal, clear: clearMotion, introReady: introReady };
  try {
    setupHeader();
    observeMarquee();
    intro();
    reveal(document);
    revealTarget(hashTarget());
  } catch (error) {
    clearMotion(); // Enhancement errors must never leave the page unreadable.
  }
})();
