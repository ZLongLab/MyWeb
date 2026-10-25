(function () {
  'use strict';

  function sortArticles(entries) {
    return (Array.isArray(entries) ? entries : []).map(function (article, index) {
      var timestamp = Date.parse(article.date);
      return { article: article, index: index, timestamp: Number.isFinite(timestamp) ? timestamp : -Infinity };
    }).sort(function (a, b) {
      return a.timestamp === b.timestamp ? a.index - b.index : (a.timestamp > b.timestamp ? -1 : 1);
    }).map(function (entry) { return entry.article; });
  }

  function readingTime(article) {
    if (typeof article.readTime === 'string' && article.readTime.trim()) return article.readTime.trim();
    var text = (Array.isArray(article.sections) ? article.sections : []).map(function (section) {
      return [section.heading || ''].concat(section.paragraphs || [], section.list || []).join(' ');
    }).join(' ');
    var count = (text.match(/[\p{L}\p{N}]/gu) || []).length;
    return Math.max(1, Math.ceil(count / 320)) + ' 分钟';
  }

  function relatedArticles(entries, current) {
    var others = sortArticles(entries).filter(function (article) { return article.id !== current.id; });
    var tags = Array.isArray(current.tags) ? current.tags : [];
    function related(article) {
      return Boolean(current.category && article.category === current.category) ||
        (Array.isArray(article.tags) && article.tags.some(function (tag) { return tags.indexOf(tag) !== -1; }));
    }
    return others.filter(related).concat(others.filter(function (article) { return !related(article); })).slice(0, 2);
  }

  window.SITE_CONTENT = { sortArticles: sortArticles, readingTime: readingTime, relatedArticles: relatedArticles };
})();
