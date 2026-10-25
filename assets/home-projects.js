(function () {
  'use strict';

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function arrow(symbol) {
    var arrow = element('span', 'entry-arrow', symbol || '→');
    arrow.setAttribute('aria-hidden', 'true');
    return arrow;
  }

  var projectList = document.getElementById('home-featured-projects');
  var recall = (Array.isArray(window.SITE_PROJECTS) ? window.SITE_PROJECTS : []).find(function (project) { return project.id === 'recallai'; });
  var nowRecall = document.querySelector('[data-now-recall]');
  if (recall && nowRecall) {
    var version = String(recall.status || '').match(/v\d+(?:\.\d+)*/);
    nowRecall.textContent = recall.title + (version ? ' ' + version[0] : '') + ' 本地检索';
  }
  if (projectList && Array.isArray(window.SITE_PROJECTS)) {
    var projects = window.SITE_PROJECTS.filter(function (project) { return project.featured === true; });
    projectList.replaceChildren();
    projects.forEach(function (project, index) {
      var link = element('a', 'home-work');
      link.dataset.projectId = project.id;
      link.href = window.SITE_NAV.detailHref('projects', project.id);
      link.setAttribute('aria-label', project.title + ' · 查看作品详情');
      var copy = element('div', 'home-work-copy');
      var number = element('span', 'home-work-number', String(index + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      var title = element('h3', 'home-work-title', project.title);
      title.append(arrow('↗'));
      var meta = element('div', 'home-work-meta');
      meta.append(element('span', 'home-work-category', project.category), element('span', 'home-work-status', project.status));
      var keywords = Array.isArray(project.keywords) ? project.keywords : (Array.isArray(project.tags) ? project.tags : []);
      var tags = element('p', 'home-work-keywords', keywords.join(' · '));
      copy.append(number, meta, title, element('p', 'home-work-summary', project.summary), tags);
      link.append(copy);
      var image = project.image;
      if (image && /^assets\/images\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|svg)$/.test(image.src)) {
        var frame = element('div', 'home-work-image');
        var img = element('img');
        img.src = image.src;
        img.alt = image.caption || project.title + ' 应用界面示例';
        img.width = image.width;
        img.height = image.height;
        if (index === 0) img.fetchPriority = 'high';
        else img.loading = 'lazy';
        frame.append(img);
        link.append(frame);
      }
      projectList.append(link);
    });
  }

  var articleList = document.getElementById('home-article-list');
  if (articleList && Array.isArray(window.SITE_ARTICLES)) {
    var articles = window.SITE_CONTENT.sortArticles(window.SITE_ARTICLES).slice(0, 3);
    var recentNote = document.querySelector('[data-now-article]');
    if (recentNote && articles.length) recentNote.textContent = articles[0].title;
    articleList.replaceChildren();
    articles.forEach(function (article) {
      var link = element('a', 'journal-entry');
      link.href = window.SITE_NAV.detailHref('articles', article.id);
      var copy = element('div', 'journal-copy');
      copy.append(element('h3', '', article.title), element('p', 'journal-summary', article.summary));
      var meta = element('div', 'journal-meta');
      var date = element('time', '', article.date);
      date.dateTime = article.date;
      var category = element('span', 'journal-category', article.category);
      category.dataset.category = article.category;
      meta.append(date, category, arrow());
      link.append(copy, meta);
      articleList.append(link);
    });
  }
})();
