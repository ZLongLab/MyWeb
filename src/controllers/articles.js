// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
export default function initialize(scope) {
  (function () {
    "use strict";

    var articles = window.SITE_CONTENT.sortArticles(window.SITE_ARTICLES);
    var featuredArticle =
      articles.find(function (article) {
        return article.featured;
      }) || articles[0];
    var config = window.SITE_DATA || {};
    var params = new URLSearchParams(window.location.search);
    var siteTitle =
      typeof config.siteTitle === "string" && config.siteTitle.trim()
        ? config.siteTitle.trim()
        : "有间小站";
    var author =
      typeof config.name === "string" &&
      config.name.trim() &&
      config.name.trim() !== "你的名字"
        ? config.name.trim()
        : siteTitle;

    function createElement(tag, className, text) {
      var element = document.createElement(tag);
      if (className) element.className = className;
      if (text !== undefined) element.textContent = text;
      return element;
    }

    var categories = articles
      .map(function (article) {
        return article.category;
      })
      .filter(function (name, index, names) {
        return (
          typeof name === "string" &&
          name.trim() &&
          names.indexOf(name) === index
        );
      });
    var allTags = articles.flatMap(function (article) {
      return Array.isArray(article.tags) ? article.tags : [];
    });

    function readContext(sourceParams) {
      var requestedCategory = sourceParams.get("category");
      return {
        category:
          categories.indexOf(requestedCategory) !== -1
            ? requestedCategory
            : "all",
        q: (sourceParams.get("q") || "").slice(0, 100),
        tag:
          allTags.indexOf(sourceParams.get("tag")) !== -1
            ? sourceParams.get("tag")
            : "",
        view:
          sourceParams.get("view") === "topics" ||
          sourceParams.get("view") === "time"
            ? sourceParams.get("view")
            : "",
      };
    }

    function listHref(context) {
      if (window.SITE_NAV) return window.SITE_NAV.listHref("articles", context);
      var queryParams = new URLSearchParams();
      if (context.category !== "all")
        queryParams.set("category", context.category);
      if (context.q.trim()) queryParams.set("q", context.q.trim());
      return (
        "articles.html" +
        (queryParams.toString() ? "?" + queryParams.toString() : "")
      );
    }

    function articleHref(article, context) {
      if (window.SITE_NAV)
        return window.SITE_NAV.detailHref("articles", article.id, context);
      var queryParams = new URLSearchParams(
        listHref(context).split("?")[1] || "",
      );
      queryParams.set("id", article.id);
      return "article.html?" + queryParams.toString();
    }

    function createDate(article) {
      var date = createElement(
        "time",
        "article-date",
        article.date.replace(/-/g, "."),
      );
      date.dateTime = article.date;
      return date;
    }

    function createCategory(article) {
      var category = createElement(
        "span",
        "article-category",
        article.category,
      );
      category.dataset.category = article.category;
      return category;
    }

    function createMeta(article, includeAuthor) {
      var meta = createElement("div", "article-row-meta");
      meta.appendChild(createDate(article));
      meta.appendChild(createCategory(article));
      meta.appendChild(window.SITE_GARDEN.badge(article));
      var tended = includeAuthor && window.SITE_GARDEN.tended(article);
      if (tended) {
        var watering = createElement(
          "time",
          "garden-tended",
          "最近浇灌于 " + tended,
        );
        watering.dateTime = tended;
        meta.append(watering);
      }
      meta.appendChild(
        createElement(
          "span",
          "article-read-time",
          "约 " + window.SITE_CONTENT.readingTime(article),
        ),
      );
      if (includeAuthor)
        meta.appendChild(createElement("span", "article-author", author));
      return meta;
    }

    function createArticleRow(article, headingTag, context) {
      var row = createElement("a", "article-row");
      var featured = article === featuredArticle;
      row.classList.add(featured ? "journal-feature" : "journal-entry");
      row.href = articleHref(article, context);
      var copy = createElement("div", "journal-entry-copy");
      var heading = createElement(
        headingTag || "h2",
        "article-row-title",
        article.title,
      );
      if (featured) {
        var headingArrow = createElement("span", "journal-title-arrow", "→");
        headingArrow.setAttribute("aria-hidden", "true");
        heading.append(headingArrow);
      }
      copy.appendChild(heading);
      copy.appendChild(
        createElement("p", "article-row-summary", article.summary),
      );
      var details = createElement("div", "journal-entry-details");
      details.appendChild(createMeta(article, false));
      var tags = createElement("div", "article-tags");
      article.tags.forEach(function (tag) {
        tags.appendChild(createElement("span", "article-tag", tag));
      });
      details.appendChild(tags);
      row.append(copy, details);
      if (featured) {
        // Editorial wording supplied for the featured card's metadata.
        details.querySelector(".garden-maturity").lastChild.textContent =
          "种树";
        var readLink = createElement("span", "article-read-link", "阅读全文");
        row.appendChild(readLink);
        // React owns the SVG definition. The list controller owns each use.
        var visual = createElement("figure", "journal-feature-visual");
        visual.setAttribute("aria-hidden", "true");
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 350 250");
        var illustration = document.createElementNS(svg.namespaceURI, "use");
        illustration.setAttribute("href", "#journal-evolution-symbol");
        svg.appendChild(illustration);
        visual.append(svg);
        row.appendChild(visual);
      }
      return row;
    }

    function createRelatedArticleRow(article, context) {
      var row = createElement("a", "article-row related-entry");
      row.href = articleHref(article, context);
      row.appendChild(createElement("h3", "article-row-title", article.title));
      var meta = createElement("div", "article-row-meta");
      meta.appendChild(createDate(article));
      meta.appendChild(createCategory(article));
      row.appendChild(meta);
      return row;
    }

    function searchableText(article) {
      var parts = [article.title, article.summary, article.category].concat(
        article.tags,
      );
      article.sections.forEach(function (section) {
        if (section.heading) parts.push(section.heading);
        parts = parts.concat(section.paragraphs || [], section.list || []);
      });
      return parts.join(" ").toLocaleLowerCase();
    }

    var list = document.getElementById("article-list");
    if (list) {
      var search = document.querySelector(
        'input#article-search[type="search"], #article-search input[type="search"]',
      );
      var count = document.getElementById("article-count");
      var empty = document.getElementById("article-empty");
      var clearButton = document.getElementById("clear-article-filters");
      var filterContainer = document.querySelector(".article-filters");
      if (filterContainer) {
        filterContainer.replaceChildren();
        var filterOptions = [{ value: "all", label: "全部文章" }].concat(
          categories.map(function (name) {
            return { value: name, label: name };
          }),
        );
        filterOptions.forEach(function (option) {
          var button = createElement("button", "", option.label);
          var total =
            option.value === "all"
              ? articles.length
              : articles.filter(function (article) {
                  return article.category === option.value;
                }).length;
          var counter = createElement(
            "small",
            "journal-filter-count",
            String(total).padStart(2, "0"),
          );
          counter.setAttribute("aria-hidden", "true");
          button.append(counter);
          button.type = "button";
          button.setAttribute("data-article-filter", option.value);
          button.setAttribute("aria-pressed", "false");
          filterContainer.appendChild(button);
        });
      }
      var filters = document.querySelectorAll("[data-article-filter]");
      var initialContext = readContext(params);
      var category = initialContext.category;
      var query = initialContext.q;
      var tag = initialContext.tag;
      var view = initialContext.view;
      if (!view) {
        try {
          view = sessionStorage.getItem("myweb_article_view_v1");
        } catch (error) {}
      }
      if (view !== "topics") view = "time";
      var clusters = document.getElementById("article-clusters"),
        graph = document.getElementById("garden-map");
      function saveView() {
        try {
          sessionStorage.setItem("myweb_article_view_v1", view);
        } catch (error) {}
      }
      saveView();
      if (search) {
        search.value = query;
        search.maxLength = 100;
      }

      function updateUrl() {
        // file:// 下的浏览器可能限制 replaceState，筛选本身仍然可以使用。
        try {
          var url = new URL(window.location.href);
          if (query.trim()) url.searchParams.set("q", query.trim());
          else url.searchParams.delete("q");
          if (category !== "all") url.searchParams.set("category", category);
          else url.searchParams.delete("category");
          if (tag) url.searchParams.set("tag", tag);
          else url.searchParams.delete("tag");
          url.searchParams.set("view", view);
          window.history.replaceState(
            Object.assign({}, window.history.state || {}),
            "",
            url.href,
          );
        } catch (error) {
          // URL 更新只是便利功能，不影响本地阅读。
        }
      }

      function renderArticles(updateAddress) {
        var terms = query
          .trim()
          .toLocaleLowerCase()
          .split(/\s+/)
          .filter(Boolean);
        var matching = articles.filter(function (article) {
          if (category !== "all" && article.category !== category) return false;
          if (
            tag &&
            (!Array.isArray(article.tags) || article.tags.indexOf(tag) === -1)
          )
            return false;
          var text = searchableText(article);
          return terms.every(function (term) {
            return text.indexOf(term) !== -1;
          });
        });
        var featuredIndex = matching.indexOf(featuredArticle);
        if (featuredIndex > 0)
          matching.unshift(matching.splice(featuredIndex, 1)[0]);

        list.replaceChildren();
        var context = { category: category, q: query, tag: tag, view: view };
        matching.forEach(function (article) {
          list.appendChild(createArticleRow(article, "h2", context));
        });
        list.hidden = view === "topics";
        if (clusters) {
          clusters.hidden = view !== "topics";
          clusters.replaceChildren();
          window.SITE_GARDEN.clusters(matching).forEach(function (group) {
            var card = createElement("section", "journal-topic-card");
            var overview = createElement("a", "garden-cluster");
            overview.href = listHref({
              category: category,
              q: query,
              tag: group.tag,
              view: "time",
            });
            var heading = createElement("h2", "", group.tag);
            heading.append(
              createElement("small", "", group.articles.length + " 篇"),
            );
            overview.append(heading);
            var topicDescriptions = {
              建站手记: "从第一版到日常修缮，记下小站的结构、样式与取舍。",
              开发记录:
                "围绕本地工具与前端实现，整理功能背后的思路和使用边界。",
              小站计划: "留下下一步的想法、清单与更新安排。",
            };
            overview.append(
              createElement(
                "p",
                "",
                topicDescriptions[group.tag] || group.articles[0].summary,
              ),
            );
            card.append(overview);
            var entries = createElement("ul", "journal-topic-articles");
            group.articles.forEach(function (article) {
              var item = createElement("li");
              var link = createElement("a", "");
              link.href = articleHref(article, context);
              link.append(
                createElement("span", "", article.title),
                createDate(article),
              );
              item.append(link);
              entries.append(item);
            });
            card.append(entries);
            var distribution = createElement("div", "garden-distribution");
            ["seed", "growing", "evergreen"].forEach(function (value) {
              var badge = window.SITE_GARDEN.badge({ maturity: value });
              badge.append(document.createTextNode(" " + group.counts[value]));
              distribution.append(badge);
            });
            card.append(distribution);
            clusters.append(card);
          });
        }
        if (graph) {
          window.SITE_GARDEN.renderGraph(graph, articles, context);
          if (view !== "topics") graph.hidden = true;
        }
        document
          .querySelectorAll("[data-article-view]")
          .forEach(function (button) {
            button.setAttribute(
              "aria-pressed",
              String(button.dataset.articleView === view),
            );
          });
        var tagFilter = document.getElementById("garden-tag-filter");
        if (tagFilter) {
          tagFilter.hidden = !tag;
          tagFilter.querySelector("span").textContent = "主题：" + tag;
        }
        filters.forEach(function (button) {
          button.setAttribute(
            "aria-pressed",
            String(button.getAttribute("data-article-filter") === category),
          );
        });
        if (count) count.textContent = matching.length + " 篇文章";
        if (empty) empty.hidden = matching.length > 0;
        if (updateAddress) updateUrl();
      }

      if (search) {
        scope.listen(search, "input", function () {
          query = search.value.slice(0, 100);
          renderArticles(true);
        });
        var searchForm = search.closest("form");
        if (searchForm)
          scope.listen(searchForm, "submit", function (event) {
            event.preventDefault();
          });
      }

      filters.forEach(function (button) {
        scope.listen(button, "click", function () {
          category = button.getAttribute("data-article-filter") || "all";
          renderArticles(true);
        });
      });

      if (clearButton) {
        scope.listen(clearButton, "click", function () {
          query = "";
          category = "all";
          tag = "";
          if (search) search.value = "";
          renderArticles(true);
          if (search) search.focus();
        });
      }
      scope.listen(window, "popstate", function () {
        var context = readContext(new URLSearchParams(window.location.search));
        category = context.category;
        query = context.q;
        tag = context.tag;
        if (context.view) view = context.view;
        saveView();
        if (search) search.value = query;
        renderArticles(false);
      });
      document
        .querySelectorAll("[data-article-view]")
        .forEach(function (button) {
          scope.listen(button, "click", function () {
            view = button.dataset.articleView;
            saveView();
            renderArticles(true);
          });
        });
      var clearTag = document.getElementById("garden-clear-tag");
      if (clearTag)
        scope.listen(clearTag, "click", function () {
          tag = "";
          renderArticles(true);
        });
      renderArticles(true);
    }

    var title = document.getElementById("article-title");
    if (title) {
      var id = params.get("id");
      var article = articles.find(function (item) {
        return item.id === id;
      });
      var content = document.getElementById("article-content");
      var notFound = document.getElementById("article-not-found");
      var detailContext = readContext(params);
      document
        .querySelectorAll("[data-article-list-link]")
        .forEach(function (link) {
          link.href = listHref(detailContext);
        });
      var breadcrumbTitle = document.getElementById("article-breadcrumb-title");
      if (breadcrumbTitle)
        breadcrumbTitle.textContent = article ? article.title : "文章不存在";

      if (!article) {
        if (content) content.hidden = true;
        if (notFound) notFound.hidden = false;
        document.title = "文章不存在 · " + siteTitle;
        return;
      }

      if (content) content.hidden = false;
      if (notFound) notFound.hidden = true;
      title.textContent = article.title;
      document.title = article.title + " · " + siteTitle;
      var description = document.querySelector('meta[name="description"]');
      if (description) description.setAttribute("content", article.summary);
      window.SITE_CONTENT.updateDiscovery(
        document.title,
        article.summary,
        "article.html?id=" + encodeURIComponent(article.id),
        "article",
      );

      var meta = document.getElementById("article-meta");
      if (meta) meta.replaceChildren(createMeta(article, true));
      var summary = document.getElementById("article-summary");
      if (summary) summary.textContent = article.summary;
      var body = document.getElementById("article-body");
      if (body) {
        body.replaceChildren();
        article.sections.forEach(function (section) {
          var block = createElement("section", "article-body-section");
          if (section.heading)
            block.appendChild(createElement("h2", "", section.heading));
          (section.paragraphs || []).forEach(function (paragraph) {
            block.appendChild(createElement("p", "", paragraph));
          });
          if (section.list && section.list.length) {
            var bullets = createElement("ul");
            section.list.forEach(function (item) {
              bullets.appendChild(createElement("li", "", item));
            });
            block.appendChild(bullets);
          }
          body.appendChild(block);
        });
        var relatedProject = (
          Array.isArray(window.SITE_PROJECTS) ? window.SITE_PROJECTS : []
        ).find(function (entry) {
          return entry.id === article.projectId;
        });
        if (relatedProject) {
          var projectReference = createElement(
            "p",
            "article-project-reference",
          );
          var projectLink = createElement(
            "a",
            "text-link",
            "查看作品：" + relatedProject.title + " →",
          );
          projectLink.href = window.SITE_NAV.detailHref(
            "projects",
            relatedProject.id,
          );
          projectReference.appendChild(projectLink);
          body.appendChild(projectReference);
        }
      }

      var related = document.getElementById("article-related");
      var references = document.getElementById("article-garden-references");
      if (references) {
        references.replaceChildren();
        [
          ["本文提到", window.SITE_GARDEN.mentioned(article, articles)],
          ["提到本文的", window.SITE_GARDEN.backlinks(article, articles)],
        ].forEach(function (group) {
          if (!group[1].length) return;
          var section = createElement("section", "garden-references"),
            links = createElement("ul");
          section.append(createElement("h2", "", group[0]));
          group[1].forEach(function (entry) {
            var li = createElement("li"),
              link = createElement("a", "", entry.title + " →");
            link.href = articleHref(entry, detailContext);
            li.append(link);
            links.append(li);
          });
          section.append(links);
          references.append(section);
        });
      }
      if (related) {
        related.replaceChildren();
        window.SITE_CONTENT.relatedArticles(articles, article).forEach(
          function (item) {
            related.appendChild(createRelatedArticleRow(item, detailContext));
          },
        );
      }
    }
  })();
}
