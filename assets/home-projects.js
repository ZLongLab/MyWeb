(function () {
  'use strict';

  var projects = Array.isArray(window.SITE_PROJECTS) ? window.SITE_PROJECTS : [];
  var articles = window.SITE_CONTENT && Array.isArray(window.SITE_ARTICLES) ? window.SITE_CONTENT.sortArticles(window.SITE_ARTICLES) : [];
  var snapshot = window.SITE_SNAPSHOT || {};
  var workbench = window.SITE_WORKBENCH || {};

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function arrow(symbol) {
    var node = element('span', 'entry-arrow', symbol || '→');
    node.setAttribute('aria-hidden', 'true');
    return node;
  }
  function detailHref(type, id) {
    return window.SITE_NAV ? window.SITE_NAV.detailHref(type, id) : (type === 'articles' ? 'article.html' : 'project.html') + '?id=' + encodeURIComponent(id);
  }
  function validImage(image) {
    return image && /^assets\/images\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|svg)$/.test(image.src);
  }
  function dateNode(date, className) {
    var time = element('time', className || '', date);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date || '')) time.dateTime = date;
    return time;
  }
  function windowFrame(project, className, priority, scene) {
    var image = scene && project.sceneImage || project.image;
    if (!validImage(image)) return null;
    var frame = element('a', className);
    frame.href = image.src;
    frame.dataset.projectId = project.id;
    frame.setAttribute('data-image-preview', '');
    frame.setAttribute('data-image-caption', image.caption || project.title + ' 应用界面示例');
    frame.setAttribute('aria-label', project.title + ' · 查看界面大图');
    var chrome = element('span', 'home-window');
    var bar = element('span', 'home-window-bar');
    bar.setAttribute('aria-hidden', 'true');
    var dots = element('span', 'home-window-dots');
    for (var index = 0; index < 3; index += 1) dots.append(element('i'));
    bar.append(dots, element('span', 'home-window-name', project.title), element('span', 'home-window-local', 'LOCAL'));
    var view = element('span', 'home-window-view');
    view.append(window.SITE_PICTURES.create(image, { priority: priority, sizes: '(max-width: 768px) 92vw, (max-width: 1100px) 44vw, 500px' }));
    chrome.append(bar, view);
    frame.append(chrome, element('span', 'image-preview-hint', '查看大图 ⤢'));
    return frame;
  }

  var featured = projects.filter(function (project) { return project.featured === true; });
  var showcase = document.getElementById('home-showcase');
  if (showcase && featured.some(function (project) { return validImage(project.image); })) {
    showcase.replaceChildren();
    featured.filter(function (project) { return validImage(project.image); }).slice(0, 2).forEach(function (project, index) {
      showcase.append(windowFrame(project, 'home-shot ' + (index === 0 ? 'home-shot-front' : 'home-shot-back'), index === 0, true));
    });
  }
  var recall = projects.find(function (project) { return project.id === 'recallai'; });
  var nowRecall = document.querySelector('[data-now-recall]');
  if (recall && nowRecall) {
    var version = String(recall.status || '').match(/v\d+(?:\.\d+)*/);
    nowRecall.textContent = recall.title + (version ? ' ' + version[0] : '') + ' · 本地检索';
  }
  var recentNote = document.querySelector('[data-now-article]');
  if (recentNote && articles.length) {
    recentNote.textContent = articles[0].title;
    recentNote.title = articles[0].title;
  }

  var projectList = document.getElementById('home-featured-projects');
  if (projectList) {
    projectList.replaceChildren();
    featured.forEach(function (project, index) {
      var row = element('article', 'home-work');
      row.dataset.projectId = project.id;
      var copy = element('a', 'home-work-copy');
      copy.href = detailHref('projects', project.id);
      copy.setAttribute('aria-label', project.title + ' · 查看作品详情');
      var number = element('span', 'home-work-number', String(index + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      var title = element('h3', 'home-work-title', project.title);
      title.append(arrow());
      var meta = element('div', 'home-work-meta');
      // The category already says 本地工具; avoid repeating 本地 in the status.
      var status = String(project.status || '').replace(/^本地开发\s*·\s*/, '');
      meta.append(element('span', 'home-work-category', project.category), element('span', 'home-work-status', status));
      var keywords = Array.isArray(project.keywords) ? project.keywords : (Array.isArray(project.tags) ? project.tags : []);
      copy.append(number, meta, title, element('p', 'home-work-summary', project.summary), element('p', 'home-work-keywords', keywords.join(' · ')));
      var action = element('span', 'home-work-action', '阅读作品详情');
      action.append(arrow());
      copy.append(action);
      row.append(copy);
      var frame = windowFrame(project, 'home-work-image', false);
      if (frame) row.append(frame);
      projectList.append(row);
    });
    if (!featured.length) projectList.append(element('p', 'home-work-empty', '精选作品还在整理，完整项目可从“全部作品”进入。'));
  }

  var now = document.getElementById('home-bento-now');
  if (now) {
    var focus = (Array.isArray(workbench.focus) ? workbench.focus : []).find(function (item) { return item && item.label; });
    if (focus) {
      now.replaceChildren(element('h3', 'home-bento-title', focus.label), element('p', 'home-bento-description', focus.description || '近况详情放在门牌页。'));
      var nowDate = element('p', 'home-bento-meta', '更新于 ');
      nowDate.append(dateNode(workbench.updated || '尚未记录'));
      now.append(nowDate);
    }
  }

  var pulse = document.getElementById('home-bento-pulse');
  if (pulse) {
    var github = snapshot.github || {};
    var validLogin = /^[a-zA-Z0-9-]+$/.test(github.login || '');
    var sourceLink = element('a', 'home-bento-link', '前往 GitHub');
    sourceLink.href = 'https://github.com/' + (validLogin ? github.login : 'ZLongLab');
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener noreferrer';
    sourceLink.append(arrow('↗'));
    if (github.status === 'ready' && Number.isFinite(github.total) && /^assets\/images\/[a-zA-Z0-9_-]+\.svg$/.test(github.svg || '')) {
      pulse.replaceChildren();
      var headline = element('p', 'home-pulse-total');
      headline.append(element('strong', '', new Intl.NumberFormat('zh-CN').format(github.total)), document.createTextNode(' 次公开贡献'));
      var chart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chart.setAttribute('class', 'home-heatmap'); chart.setAttribute('viewBox', '0 0 370 122'); chart.setAttribute('role', 'img'); chart.setAttribute('data-heatmap', '');
      chart.setAttribute('aria-label', (validLogin ? github.login : 'GitHub') + ' 最近 26 周公开活动快照：' + github.total + ' 次贡献，' + github.from + ' 至 ' + github.to + '。');
      var tones = ['#34443a', '#426b4e', '#648c63', '#8eb37c', '#c0d59a'];
      (Array.isArray(github.weeks) ? github.weeks : []).slice(0, 26).forEach(function (week, weekIndex) {
        (Array.isArray(week.days) ? week.days : []).slice(0, 7).forEach(function (day, dayIndex) {
          var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('class', 'home-heatmap-day'); rect.style.setProperty('--week', String(weekIndex));
          rect.setAttribute('x', String(28 + weekIndex * 13)); rect.setAttribute('y', String(18 + dayIndex * 13));
          rect.setAttribute('width', '10'); rect.setAttribute('height', '10'); rect.setAttribute('rx', '2'); rect.setAttribute('fill', tones[day.level] || tones[0]);
          var tip = document.createElementNS('http://www.w3.org/2000/svg', 'title'); tip.textContent = day.date + '：' + day.count + ' 次公开贡献'; rect.append(tip); chart.append(rect);
        });
      });
      [['一', 39], ['三', 65], ['五', 91]].forEach(function (label) {
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text'); text.setAttribute('x', '0'); text.setAttribute('y', String(label[1])); text.setAttribute('fill', '#b9cbb5'); text.setAttribute('font-size', '8'); text.textContent = label[0]; chart.append(text);
      });
      var caption = element('p', 'home-bento-meta', '最近 26 周 · ');
      caption.append(document.createTextNode(github.from || ''), document.createTextNode(' — '), document.createTextNode(github.to || ''));
      var reviewed = element('p', 'home-bento-meta', snapshot.reviewedAt ? '快照核对 ' : '生成于 ');
      reviewed.append(dateNode(snapshot.reviewedAt || String(snapshot.generatedAt || '').slice(0, 10) || '尚未记录'));
      pulse.append(headline, chart, caption, reviewed, sourceLink);
    } else {
      pulse.replaceChildren(element('h3', 'home-bento-title', '活动快照待整理'), element('p', 'home-bento-description', '这里展示人工核对后的 GitHub 活动。网页不会连接 API，暂不显示未确认的数字。'), sourceLink);
    }
  }

  var statistics = document.getElementById('home-bento-stats');
  if (statistics) {
    var counts = snapshot.statistics || {};
    var dayCount = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(snapshot.siteStarted || '')) {
      var today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      var elapsed = Math.floor((Date.parse(today + 'T00:00:00Z') - Date.parse(snapshot.siteStarted + 'T00:00:00Z')) / 86400000);
      if (Number.isFinite(elapsed) && elapsed >= 0) dayCount = elapsed + 1;
    }
    if (['articles', 'words', 'projects'].every(function (key) { return Number.isInteger(counts[key]) && counts[key] >= 0; })) {
      var grid = element('dl', 'home-stat-grid');
      [[counts.articles, '篇记录'], [counts.words, '正文字符'], [counts.projects, '件作品'], [dayCount, '小站生长']].forEach(function (item, index) {
        var pair = element('div');
        pair.append(element('dt', '', item[1]), element('dd', '', item[0] === null ? '—' : new Intl.NumberFormat('zh-CN').format(item[0]) + (index === 3 ? ' 天' : '')));
        grid.append(pair);
      });
      var captionText = '据本地内容快照';
      if (dayCount !== null) captionText += ' · 自 ' + snapshot.siteStarted + ' 起';
      statistics.replaceChildren(grid, element('p', 'home-bento-meta', captionText));
    }
  }

  var latest = document.getElementById('home-bento-latest');
  if (latest && articles.length) {
    var article = articles[0];
    var latestMeta = element('p', 'home-latest-meta');
    latestMeta.append(window.SITE_GARDEN.badge(article), dateNode(article.date));
    var latestHeading = element('h3', 'home-bento-title');
    var latestLink = element('a', 'home-latest-title', article.title);
    latestLink.href = detailHref('articles', article.id);
    latestHeading.append(latestLink);
    var latestAction = element('a', 'home-bento-link', '去书房阅读');
    latestAction.href = latestLink.href;
    latestAction.append(arrow());
    latest.replaceChildren(latestMeta, latestHeading, element('p', 'home-bento-description', article.summary), latestAction);
  }

  var articleList = document.getElementById('home-article-list');
  if (articleList) {
    articleList.replaceChildren();
    articles.slice(0, 3).forEach(function (article) {
      var link = element('a', 'journal-entry');
      link.href = detailHref('articles', article.id);
      var copy = element('div', 'journal-copy');
      copy.append(element('h3', '', article.title), element('p', 'journal-summary', article.summary));
      var meta = element('div', 'journal-meta');
      var category = element('span', 'journal-category', article.category);
      category.dataset.category = article.category;
      meta.append(dateNode(article.date), category, arrow());
      link.append(window.SITE_GARDEN.cover(article), copy, meta);
      articleList.append(link);
    });
    if (!articles.length) articleList.append(element('p', 'home-bento-empty', '记录还在整理，稍后再来书房看看。'));
  }
  var counts = snapshot.statistics || {};
  [['projects', '件作品'], ['articles', '篇记录']].forEach(function (entry) { var node = document.querySelector('[data-home-count="' + entry[0] + '"]'); if (node && Number.isInteger(counts[entry[0]])) node.textContent = counts[entry[0]] + ' ' + entry[1]; });
  var seasonNames = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' };
  function syncDesk() {
    var season = document.documentElement.dataset.season, theme = document.documentElement.dataset.theme;
    document.querySelectorAll('[data-desk-season]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.deskSeason === season)); });
    var weather = document.querySelector('[data-home-weather]'); if (weather) weather.textContent = '此刻 ' + (seasonNames[season] || '秋') + ' / ' + (theme === 'night' ? '夜色' : '纸色');
  }
  document.querySelectorAll('[data-desk-season]').forEach(function (button) { button.addEventListener('click', function () { if (window.SITE_THEME) window.SITE_THEME.setSeason(button.dataset.deskSeason); }); });
  document.addEventListener('myweb:season-change', syncDesk); document.addEventListener('myweb:theme-change', syncDesk); syncDesk();
  var stamp = document.querySelector('[data-desk-version]'); if (stamp && workbench.updates && workbench.updates[0]) stamp.textContent = 'v' + workbench.updates[0].version.replace(/\.0$/, '');
  var band = document.getElementById('home-garden-band'), graph = window.SITE_GARDEN_GRAPH || {};
  if (band && graph.eligible && graph.nodes && graph.edges) { band.hidden = false; band.querySelector('img').alt = '文章花园缩略图：' + graph.nodes.length + ' 篇记录，' + graph.edges.length + ' 条引用；完整图请进入书房。'; band.querySelector('[data-garden-summary]').textContent = graph.nodes.length + ' 篇记录 · ' + graph.edges.length + ' 条小径'; }
  var desk = document.querySelector('.home-showcase'), fine = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)'), reduce = window.matchMedia('(prefers-reduced-motion: reduce)'), frame = 0, point = [0, 0];
  function resetDesk() { cancelAnimationFrame(frame); frame = 0; point = [0, 0]; if (desk) { desk.style.setProperty('--desk-x', '0'); desk.style.setProperty('--desk-y', '0'); } }
  if (desk) {
    desk.addEventListener('pointermove', function (event) { if (!fine.matches || reduce.matches || event.pointerType === 'touch' || desk.contains(document.activeElement)) return resetDesk(); var b = desk.getBoundingClientRect(); point = [Math.max(-1, Math.min(1, (event.clientX - b.left) / b.width * 2 - 1)), Math.max(-1, Math.min(1, (event.clientY - b.top) / b.height * 2 - 1))]; if (!frame) frame = requestAnimationFrame(function () { frame = 0; desk.style.setProperty('--desk-x', point[0].toFixed(3)); desk.style.setProperty('--desk-y', point[1].toFixed(3)); }); });
    desk.addEventListener('pointerleave', resetDesk); desk.addEventListener('focusin', resetDesk); fine.addEventListener('change', resetDesk); reduce.addEventListener('change', resetDesk); window.addEventListener('pagehide', resetDesk);
  }
})();
