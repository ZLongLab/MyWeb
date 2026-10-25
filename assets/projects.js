(() => {
  'use strict';

  const list = document.querySelector('[data-project-list]');
  const filters = document.querySelector('[data-project-filters]');
  const count = document.querySelector('[data-project-count]');
  if (!list || !filters || !count) return;
  const projects = Array.isArray(window.SITE_PROJECTS) ? window.SITE_PROJECTS : [];
  const categories = ['全部', ...new Set(projects.map(project => project.category))];
  let activeCategory = '全部';

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function readCategory() {
    const requested = new URLSearchParams(location.search).get('category');
    activeCategory = categories.includes(requested) ? requested : '全部';
  }

  function detailHref(project) {
    return window.SITE_NAV.detailHref('projects', project.id, { category: activeCategory });
  }

  function createProject(project, index) {
    const article = element('article', 'portfolio-project');
    article.id = project.id;
    article.dataset.tone = ['cool', 'warm', 'sand', 'mist'][index % 4];
    article.setAttribute('aria-labelledby', `${project.id}-title`);
    const number = element('span', 'portfolio-number', String(index + 1).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    const content = element('div', 'portfolio-content');
    const meta = element('div', 'portfolio-meta');
    meta.append(number, element('span', 'portfolio-category', project.category), element('span', 'portfolio-status', project.status));
    const heading = element('h2', 'portfolio-title');
    heading.id = `${project.id}-title`;
    const titleLink = element('a', '', project.title);
    titleLink.href = detailHref(project);
    const arrow = element('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    titleLink.append(arrow);
    heading.append(titleLink);
    const summary = element('p', 'portfolio-summary', project.summary);
    const tags = element('ul', 'portfolio-tags');
    tags.setAttribute('aria-label', '项目技术与特点');
    for (const tag of Array.isArray(project.tags) ? project.tags : []) tags.append(element('li', '', tag));
    content.append(meta, heading, summary, tags);
    article.append(content);
    return article;
  }

  function render() {
    const selected = projects.filter(project => activeCategory === '全部' || project.category === activeCategory);
    list.replaceChildren(...selected.map(project => createProject(project, projects.indexOf(project))));
    count.textContent = `共 ${selected.length} 件作品${activeCategory === '全部' ? '' : ` · ${activeCategory}`}`;
    for (const button of filters.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.category === activeCategory));
    if (!selected.length) list.append(element('p', 'portfolio-empty', '作品资料暂时无法显示，请刷新页面再试。'));
  }

  function updateUrl() {
    try {
      const url = new URL(window.SITE_NAV.listHref('projects', { category: activeCategory }), location.href);
      const state = history.state && typeof history.state === 'object' ? history.state : {};
      history.replaceState(state, '', url.href);
    } catch { /* Some file:// browsers restrict history updates; filtering still works. */ }
  }

  for (const category of categories) {
    const button = element('button', '', category);
    button.type = 'button';
    button.dataset.category = category;
    button.addEventListener('click', () => { activeCategory = category; updateUrl(); render(); });
    filters.append(button);
  }

  function followLegacyLink() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return false; }
    const project = projects.find(entry => entry.id === id);
    if (!project) return false;
    // Replace only obsolete project anchors, so Back cannot bounce through a redirect.
    location.replace(window.SITE_NAV.detailHref('projects', id, { category: activeCategory }));
    return true;
  }

  readCategory();
  if (followLegacyLink()) return;
  render();
  window.addEventListener('popstate', () => { readCategory(); if (!followLegacyLink()) render(); });
  window.addEventListener('hashchange', followLegacyLink);
})();
