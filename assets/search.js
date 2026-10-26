(function () {
  'use strict';
  var navigation = document.getElementById('site-nav');
  if (!navigation || document.getElementById('site-search-dialog')) return;
  var QUERY_KEY = 'myweb_search_query_v1';
  var RECENT_KEY = 'myweb_recent_commands_v1';
  var GROUPS = ['命令', '作品', '文章', '页面'];
  var MAX_RESULTS = 18;
  var entries = [];
  var entriesById = Object.create(null);
  var recentIds = readRecent();
  var searchTokens = [];
  var config = window.SITE_DATA || {};

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
  // Index text only: content and search input are never interpreted as HTML.
  function contentText(value, depth) {
    if (depth > 8 || value == null) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(function (item) { return contentText(item, depth + 1); }).join(' ');
    if (typeof value === 'object') return Object.keys(value).map(function (key) { return contentText(value[key], depth + 1); }).join(' ');
    return '';
  }
  function readRecent() {
    try {
      var value = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      if (!Array.isArray(value)) return [];
      return value.filter(function (id, index) { return typeof id === 'string' && id.length <= 160 && value.indexOf(id) === index; }).slice(0, 5);
    } catch (error) { return []; }
  }
  function remember(entry) {
    recentIds = [entry.id].concat(recentIds.filter(function (id) { return id !== entry.id; })).slice(0, 5);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds)); } catch (error) { /* Current-page continuity remains available. */ }
  }
  function localHref(value) {
    if (typeof value !== 'string' || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return '';
    try {
      var url = new URL(value, location.href);
      return url.origin === location.origin && /\.html$/i.test(url.pathname) ? value : '';
    } catch (error) { return ''; }
  }
  function addEntry(entry) {
    if (!entry.id || entriesById[entry.id] || (entry.href && !entry.external && !localHref(entry.href))) return;
    entry.normalizedTitle = normalize(entry.title);
    entry.normalizedSummary = normalize(entry.summary);
    entry.normalizedCategory = normalize(entry.category);
    entry.normalizedTags = normalize(entry.tags);
    entry.normalizedAll = normalize([entry.title, entry.summary, entry.category, entry.tags, entry.body].join(' '));
    entries.push(entry);
    entriesById[entry.id] = entry;
  }
  // A search opened from a filtered list keeps that list's category/query.
  function detailHref(section, id) {
    var page = location.pathname.split('/').pop();
    var params = new URLSearchParams(location.search);
    var context = page === section + '.html' ? { category: params.get('category'), q: params.get('q'), tag: params.get('tag'), view: params.get('view') } : {};
    if (window.SITE_NAV && typeof window.SITE_NAV.detailHref === 'function') return window.SITE_NAV.detailHref(section, id, context);
    return (section === 'projects' ? 'project.html' : 'article.html') + '?id=' + encodeURIComponent(id);
  }

  var fallbackRooms = [
    { id: 'home', name: '玄关', title: '首页', description: '最近的作品与记录，从这里开始认识小站。', href: 'index.html' },
    { id: 'projects', name: '客厅', title: '作品集', description: '做过的工具、项目与实现过程。', href: 'projects.html' },
    { id: 'articles', name: '书房', title: '文章与笔记', description: '建站手记、开发记录与随手记下的想法。', href: 'articles.html' },
    { id: 'now', name: '门牌', title: '现在在做什么', description: '最近的近况、维护中的项目与下一步计划。', href: 'now.html' },
    { id: 'workbench', name: '工作台', title: '项目进展', description: '项目、技术和维护清单。', href: 'workbench.html' },
    { id: 'uses', name: '工具墙', title: '正在使用的工具', description: '开发、写作与日常使用的工具。', href: 'uses.html' },
    { id: 'life', name: '院子', title: '生活与灵感', description: '代码以外的生活、灵感与片段。', href: 'life.html' },
    { id: 'links', name: '邻居', title: '喜欢的网站', description: '值得再去看看的个人网站与网络邻居。', href: 'links.html' },
    { id: 'guestbook', name: '留言墙', title: '本地灵感箱', description: '只保存在自己浏览器的随手便签。', href: 'guestbook.html' },
    { id: 'colophon', name: '说明书', title: '关于本站', description: '网站的结构、配色、本地数据与制作方式。', href: 'colophon.html' }
  ];
  var rooms = window.SITE_HOUSE && Array.isArray(window.SITE_HOUSE.rooms) ? window.SITE_HOUSE.rooms : fallbackRooms;
  rooms.forEach(function (room) {
    if (!room || !room.id || !localHref(room.href)) return;
    var name = String(room.name || room.title || room.id);
    var title = String(room.title || name);
    var summary = String(room.description || '打开小站里的这个房间。');
    addEntry({ id: 'page:' + room.id, type: '页面', title: name === title ? title : name + ' · ' + title, summary: summary, href: room.href, body: '房间 导航 ' + name + ' ' + title });
    addEntry({ id: 'command:room:' + room.id, type: '命令', title: '前往「' + name + '」', summary: title + ' · ' + summary, href: room.href, body: '去 打开 跳转 房间 导航 ' + room.id });
  });
  [
    { id: 'page:about', title: '关于 ZL', summary: '认识小站的主人，了解这里的起点与联系方式。', href: 'about.html', body: [config.name, config.bio, '关于 自我介绍 联系 邮箱 联系方式'].join(' ') },
    { id: 'page:guestbook', title: '随手便签（本地）', summary: '只在当前浏览器保存的随手笔记与灵感草稿。', href: 'guestbook.html', body: '留言 留言板 本地便签 草稿箱 浏览器 保存 记录' },
    { id: 'page:workbench', title: '工作台', summary: '项目近况、技术用途与小站更新。', href: 'workbench.html', body: '工作台 维护 开发 项目 技术' }
  ].forEach(function (page) { page.type = '页面'; addEntry(page); });
  var workbench = window.SITE_WORKBENCH || {};
  [
    { id: 'page:workbench:now', title: '工作台 · 现在在做什么', summary: '带核对日期的项目近况，连接作品与开发记录。', href: 'workbench.html#now', body: '近况 最近 现在 正在维护 ' + contentText(workbench.focus, 0) },
    { id: 'page:workbench:tools', title: '工作台 · 项目里的技术', summary: '已在项目里使用的技术，以及它们负责的事情。', href: 'workbench.html#tools', body: '工具 技术栈 用途 工作台 ' + contentText(workbench.tools, 0) },
    { id: 'page:workbench:updates', title: '工作台 · 小站更新', summary: '按日期查看这个网站的更新记录。', href: 'workbench.html#updates', body: '更新日志 版本历史 工作台 ' + contentText(workbench.updates, 0) },
    { id: 'page:workbench:colophon', title: '工作台 · 本站说明', summary: '页面结构、字体配色、本地数据和网站状态。', href: 'workbench.html#colophon', body: '本站说明 配置 字体 配色 HTML CSS JavaScript 暖纸 四季 本地 隐私 版本 公开仓库 JSON 浏览器 不上传' }
  ].forEach(function (page) { page.type = '页面'; addEntry(page); });
  var articles = Array.isArray(window.SITE_ARTICLES) ? window.SITE_ARTICLES.slice() : [];
  if (window.SITE_CONTENT && typeof window.SITE_CONTENT.sortArticles === 'function') articles = window.SITE_CONTENT.sortArticles(articles);
  else articles.sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
  articles.forEach(function (article) {
    if (!article || !article.id || !article.title) return;
    addEntry({ id: 'article:' + article.id, type: '文章', title: String(article.title), summary: String(article.summary || ''), href: detailHref('articles', article.id), body: contentText(article.sections, 0), category: String(article.category || ''), tags: contentText(article.tags, 0), maturity: article.maturity });
  });
  (Array.isArray(window.SITE_PROJECTS) ? window.SITE_PROJECTS : []).forEach(function (project) {
    if (!project || !project.id || !project.title) return;
    addEntry({ id: 'project:' + project.id, type: '作品', title: String(project.title), summary: String(project.summary || ''), href: detailHref('projects', project.id), body: contentText([project.detail, project.sections], 0), category: String(project.category || ''), tags: contentText(project.tags, 0) });
  });
  addEntry({ id: 'command:theme', type: '命令', title: '切换纸色 / 夜色', summary: '在暖纸与夜色之间切换，记住你的选择。', body: '主题 浅色 深色 明亮 黑暗 白天 晚上 theme dark light', action: function () {
    if (!window.SITE_THEME || typeof window.SITE_THEME.toggleTheme !== 'function') return showFeedback('主题功能尚未就绪，请稍后再试。', true);
    window.SITE_THEME.toggleTheme();
    return showFeedback(document.documentElement.getAttribute('data-theme') === 'night' ? '已切换为夜色。' : '已切换为纸色。');
  } });
  var seasons = { auto: '跟随当下季节', spring: '切换到春日配色', summer: '切换到夏日配色', autumn: '切换到秋日配色', winter: '切换到冬日配色' };
  Object.keys(seasons).forEach(function (season) {
    addEntry({ id: 'command:season:' + season, type: '命令', title: seasons[season], summary: season === 'auto' ? '让四季色彩随本地月份变化。' : '保留明暗模式，只调整四季色彩。', body: '四季 季节 颜色 配色 season ' + season, action: function () {
      if (!window.SITE_THEME || typeof window.SITE_THEME.setSeason !== 'function') return showFeedback('四季配色尚未就绪，请稍后再试。', true);
      window.SITE_THEME.setSeason(season);
      return showFeedback(season === 'auto' ? '已设置为跟随当下季节。' : '已' + seasons[season].replace('切换到', '切换为') + '。');
    } });
  });
  addEntry({ id: 'command:github', type: '命令', title: '打开 GitHub', summary: '在新标签页访问 ZLongLab 的 GitHub 主页。', href: 'https://github.com/ZLongLab', external: true, body: '代码 源码 开源 账号 仓库 github ZLongLab' });
  addEntry({ id: 'command:top', type: '命令', title: '回到页面顶部', summary: '返回当前页面的开头。', body: '向上 顶部 回顶 top scroll', action: function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' });
    return showFeedback('正在返回页面顶部。');
  } });
  var email = typeof config.email === 'string' ? config.email.trim() : '';
  if (email.length <= 254 && /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email)) {
    addEntry({ id: 'command:email', type: '命令', title: '复制联系邮箱', summary: email, body: '邮箱 邮件 联系 email mail copy', action: function () {
      showFeedback('正在复制邮箱…');
      return copyText(email).then(function (copied) { return copied ? showFeedback('邮箱已复制：' + email) : showFeedback('复制未完成，可以手动复制：' + email, true); });
    } });
  }

  var searchButton = element('button', 'nav-search');
  searchButton.type = 'button';
  searchButton.setAttribute('aria-haspopup', 'dialog');
  searchButton.setAttribute('aria-controls', 'site-search-dialog');
  searchButton.setAttribute('aria-label', '搜索与命令面板');
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
  var heading = element('h2', '', '小站里的快捷入口');
  heading.id = 'site-search-title';
  var description = element('p', '', '找作品、读文章、逛房间，也可以执行一个小动作。');
  description.id = 'site-search-description';
  headingGroup.appendChild(heading);
  headingGroup.appendChild(description);
  var closeButton = element('button', 'site-search-close', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', '关闭搜索与命令面板');
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
  input.placeholder = '搜索作品、文章，或试试“主题”“四季”';
  input.setAttribute('aria-label', '搜索作品、文章、页面与命令');
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
  footer.appendChild(element('span', '', '↑ ↓ 选择 · Enter 打开或执行'));
  footer.appendChild(element('span', '', 'Esc 关闭'));
  dialog.appendChild(footer);
  document.body.appendChild(dialog);

  function showFeedback(message, error) {
    status.textContent = message;
    status.classList.toggle('is-feedback', !error);
    status.classList.toggle('is-error', Boolean(error));
    return !error;
  }
  function copyText(text) {
    function fallback() {
      var field = element('textarea', 'site-search-copy-field');
      field.value = text;
      field.setAttribute('readonly', '');
      field.setAttribute('aria-label', '待复制的联系邮箱');
      dialog.appendChild(field);
      var previous = document.activeElement;
      field.select();
      var copied = false;
      try { copied = document.execCommand('copy'); } catch (error) { /* Never claim success when copying is unavailable. */ }
      field.remove();
      if (previous && previous.isConnected) previous.focus();
      return copied;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') return navigator.clipboard.writeText(text).then(function () { return true; }, fallback);
    } catch (error) { /* Try the local fallback in older or restricted browsers. */ }
    return Promise.resolve(fallback());
  }
  function shorten(value, limit) { return value.length > limit ? value.slice(0, limit) + '…' : value; }
  function makeResult(entry, compact) {
    var row = element(entry.href ? 'a' : 'button', 'site-search-result' + (compact ? ' is-compact' : ''));
    row.setAttribute('data-search-entry', entry.id);
    if (entry.href) { row.href = entry.href; if (entry.external) { row.target = '_blank'; row.rel = 'noopener noreferrer'; } }
    else row.type = 'button';
    var text = element('span', 'site-search-result-copy');
    if (!compact) text.appendChild(element('span', 'site-search-meta', entry.type + (entry.category ? ' / ' + entry.category : '')));
    text.appendChild(element('span', 'site-search-result-title', entry.title));
    if (entry.type === '文章' && window.SITE_GARDEN) text.appendChild(window.SITE_GARDEN.badge(entry));
    var excerpt = entry.summary || entry.body || '';
    if (searchTokens.length && !searchTokens.some(function (token) { return normalize(excerpt).indexOf(token) !== -1; }) && entry.body) {
      var body = entry.body.replace(/\s+/g, ' ');
      var firstHit = normalize(body).indexOf(searchTokens[0]);
      excerpt = (firstHit > 24 ? '…' : '') + body.slice(Math.max(0, firstHit - 24));
    }
    if (excerpt) text.appendChild(element('span', 'site-search-excerpt', shorten(excerpt, compact ? 72 : 108)));
    row.appendChild(text);
    var marker = element('span', 'site-search-result-marker', entry.external ? '↗' : entry.href ? '→' : '↵');
    marker.setAttribute('aria-hidden', 'true');
    row.appendChild(marker);
    return row;
  }
  function renderGroup(title, groupEntries, compact) {
    if (!groupEntries.length) return;
    var section = element('section', 'site-search-group');
    section.appendChild(element('h3', 'site-search-group-title', title));
    var list = element('ul', 'site-search-list');
    groupEntries.forEach(function (entry) { var item = element('li'); item.appendChild(makeResult(entry, compact)); list.appendChild(item); });
    section.appendChild(list);
    results.appendChild(section);
  }
  function renderResults() {
    while (results.firstChild) results.removeChild(results.firstChild);
    status.classList.remove('is-feedback', 'is-error');
    var query = normalize(input.value);
    searchTokens = query ? query.split(' ') : [];
    if (!query) {
      renderGroup('最近使用', recentIds.map(function (id) { return entriesById[id]; }).filter(Boolean), true);
      var commonIds = ['command:theme', 'command:room:now', 'command:github', 'command:top'];
      renderGroup('命令', commonIds.filter(function (id) { return recentIds.indexOf(id) === -1; }).map(function (id) { return entriesById[id]; }).filter(Boolean), true);
      status.textContent = '输入关键词查找；“四季”可以调整季节配色。最近使用只保存在当前浏览器。';
      return;
    }
    var matched = entries.filter(function (entry) { return searchTokens.every(function (token) { return entry.normalizedAll.indexOf(token) !== -1; }); }).map(function (entry, index) {
      var score = searchTokens.reduce(function (total, token) { return total + (entry.normalizedTitle.indexOf(token) !== -1 ? 12 : 0) + (entry.normalizedTags.indexOf(token) !== -1 ? 6 : 0) + (entry.normalizedCategory.indexOf(token) !== -1 ? 5 : 0) + (entry.normalizedSummary.indexOf(token) !== -1 ? 4 : 0); }, 0);
      return { entry: entry, score: score, index: index };
    }).sort(function (a, b) { return b.score - a.score || a.index - b.index; });
    if (!matched.length) {
      status.textContent = '没有找到相关内容。';
      var empty = element('div', 'site-search-empty');
      empty.appendChild(element('span', 'site-search-empty-mark', '…'));
      empty.appendChild(element('h3', '', '换一个词，再找找看。'));
      empty.appendChild(element('p', '', '试试“作品”“门牌”“工作台”或“主题”。'));
      results.appendChild(empty);
      return;
    }
    status.textContent = '找到 ' + matched.length + ' 条内容与命令' + (matched.length > MAX_RESULTS ? '，显示前 ' + MAX_RESULTS + ' 条。' : '。');
    var visible = matched.slice(0, MAX_RESULTS).map(function (match) { return match.entry; });
    GROUPS.forEach(function (group) { renderGroup(group, visible.filter(function (entry) { return entry.type === group; }), false); });
  }
  var menuButton = document.querySelector('[data-menu-toggle]');
  var returnFocus = null;
  function closeMenu() {
    navigation.classList.remove('is-open');
    if (menuButton) { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '打开导航菜单'); }
  }
  function openSearch() {
    if (dialog.open || typeof dialog.showModal !== 'function' || document.querySelector('dialog[open]')) return;
    returnFocus = document.activeElement;
    closeMenu();
    if (!input.value) renderResults();
    dialog.showModal();
    input.focus();
    input.select();
  }
  searchButton.addEventListener('click', openSearch);
  closeButton.addEventListener('click', function () { dialog.close(); });
  input.addEventListener('input', function () {
    try { sessionStorage.setItem(QUERY_KEY, input.value.slice(0, 100)); } catch (error) { /* Optional per-tab continuity. */ }
    renderResults();
  });
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dialog.close(); return; }
    var items = Array.prototype.slice.call(results.querySelectorAll('[data-search-entry]'));
    if (event.key === 'Enter' && document.activeElement === input && !event.isComposing && items.length) { event.preventDefault(); items[0].click(); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    var index = items.indexOf(document.activeElement);
    if (!items.length || (document.activeElement !== input && index < 0)) return;
    event.preventDefault();
    if (index < 0) index = event.key === 'ArrowDown' ? 0 : items.length - 1;
    else index = (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[index].focus();
  });
  results.addEventListener('click', function (event) {
    var row = event.target.closest('[data-search-entry]');
    if (!row || !results.contains(row)) return;
    var entry = entriesById[row.getAttribute('data-search-entry')];
    if (!entry) return;
    if (entry.href) {
      remember(entry);
      if (entry.external) showFeedback('GitHub 将在新标签页打开。');
      else { closeMenu(); dialog.close(); }
      return;
    }
    if (row.disabled) return;
    var restoreActionFocus = document.activeElement === row;
    row.disabled = true;
    Promise.resolve().then(entry.action).then(function (succeeded) { if (succeeded) remember(entry); }).catch(function () { showFeedback('这个动作暂时未完成，请稍后再试。', true); }).then(function () {
      row.disabled = false;
      if (restoreActionFocus && dialog.open && row.isConnected && (document.activeElement === document.body || document.activeElement === dialog)) row.focus();
    });
  });
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', function () {
    if (returnFocus && returnFocus !== document.body && returnFocus.isConnected && returnFocus.getClientRects().length) returnFocus.focus();
    else if (searchButton.getClientRects().length) searchButton.focus();
    else if (menuButton && menuButton.getClientRects().length) menuButton.focus();
  });
  document.addEventListener('keydown', function (event) {
    if (event.defaultPrevented || event.altKey || (!event.ctrlKey && !event.metaKey) || event.key.toLowerCase() !== 'k') return;
    if (document.querySelector('dialog[open]') && !dialog.open) return;
    event.preventDefault();
    if (dialog.open) { input.focus(); input.select(); }
    else openSearch();
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== RECENT_KEY && event.key !== null) return;
    recentIds = readRecent();
    if (dialog.open && !input.value) renderResults();
  });
  try { input.value = (sessionStorage.getItem(QUERY_KEY) || '').slice(0, 100); } catch (error) { /* Search works without session storage. */ }
  renderResults();
})();
