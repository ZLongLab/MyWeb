(function () {
  'use strict';
  var params = new URLSearchParams(location.search);
  var projects = Array.isArray(window.SITE_PROJECTS) ? window.SITE_PROJECTS : [];
  var project = projects.find(function (entry) { return entry.id === params.get('id'); });
  var context = { category: params.get('category') || '' };
  var parentHref = window.SITE_NAV.listHref('projects', context);
  document.querySelectorAll('[data-project-list-link]').forEach(function (link) { link.href = parentHref; });
  var breadcrumb = document.getElementById('project-breadcrumb-title');
  var siteTitle = window.SITE_DATA && window.SITE_DATA.siteTitle || '有间小站';
  if (!project) {
    document.getElementById('project-content').hidden = true;
    document.getElementById('project-not-found').hidden = false;
    breadcrumb.textContent = '作品不存在';
    document.title = '作品不存在 · ' + siteTitle;
    return;
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  document.getElementById('project-content').hidden = false;
  document.getElementById('project-not-found').hidden = true;
  document.title = project.title + ' · ' + siteTitle;
  breadcrumb.textContent = project.title;
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-summary').textContent = project.summary;
  document.querySelector('meta[name="description"]').content = project.summary;
  document.getElementById('project-meta').append(element('span', 'portfolio-category', project.category), element('span', 'portfolio-status', project.status));
  (Array.isArray(project.tags) ? project.tags : []).forEach(function (tag) { document.getElementById('project-tags').append(element('li', '', tag)); });
  String(project.detail || '').split(/\n\s*\n/).filter(Boolean).forEach(function (paragraph) { document.getElementById('project-body').append(element('p', '', paragraph)); });
  (Array.isArray(project.sections) ? project.sections : []).forEach(function (section) {
    var block = element('section', 'project-body-section');
    if (section.heading) block.append(element('h3', '', section.heading));
    (Array.isArray(section.paragraphs) ? section.paragraphs : []).forEach(function (paragraph) { block.append(element('p', '', paragraph)); });
    if (Array.isArray(section.list) && section.list.length) {
      var list = element(section.ordered ? 'ol' : 'ul');
      section.list.forEach(function (item) { list.append(element('li', '', item)); });
      block.append(list);
    }
    if (section.image && /^assets\/images\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|svg)$/.test(section.image.src)) {
      var sectionFigure = element('figure', 'project-figure');
      sectionFigure.dataset.projectId = project.id;
      var sectionImage = element('img');
      sectionImage.src = section.image.src;
      sectionImage.width = section.image.width;
      sectionImage.height = section.image.height;
      sectionImage.alt = section.image.caption || project.title + ' 界面示例';
      sectionImage.loading = 'lazy';
      sectionFigure.append(sectionImage, element('figcaption', '', section.image.caption || ''));
      block.append(sectionFigure);
    }
    document.getElementById('project-body').append(block);
  });
  var linkedArticle = (Array.isArray(window.SITE_ARTICLES) ? window.SITE_ARTICLES : []).find(function (article) { return article.id === project.articleId; });
  if (linkedArticle) {
    var note = element('p', 'project-related-note');
    var noteLink = element('a', 'text-link', '开发手记：' + linkedArticle.title + ' →');
    noteLink.href = window.SITE_NAV.detailHref('articles', linkedArticle.id);
    note.append(noteLink);
    document.getElementById('project-body').append(note);
  }
  var image = project.image;
  if (image && /^assets\/images\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|svg)$/.test(image.src)) {
    var figure = document.getElementById('project-figure');
    figure.dataset.projectId = project.id;
    var img = element('img');
    img.src = image.src;
    img.alt = image.caption;
    img.width = image.width;
    img.height = image.height;
    figure.append(img, element('figcaption', '', image.caption));
    figure.hidden = false;
  }
  if (project.sourceUrl) {
    try {
      var source = new URL(project.sourceUrl);
      if (source.protocol === 'https:' && !source.username && !source.password) {
        var link = element('a', 'text-link', '查看源码仓库（新标签页） ↗');
        link.href = source.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.getElementById('project-source').append(link);
      }
    } catch (error) { /* An invalid optional source URL never affects local detail reading. */ }
  }
})();
