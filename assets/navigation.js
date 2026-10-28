(function () {
  'use strict';

  // Routes carry only the known parent-list state; never accept arbitrary return URLs.
  function contextFor(section, context) {
    var source = context || {};
    var entries = section === 'projects' ? window.SITE_PROJECTS : window.SITE_ARTICLES;
    var categories = (Array.isArray(entries) ? entries : []).map(function (entry) { return entry.category; });
    var category = typeof source.category === 'string' && categories.indexOf(source.category) !== -1 ? source.category : '';
    var q = section === 'articles' && typeof source.q === 'string' ? source.q.trim().slice(0, 100) : '';
    var tags = (Array.isArray(entries) ? entries : []).flatMap(function (entry) { return Array.isArray(entry.tags) ? entry.tags : []; });
    var tag = section === 'articles' && typeof source.tag === 'string' && tags.indexOf(source.tag) !== -1 ? source.tag : '';
    var view = section === 'articles' && (source.view === 'time' || source.view === 'topics') ? source.view : '';
    return { category: category, q: q, tag: tag, view: view };
  }

  function listHref(section, context) {
    var page = section === 'projects' ? 'projects.html' : 'articles.html';
    var state = contextFor(section, context);
    var params = new URLSearchParams();
    if (state.category) params.set('category', state.category);
    if (state.q) params.set('q', state.q);
    if (state.tag) params.set('tag', state.tag);
    if (state.view) params.set('view', state.view);
    return page + (params.size ? '?' + params.toString() : '');
  }

  function detailHref(section, id, context) {
    if (section === 'projects' && id === 'image-prompts') return 'image-prompts.html';
    if (section === 'projects' && id === 'prompt-optimizer') return 'prompt-optimizer/';
    if (section === 'projects' && id === 'video-prompts') return 'video-prompts.html';
    var page = section === 'projects' ? 'project.html' : 'article.html';
    var state = contextFor(section, context);
    var params = new URLSearchParams({ id: String(id) });
    if (state.category) params.set('category', state.category);
    if (state.q) params.set('q', state.q);
    if (state.tag) params.set('tag', state.tag);
    if (state.view) params.set('view', state.view);
    return page + '?' + params.toString();
  }

  window.SITE_NAV = { listHref: listHref, detailHref: detailHref, contextFor: contextFor };

  // Session storage hands the list position to the next detail entry. History
  // state keeps that origin attached to this entry, including related articles.
  var HANDOFF = 'myweb_list_handoff_v1';
  var RESTORE = 'myweb_list_restore_v1';
  var STATE = 'mywebListOrigin';
  function read(key) {
    try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (error) { return null; }
  }
  function remove(key) { try { sessionStorage.removeItem(key); } catch (error) { /* Optional navigation enhancement. */ } }
  function write(key, value) { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* Native navigation remains available. */ } }
  function pageName(url) { return url.pathname.split('/').pop(); }
  function sectionFor(url) {
    var page = pageName(url);
    if (page === 'projects.html' || page === 'project.html') return 'projects';
    if (page === 'articles.html' || page === 'article.html') return 'articles';
    return '';
  }
  function listKey(url, section) {
    return new URL(listHref(section, { category: url.searchParams.get('category'), q: url.searchParams.get('q'), tag: url.searchParams.get('tag'), view: url.searchParams.get('view') }), url).href;
  }
  function validOrigin(value) {
    return value && typeof value.key === 'string' && Number.isFinite(value.y) && value.y >= 0 && value.y <= 10000000 &&
      Number.isFinite(value.at) && Date.now() - value.at >= 0;
  }
  function cleanHref(url) { var result = new URL(url.href); result.hash = ''; return result.href; }
  var current = new URL(location.href);
  var section = sectionFor(current);
  var isList = section && pageName(current) === (section === 'projects' ? 'projects.html' : 'articles.html');
  var handoff = read(HANDOFF);
  if (!isList && section && validOrigin(handoff) && Date.now() - handoff.at < 120000 && handoff.target === cleanHref(current) && handoff.key === listKey(current, section)) {
    try {
      var state = Object.assign({}, history.state || {});
      state[STATE] = { key: handoff.key, y: handoff.y, at: handoff.at };
      history.replaceState(state, '', location.href);
    } catch (error) { /* Some file browsers restrict history state. */ }
  }
  remove(HANDOFF);

  if (isList) {
    var pending = read(RESTORE);
    remove(RESTORE);
    if (!location.hash && validOrigin(pending) && pending.key === listKey(current, section) && Date.now() - pending.at < 120000) {
      window.addEventListener('load', function () {
        var fonts = document.fonts ? document.fonts.ready : Promise.resolve();
        fonts.then(function () {
          requestAnimationFrame(function () {
            var root = document.documentElement;
            var previous = root.style.scrollBehavior;
            root.style.scrollBehavior = 'auto';
            window.scrollTo(0, Math.min(pending.y, Math.max(0, root.scrollHeight - innerHeight)));
            requestAnimationFrame(function () { root.style.scrollBehavior = previous; });
          });
        });
      }, { once: true });
    }
  }

  // Native fragment navigation creates a history entry without our origin state.
  // Keep the original list attached while readers move through detail sections.
  var detailOrigin = !isList && history.state && history.state[STATE];
  window.addEventListener('hashchange', function () {
    if (!validOrigin(detailOrigin)) return;
    var state = Object.assign({}, history.state || {});
    if (validOrigin(state[STATE])) return;
    state[STATE] = detailOrigin;
    try { history.replaceState(state, ''); } catch (error) { /* Native section navigation still works. */ }
  });

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.getAttribute('target') && link.getAttribute('target') !== '_self')) return;
    var target;
    try { target = new URL(link.getAttribute('href'), location.href); } catch (error) { return; }
    remove(HANDOFF);
    remove(RESTORE);
    if (!section || target.origin !== current.origin || sectionFor(target) !== section) return;
    var targetPage = pageName(target);
    var detailPage = section === 'projects' ? 'project.html' : 'article.html';
    var origin = history.state && history.state[STATE];
    if (target.hash && cleanHref(target) === cleanHref(new URL(location.href))) return;
    if (isList && targetPage === detailPage && link.closest('[data-project-list], #article-list, #garden-map')) {
      origin = { key: listKey(new URL(location.href), section), y: window.scrollY, at: Date.now() };
      write(HANDOFF, Object.assign({ target: cleanHref(target) }, origin));
    } else if (!isList && validOrigin(origin)) {
      if (targetPage === detailPage && listKey(target, section) === origin.key) {
        write(HANDOFF, Object.assign({ target: cleanHref(target) }, origin));
      } else if (link.matches('[data-project-list-link], [data-article-list-link]') && listKey(target, section) === origin.key && targetPage !== detailPage) {
        write(RESTORE, { key: origin.key, y: origin.y, at: Date.now() });
      }
    }
  }, true);
})();
