(function () {
  'use strict';
  var names = { seed: '种子', growing: '生长中', evergreen: '常青' };
  function maturity(article) { return article && Object.prototype.hasOwnProperty.call(names, article.maturity) ? article.maturity : 'seed'; }
  function cover(article) { var node = document.createElement('span'), tones = { '建站手记': 'clay', '开发记录': 'moss', '小站计划': 'amber' }; node.className = 'article-cover'; node.setAttribute('aria-hidden', 'true'); node.textContent = Array.from(String(article.title || '').trim())[0] || '记'; var tag = (article.tags || []).find(function (tag) { return tones[tag]; }) || article.category; node.dataset.coverTone = tones[tag] || 'amber'; return node; }
  function badge(article) {
    var value = maturity(article), node = document.createElement('span');
    node.className = 'garden-maturity'; node.dataset.maturity = value;
    if (value === 'seed') { var dot = document.createElement('i'); dot.setAttribute('aria-hidden', 'true'); node.append(dot); }
    else {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 20 20'); svg.setAttribute('aria-hidden', 'true');
      var path = document.createElementNS(svg.namespaceURI, 'path');
      path.setAttribute('d', value === 'growing' ? 'M10 17V9m0 4C4 13 3 8 3 6c5 0 7 2 7 5m0-2c0-4 3-6 7-6 0 4-2 7-7 7' : 'M4 16 14 6M4 12C3 5 9 2 17 3c0 8-3 13-10 12');
      svg.append(path); node.append(svg);
    }
    node.append(document.createTextNode(names[value])); return node;
  }
  function validDate(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value; }
  function tended(article) { return validDate(article.tended) && validDate(article.date) && article.tended > article.date ? article.tended : ''; }
  function mentioned(article, articles) {
    var ids = Array.isArray(article.links) ? article.links : [];
    return ids.filter(function (id, i) { return typeof id === 'string' && id !== article.id && ids.indexOf(id) === i; }).map(function (id) { return articles.find(function (entry) { return entry.id === id; }); }).filter(Boolean);
  }
  function backlinks(article, articles) { return articles.filter(function (entry) { return entry.id !== article.id && Array.isArray(entry.links) && entry.links.indexOf(article.id) !== -1; }); }
  function clusters(articles) {
    var groups = new Map();
    articles.forEach(function (article) { (Array.isArray(article.tags) ? article.tags : []).forEach(function (tag, index, tags) {
      if (typeof tag !== 'string' || !tag.trim() || tags.indexOf(tag) !== index) return;
      if (!groups.has(tag)) groups.set(tag, []); groups.get(tag).push(article);
    }); });
    return Array.from(groups, function (pair) { return { tag: pair[0], articles: pair[1], counts: pair[1].reduce(function (sum, a) { sum[maturity(a)]++; return sum; }, { seed: 0, growing: 0, evergreen: 0 }) }; }).sort(function (a, b) { return b.articles.length - a.articles.length || a.tag.localeCompare(b.tag, 'zh-CN'); });
  }
  function reviewedSvg(graph, context) {
    if (typeof graph.svg !== 'string') return null;
    var parsed = new DOMParser().parseFromString(graph.svg, 'image/svg+xml'), root = parsed.documentElement;
    var tags = ['svg', 'title', 'desc', 'style', 'g', 'ellipse', 'path', 'circle', 'rect', 'text', 'a'];
    if (root.localName !== 'svg' || parsed.querySelector('parsererror') || Array.from(root.querySelectorAll('*')).some(function (node) { return tags.indexOf(node.localName) === -1 || Array.from(node.attributes).some(function (a) { return /^on/i.test(a.name); }); })) return null;
    if (Array.from(root.querySelectorAll('style')).some(function (style) { return /@import|url\s*\(/i.test(style.textContent); })) return null;
    var links = Array.from(root.querySelectorAll('.garden-graph-node'));
    if (links.length !== graph.nodes.length || root.querySelectorAll('.garden-graph-edge').length !== graph.edges.length || !links.every(function (link) { return graph.nodes.some(function (n) { return n.id === link.dataset.articleId && link.getAttribute('aria-label') === n.title; }); })) return null;
    links.forEach(function (link) { link.setAttribute('href', window.SITE_NAV.detailHref('articles', link.dataset.articleId, context)); });
    return document.importNode(root, true);
  }
  function renderGraph(target, articles, context) {
    if (!target) return;
    target.hidden = true;
    var graph = window.SITE_GARDEN_GRAPH || {};
    if (!graph.eligible || !validDate(graph.reviewedAt) || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return;
    var edges = articles.flatMap(function (a) { return mentioned(a, articles).map(function (b) { return a.id + '\u0000' + b.id; }); }).sort();
    if (JSON.stringify(edges) !== JSON.stringify(graph.edges.map(function (e) { return e.from + '\u0000' + e.to; }).sort()) || graph.nodes.length !== articles.length) return;
    if (!graph.nodes.every(function (n) { var a = articles.find(function (a) { return a.id === n.id; }); return a && a.title === n.title && maturity(a) === n.maturity && [n.x, n.y, n.r].every(Number.isFinite) && (graph.version >= 2 ? n.r >= 10 && n.r <= 13 && typeof n.label === 'string' : n.r >= 14 && n.r <= 30); })) return;
    if (new Set(graph.edges.flatMap(function (e) { return [e.from, e.to]; })).size < 3) return;
    var stage = target.querySelector('.garden-graph-stage'), list = target.querySelector('ul'); stage.replaceChildren(); list.replaceChildren();
    var ns = 'http://www.w3.org/2000/svg', svg = graph.version >= 2 ? reviewedSvg(graph, context) : null;
    if (graph.version >= 2 && !svg) return;
    if (!svg) {
    svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 900 ' + Math.max(170, graph.height || 170)); svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', '文章引用关系图，可使用 Tab 逐个访问文章');
    graph.edges.forEach(function (e) { var from = graph.nodes.find(function (n) { return n.id === e.from; }), to = graph.nodes.find(function (n) { return n.id === e.to; }); if (!from || !to) return;
      var line = document.createElementNS(ns, 'line'); line.setAttribute('class', 'garden-graph-edge'); line.dataset.from = e.from; line.dataset.to = e.to; ['x1', 'y1', 'x2', 'y2'].forEach(function (key, i) { line.setAttribute(key, String([from.x, from.y, to.x, to.y][i])); }); svg.append(line);
    });
    graph.nodes.forEach(function (n) {
      var href = window.SITE_NAV.detailHref('articles', n.id, context), link = document.createElementNS(ns, 'a'); link.setAttribute('href', href); link.setAttribute('tabindex', '0'); link.setAttribute('class', 'garden-graph-node'); link.dataset.articleId = n.id;
      var title = document.createElementNS(ns, 'title'); title.textContent = n.title;
      var hit = document.createElementNS(ns, 'rect'); hit.setAttribute('class', 'garden-hit'); hit.setAttribute('x', n.x - 105); hit.setAttribute('y', n.y - 35); hit.setAttribute('width', '210'); hit.setAttribute('height', '96'); hit.setAttribute('rx', '6');
      var circle = document.createElementNS(ns, 'circle'); circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y); circle.setAttribute('r', n.r); circle.setAttribute('fill', { seed: '#e0bd76', growing: '#c38c2c', evergreen: '#8e600e' }[n.maturity]);
      var text = document.createElementNS(ns, 'text'); text.setAttribute('x', n.x); text.setAttribute('y', n.y + 47); text.setAttribute('text-anchor', 'middle'); text.textContent = Array.from(n.title).slice(0, 13).join('') + (Array.from(n.title).length > 13 ? '…' : '');
      link.append(title, hit, circle, text); svg.append(link);
      var li = document.createElement('li'), a = document.createElement('a'); a.href = href; a.textContent = n.title; li.append(a); list.append(li);
    });
    } else graph.nodes.forEach(function (n) { var li = document.createElement('li'), a = document.createElement('a'); a.href = window.SITE_NAV.detailHref('articles', n.id, context); a.textContent = n.title; li.append(a); list.append(li); });
    var hovered = '', focused = '';
    function highlight() { var id = focused || hovered, related = new Set([id]); graph.edges.forEach(function (edge) { if (edge.from === id || edge.to === id) { related.add(edge.from); related.add(edge.to); } }); svg.classList.toggle('has-path-focus', Boolean(id)); svg.querySelectorAll('.garden-graph-node').forEach(function (node) { node.classList.toggle('is-related', related.has(node.dataset.articleId)); }); svg.querySelectorAll('.garden-graph-edge').forEach(function (edge) { edge.classList.toggle('is-connected', edge.dataset.from === id || edge.dataset.to === id); }); }
    svg.addEventListener('pointerover', function (event) { var node = event.target.closest('.garden-graph-node'); hovered = node ? node.dataset.articleId : ''; highlight(); });
    svg.addEventListener('pointerleave', function () { hovered = ''; highlight(); });
    svg.addEventListener('focusin', function (event) { var node = event.target.closest('.garden-graph-node'); focused = node ? node.dataset.articleId : ''; highlight(); });
    svg.addEventListener('focusout', function (event) { var node = event.relatedTarget && event.relatedTarget.closest && event.relatedTarget.closest('.garden-graph-node'); focused = node && svg.contains(node) ? node.dataset.articleId : ''; highlight(); });
    stage.append(svg); target.hidden = false;
  }
  window.SITE_GARDEN = { maturity: maturity, cover: cover, badge: badge, tended: tended, mentioned: mentioned, backlinks: backlinks, clusters: clusters, renderGraph: renderGraph };

  var timeline = document.getElementById('about-timeline'), entries = Array.isArray(window.SITE_TIMELINE) ? window.SITE_TIMELINE : [];
  if (timeline && entries.length) {
    timeline.hidden = false; var list = timeline.querySelector('ol');
    entries.filter(function (entry) { return validDate(entry.date) && typeof entry.title === 'string' && typeof entry.note === 'string'; }).forEach(function (entry) {
      var item = document.createElement('li'), time = document.createElement('time'), copy = document.createElement('div'), title = document.createElement('h3'), note = document.createElement('p');
      time.dateTime = entry.date; time.textContent = entry.date; title.textContent = entry.title; note.textContent = entry.note;
      copy.append(title, note); item.append(time, copy); list.append(item);
    });
    if (!list.children.length) timeline.hidden = true;
    else {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)'), queued = false;
      function update() { queued = false; if (reduce.matches) { timeline.style.setProperty('--timeline-progress', '1'); return; }
        var rect = list.getBoundingClientRect(); timeline.style.setProperty('--timeline-progress', String(Math.max(0, Math.min(1, (innerHeight * .82 - rect.top) / Math.max(1, rect.height)))));
      }
      function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
      function attach() { if (!reduce.matches) { window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule); } update(); }
      function detach() { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); }
      reduce.addEventListener('change', function () { detach(); attach(); }); window.addEventListener('pagehide', detach); window.addEventListener('pageshow', function () { detach(); attach(); }); attach();
    }
  }
})();
