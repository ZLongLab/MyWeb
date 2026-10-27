(function () {
  'use strict';
  if (window.SITE_DETAILS) return;
  var ns = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var page = document.body.dataset.page;
  function el(tag, cls, text) { var node = document.createElement(tag); if (cls) node.className = cls; if (text !== undefined) node.textContent = text; return node; }
  function drawing(paths, cls, size, viewBox) {
    var svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', viewBox || '0 0 64 64'); svg.setAttribute('width', size || '56'); svg.setAttribute('height', size || '56'); svg.setAttribute('class', cls); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    paths.forEach(function (d) { var path = document.createElementNS(ns, 'path'); path.setAttribute('d', d); path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '1.5'); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round'); path.setAttribute('vector-effect', 'non-scaling-stroke'); svg.append(path); }); return svg;
  }
  var pictures = {
    life: ['M18 25h28l-4 26H22zM15 20h34v5H15zM16 53h32'],
    links: ['M16 54V12h32v42M13 54h39M24 54V18l18-4v40M36 34h1'],
    uses: ['M18 13h28M24 13v12a8 8 0 0 0 16 0v-3M32 40v12M21 52h22'],
    guestbook: ['M17 12h30v31L36 54H17zM36 54V43h11']
  };
  if (pictures[page]) document.querySelectorAll('.room-empty, #guestbook-empty').forEach(function (node) { if (!node.querySelector('.empty-sketch')) node.prepend(drawing(pictures[page], 'empty-sketch')); });
  if (page === 'uses') document.querySelectorAll('#uses-software h3, #uses-hardware h3').forEach(function (heading) { var initial = Array.from(heading.textContent.trim())[0] || ''; var mark = el('span', 'tool-initial', initial.toUpperCase()); mark.setAttribute('aria-hidden', 'true'); heading.prepend(mark); });
  document.querySelectorAll('#uses-software > li, #uses-hardware > li:not(.room-empty), #links-resources > li, #links-friends > li:not(.room-empty), .about-timeline li').forEach(function (row) { row.classList.add('detail-sweep'); });
  document.querySelectorAll('.room-door-name').forEach(function (name) { var arrow = el('span', 'door-arrow', '→'); arrow.setAttribute('aria-hidden', 'true'); name.append(arrow); });

  var seasonPaths = {
    spring: ['M12 21V11m0 5C5 16 4 10 4 7c5 0 8 3 8 7m0-3c0-5 4-8 9-8 0 5-3 9-9 9'],
    summer: ['M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 1v2m0 18v2M1 12h2m18 0h2M4 4l1.5 1.5M18.5 18.5 20 20M4 20l1.5-1.5M18.5 5.5 20 4'],
    autumn: ['M5 19 17 7M5 15C3 6 10 3 21 3c0 10-4 16-12 16M11 13v-5m0 5h5'],
    winter: ['M12 2v20M3.4 7l17.2 10M3.4 17 20.6 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4m10 14-1-4 4-1M4 14l4 1-1 4M17 5l-1 4 4 1']
  };
  var greeting = document.querySelector('[data-season-greeting]'), seasonMark, nightLine;
  if (greeting) {
    var line = el('div', 'season-greeting-line'); greeting.before(line); seasonMark = el('span', 'season-mark'); line.append(seasonMark, greeting);
    nightLine = el('p', 'night-greeting', '这么晚了，这间小站给你留了灯。'); nightLine.hidden = true; line.after(nightLine);
    function updateSeason() { var season = document.documentElement.dataset.season || 'autumn'; seasonMark.dataset.season = season; seasonMark.replaceChildren(drawing(seasonPaths[season] || seasonPaths.autumn, 'season-glyph', '20', '0 0 24 24')); }
    function updateNight(hour) {
      if (!Number.isFinite(hour)) hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: (window.SITE_HOUSE || {}).timeZone || 'Asia/Shanghai', hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
      var late = hour >= 0 && hour < 5; nightLine.hidden = !late; document.body.classList.toggle('is-late-night', late);
    }
    updateSeason(); updateNight(); document.addEventListener('myweb:season-change', updateSeason); document.addEventListener('myweb:clock-change', function (event) { updateNight(event.detail.hour); });
    document.querySelectorAll('.home-overview, .home-works, .home-writing').forEach(function (section) {
      section.classList.add('has-house-divider'); var divider = el('div', 'home-divider'); divider.setAttribute('aria-hidden', 'true');
      divider.append(el('span'), drawing(['M2 7 8 2l6 5M4 6v8h8V6M7 10v4'], 'divider-house', '10', '0 0 16 16'), el('span')); section.prepend(divider);
    });
  }

  // One live region for copy feedback, moved into an open modal's top layer.
  var toast = el('div', 'site-toast'); toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite'); toast.setAttribute('aria-atomic', 'true'); document.body.append(toast);
  var toastTimer, clearTimer, frame, serial = 0;
  function showToast(message) {
    clearTimeout(toastTimer); clearTimeout(clearTimer); cancelAnimationFrame(frame); serial++;
    var ticket = serial, host = document.querySelector('dialog[open]') || document.body;
    toast.classList.remove('is-visible'); toast.textContent = ''; if (toast.parentNode !== host) host.append(toast);
    frame = requestAnimationFrame(function () { if (ticket !== serial) return; toast.textContent = String(message); toast.classList.add('is-visible');
      toastTimer = window.setTimeout(function () { toast.classList.remove('is-visible'); clearTimer = window.setTimeout(function () { toast.textContent = ''; }, reduced.matches ? 0 : 300); }, 1600);
    });
  }
  window.SITE_FEEDBACK = { show: showToast };
  document.addEventListener('close', function (event) { if (toast.parentNode === event.target) { clearTimeout(toastTimer); clearTimeout(clearTimer); cancelAnimationFrame(frame); serial++; toast.classList.remove('is-visible'); toast.textContent = ''; document.body.append(toast); } }, true);

  var backTop = el('button', 'floating-top'); backTop.type = 'button'; backTop.setAttribute('aria-label', '回到顶部'); backTop.title = '回到顶部'; backTop.tabIndex = -1; backTop.setAttribute('aria-hidden', 'true'); backTop.append(drawing(['M12 20V4M5 11l7-7 7 7'], 'top-arrow', '20', '0 0 24 24')); document.body.append(backTop);
  var scrollFrame = 0, visible = false;
  function focusMain() { var main = document.getElementById('main'); if (main) { if (!main.hasAttribute('tabindex')) main.tabIndex = -1; main.focus({ preventScroll: true }); } }
  function updateTop() { scrollFrame = 0; var next = window.scrollY > innerHeight; if (next !== visible) { visible = next; if (!next && document.activeElement === backTop) focusMain(); backTop.classList.toggle('is-visible', next); backTop.tabIndex = next ? 0 : -1; backTop.setAttribute('aria-hidden', String(!next)); } }
  function onScroll() { if (tip) tip.classList.remove('is-visible'); if (!scrollFrame) scrollFrame = requestAnimationFrame(updateTop); }
  window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); window.addEventListener('pageshow', onScroll); updateTop();
  backTop.addEventListener('click', function (event) { if (event.detail === 0) focusMain(); window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' }); });
  if (page === 'article') { var progress = el('div', 'reading-progress'); progress.setAttribute('aria-hidden', 'true'); document.body.prepend(progress); }

  var heatmap = document.querySelector('[data-heatmap]'), tip;
  if (heatmap) {
    tip = el('div', 'heatmap-tip'); tip.setAttribute('aria-hidden', 'true'); document.body.append(tip);
    heatmap.addEventListener('pointerover', function (event) { var cell = event.target.closest('.home-heatmap-day'); if (!cell) return;
      var week = Number(cell.style.getPropertyValue('--week')), days = ((((window.SITE_SNAPSHOT || {}).github || {}).weeks || [])[week] || {}).days || [];
      if (!days.length) return; tip.textContent = days[0].date + ' — ' + days[days.length - 1].date;
      var bounds = cell.getBoundingClientRect(); tip.style.left = Math.max(110, Math.min(innerWidth - 110, bounds.left + bounds.width / 2)) + 'px'; tip.style.top = Math.max(40, bounds.top - 7) + 'px'; tip.classList.add('is-visible');
    });
    heatmap.addEventListener('pointerout', function () { tip.classList.remove('is-visible'); });
  }

  var brand = document.querySelector('.site-header .brand'), clicks = 0, navigationTimer, doorTimer, thanks;
  if (brand) {
    thanks = el('span', 'door-thanks'); thanks.setAttribute('role', 'status'); thanks.setAttribute('aria-live', 'polite'); brand.append(thanks);
    brand.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.detail === 0) return;
      event.preventDefault(); clearTimeout(navigationTimer); clicks++;
      if (clicks >= 3) { clicks = 0; clearTimeout(doorTimer); brand.classList.remove('door-finished'); brand.classList.add('is-door-open'); thanks.textContent = '今天也谢谢你来'; doorTimer = window.setTimeout(function () { brand.classList.remove('is-door-open'); if (brand.matches(':hover')) brand.classList.add('door-finished'); thanks.textContent = ''; }, 3000); }
      else navigationTimer = window.setTimeout(function () { clicks = 0; location.assign(brand.href); }, 300);
    });
    brand.addEventListener('pointerleave', function () { brand.classList.remove('door-finished'); });
  }
  window.addEventListener('pagehide', function () { clearTimeout(navigationTimer); clearTimeout(doorTimer); clearTimeout(toastTimer); clearTimeout(clearTimer); cancelAnimationFrame(scrollFrame); scrollFrame = 0; cancelAnimationFrame(frame); clicks = 0; if (brand) brand.classList.remove('is-door-open', 'door-finished'); if (thanks) thanks.textContent = ''; if (tip) tip.classList.remove('is-visible'); toast.classList.remove('is-visible'); toast.textContent = ''; });
  window.SITE_DETAILS = { version: '1.2.0' };
})();
