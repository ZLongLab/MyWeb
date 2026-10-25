(function () {
  'use strict';

  var navigation = document.getElementById('site-nav');
  if (!navigation || document.getElementById('site-search-dialog')) return;

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function normalize(value) {
    var text = String(value || '');
    if (typeof text.normalize === 'function') text = text.normalize('NFKC');
    return text.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  }

  // 数据来自本站的文章与作品文件；只提取文字，不执行内容。
  function contentText(value, depth) {
    if (depth > 8 || value == null) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      return value.map(function (item) { return contentText(item, depth + 1); }).join(' ');
    }
    if (typeof value === 'object') {
      return Object.keys(value).map(function (key) {
        return contentText(value[key], depth + 1);
      }).join(' ');
    }
    return '';
  }

  var config = window.SITE_DATA || {};
  var entries = [
    { type: '页面', title: '首页', summary: '从这里认识小站，看看最近的作品与记录。', href: 'index.html', body: [config.siteTitle, config.bio, '个人网站 首页 有间小站 把想法慢慢做成作品'].join(' ') },
    { type: '页面', title: '作品集', summary: '浏览作品，按类别筛选，了解每个项目。', href: 'projects.html', body: '全部作品 作品集 项目 收藏 创作 开发 网站' },
    { type: '页面', title: '文章与笔记', summary: '阅读建站手记、开发记录与随手记下的想法。', href: 'articles.html', body: '文章 博客 笔记 写作 阅读 内容 记录 分类' },
    { type: '页面', title: '关于我', summary: '认识小站的主人，了解这里的起点与联系方式。', href: 'about.html', body: [config.name, config.bio, '关于我 自我介绍 联系 邮箱 联系方式 打个招呼'].join(' ') },
    { type: '页面', title: '随手便签（本地）', summary: '在当前浏览器保存一句话；不发送给站主。', href: 'guestbook.html', body: '留言 留言板 本地留言本 本地便签 随手便签 浏览器 保存 记录' }
  ];

  var articles = window.SITE_CONTENT.sortArticles(window.SITE_ARTICLES);
  articles.forEach(function (article) {
    if (!article || !article.id || !article.title) return;
    entries.push({
      type: '文章', title: String(article.title), summary: String(article.summary || ''),
      href: window.SITE_NAV.detailHref('articles', article.id),
      body: contentText(article.sections, 0),
      category: String(article.category || ''), tags: contentText(article.tags, 0)
    });
  });

  var projects = Array.isArray(window.SITE_PROJECTS) ? window.SITE_PROJECTS : [];
  projects.forEach(function (project) {
    if (!project || !project.id || !project.title) return;
    entries.push({
      type: '作品', title: String(project.title), summary: String(project.summary || ''),
      href: window.SITE_NAV.detailHref('projects', project.id),
      body: contentText([project.detail, project.sections], 0),
      category: String(project.category || ''), tags: contentText(project.tags, 0)
    });
  });

  entries.forEach(function (entry) {
    entry.normalizedTitle = normalize(entry.title);
    entry.normalizedSummary = normalize(entry.summary);
    entry.normalizedCategory = normalize(entry.category);
    entry.normalizedTags = normalize(entry.tags);
    entry.normalizedAll = normalize([entry.title, entry.summary, entry.category, entry.tags, entry.body].join(' '));
  });

  var searchButton = element('button', 'nav-search');
  searchButton.type = 'button';
  searchButton.setAttribute('aria-haspopup', 'dialog');
  searchButton.setAttribute('aria-controls', 'site-search-dialog');
  var searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchIcon.setAttribute('viewBox', '0 0 24 24');
  searchIcon.setAttribute('width', '16');
  searchIcon.setAttribute('height', '16');
  searchIcon.setAttribute('fill', 'none');
  searchIcon.setAttribute('stroke', 'currentColor');
  searchIcon.setAttribute('stroke-width', '1.7');
  searchIcon.setAttribute('aria-hidden', 'true');
  var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '10.5');
  circle.setAttribute('cy', '10.5');
  circle.setAttribute('r', '6.5');
  var line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  line.setAttribute('d', 'M15.5 15.5 21 21');
  line.setAttribute('stroke-linecap', 'round');
  searchIcon.appendChild(circle);
  searchIcon.appendChild(line);
  searchButton.appendChild(searchIcon);
  searchButton.appendChild(element('span', '', '搜索'));
  var shortcut = element('span', 'nav-search-shortcut', 'Ctrl K');
  shortcut.setAttribute('aria-hidden', 'true');
  searchButton.appendChild(shortcut);
  searchButton.setAttribute('aria-keyshortcuts', 'Control+k Meta+k');
  navigation.insertBefore(searchButton, navigation.querySelector('.nav-contact'));

  var dialog = element('dialog', 'site-search-dialog');
  dialog.id = 'site-search-dialog';
  dialog.setAttribute('aria-labelledby', 'site-search-title');
  dialog.setAttribute('aria-describedby', 'site-search-description');
  var dialogHeader = element('div', 'site-search-header');
  var headingGroup = element('div');
  var heading = element('h2', '', '在小站里找一找');
  heading.id = 'site-search-title';
  var description = element('p', '', '文章、作品和页面，一起找。');
  description.id = 'site-search-description';
  headingGroup.appendChild(heading);
  headingGroup.appendChild(description);
  var closeButton = element('button', 'site-search-close', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', '关闭全站搜索');
  dialogHeader.appendChild(headingGroup);
  dialogHeader.appendChild(closeButton);
  dialog.appendChild(dialogHeader);

  var searchLabel = element('label', 'site-search-field');
  searchLabel.appendChild(searchIcon.cloneNode(true));
  var input = element('input');
  input.type = 'search';
  input.maxLength = 100;
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.placeholder = '试试“作品”“建站”或“笔记”';
  input.setAttribute('aria-label', '全站搜索');
  input.setAttribute('aria-controls', 'site-search-results');
  searchLabel.appendChild(input);
  dialog.appendChild(searchLabel);

  var status = element('p', 'site-search-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  dialog.appendChild(status);
  var results = element('div', 'site-search-results');
  results.id = 'site-search-results';
  dialog.appendChild(results);
  var footer = element('div', 'site-search-footer');
  footer.appendChild(element('span', '', '用方向键和 Tab 浏览，回车打开'));
  footer.appendChild(element('span', '', 'Esc 关闭'));
  dialog.appendChild(footer);
  document.body.appendChild(dialog);

  function shorten(value, limit) {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }

  function clearResults() {
    while (results.firstChild) results.removeChild(results.firstChild);
  }

  function renderRecommendations() {
    results.appendChild(element('p', 'site-search-guide', '从一个关键词开始，或先去这些地方看看。'));
    var recommended = element('div', 'site-search-recommendations');
    entries.slice(0, 5).forEach(function (entry) {
      var link = element('a', '', entry.title + ' →');
      link.href = entry.href;
      recommended.appendChild(link);
    });
    results.appendChild(recommended);
  }

  function renderResults() {
    clearResults();
    var query = normalize(input.value);
    if (!query) {
      status.textContent = '输入关键词，搜索文章、作品和页面。';
      renderRecommendations();
      return;
    }
    var tokens = query.split(' ');
    var matched = entries.filter(function (entry) {
      return tokens.every(function (token) { return entry.normalizedAll.indexOf(token) !== -1; });
    }).map(function (entry) {
      var score = tokens.reduce(function (total, token) {
        return total + (entry.normalizedTitle.indexOf(token) !== -1 ? 12 : 0) +
          (entry.normalizedTags.indexOf(token) !== -1 ? 6 : 0) +
          (entry.normalizedCategory.indexOf(token) !== -1 ? 5 : 0) +
          (entry.normalizedSummary.indexOf(token) !== -1 ? 4 : 0);
      }, 0);
      return { entry: entry, score: score };
    }).sort(function (a, b) { return b.score - a.score; });

    if (!matched.length) {
      status.textContent = '没有找到相关内容。';
      var empty = element('div', 'site-search-empty');
      empty.appendChild(element('span', 'site-search-empty-mark', '…'));
      empty.appendChild(element('h3', '', '换一个词，再找找看。'));
      empty.appendChild(element('p', '', '可以缩短关键词，或试试“个人网站”“文章”“留言”。'));
      results.appendChild(empty);
      return;
    }

    status.textContent = '找到 ' + matched.length + ' 条相关内容' +
      (matched.length > 12 ? '，显示前 12 条。' : '。');
    var list = element('ul', 'site-search-list');
    matched.slice(0, 12).forEach(function (match) {
      var entry = match.entry;
      var item = element('li');
      var link = element('a', 'site-search-result');
      link.href = entry.href;
      var meta = element('span', 'site-search-meta', entry.type + (entry.category ? ' / ' + entry.category : ''));
      var title = element('span', 'site-search-result-title', entry.title);
      var excerpt = entry.summary || entry.body || '';
      // 全文命中时优先显示附近文字，便于理解这条结果为何出现。
      if (tokens.some(function (token) { return normalize(excerpt).indexOf(token) !== -1; }) === false && entry.body) {
        var body = entry.body.replace(/\s+/g, ' ');
        var firstHit = normalize(body).indexOf(tokens[0]);
        excerpt = (firstHit > 24 ? '…' : '') + body.slice(Math.max(0, firstHit - 24));
      }
      link.appendChild(meta);
      link.appendChild(title);
      link.appendChild(element('span', 'site-search-excerpt', shorten(excerpt, 108)));
      item.appendChild(link);
      list.appendChild(item);
    });
    results.appendChild(list);
  }

  var menuButton = document.querySelector('[data-menu-toggle]');
  function closeMenu() {
    navigation.classList.remove('is-open');
    if (!menuButton) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '打开导航菜单');
  }

  function openSearch() {
    if (dialog.open || typeof dialog.showModal !== 'function') return;
    if (document.querySelector('dialog[open]')) return;
    closeMenu();
    dialog.showModal();
    input.focus();
    input.select();
  }

  searchButton.addEventListener('click', openSearch);
  closeButton.addEventListener('click', function () { dialog.close(); });
  input.addEventListener('input', function () {
    try { sessionStorage.setItem('myweb_search_query_v1', input.value.slice(0, 100)); } catch (error) { /* Keep in-page search usable when session storage is unavailable. */ }
    renderResults();
  });

  // 保留原生 Tab 顺序，同时允许用上下键在结果之间移动。
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    var links = Array.prototype.slice.call(results.querySelectorAll('a'));
    if (!links.length) return;
    var index = links.indexOf(document.activeElement);
    if (document.activeElement !== input && index < 0) return;
    event.preventDefault();
    if (index < 0) index = event.key === 'ArrowDown' ? 0 : links.length - 1;
    else index = (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links[index].focus();
  });

  results.addEventListener('click', function (event) {
    if (!event.target.closest('a')) return;
    closeMenu();
    dialog.close();
  });

  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });

  dialog.addEventListener('close', function () {
    var buttonVisible = searchButton.getClientRects().length > 0;
    if (buttonVisible) searchButton.focus();
    else if (menuButton && menuButton.getClientRects().length > 0) menuButton.focus();
  });

  document.addEventListener('keydown', function (event) {
    if (event.defaultPrevented || event.altKey || (!event.ctrlKey && !event.metaKey) || event.key.toLowerCase() !== 'k') return;
    if (document.querySelector('dialog[open]') && !dialog.open) return;
    event.preventDefault();
    if (dialog.open) { input.focus(); input.select(); }
    else openSearch();
  });
  try { input.value = (sessionStorage.getItem('myweb_search_query_v1') || '').slice(0, 100); } catch (error) { /* Optional per-tab continuity. */ }
  renderResults();
})();
