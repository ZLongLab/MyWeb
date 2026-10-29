// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
export default function initialize(scope) {
  (function () {
    "use strict";

    var data = window.SITE_WORKBENCH || {};
    var projects = Array.isArray(window.SITE_PROJECTS)
      ? window.SITE_PROJECTS
      : [];
    var articles = Array.isArray(window.SITE_ARTICLES)
      ? window.SITE_ARTICLES
      : [];

    function element(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function dateNode(date) {
      var time = element("time", "", date);
      time.dateTime = date;
      return time;
    }

    function projectLink(project) {
      var link = element("a", "", project.title + " →");
      link.href = window.SITE_NAV.detailHref("projects", project.id);
      return link;
    }

    var updated =
      typeof data.updated === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(data.updated)
        ? data.updated
        : "";
    document
      .querySelectorAll("[data-workbench-updated]")
      .forEach(function (time) {
        time.textContent = updated;
        if (updated) time.setAttribute("datetime", updated);
      });

    var nowList = document.getElementById("workbench-now-list");
    if (nowList) {
      (Array.isArray(data.focus) ? data.focus : []).forEach(function (item) {
        var project = projects.find(function (entry) {
          return entry.id === item.projectId;
        });
        if (!project) return;
        var row = element("article", "workbench-entry");
        row.append(
          element(
            "p",
            "workbench-entry-meta",
            item.label + " · " + project.status,
          ),
          element("h3", "", project.title),
          element("p", "", item.description),
        );
        var links = element("div", "workbench-entry-links");
        links.append(projectLink(project));
        var article = articles.find(function (entry) {
          return entry.id === project.articleId;
        });
        if (article) {
          var articleLink = element("a", "", "阅读开发记录 →");
          articleLink.href = window.SITE_NAV.detailHref("articles", article.id);
          links.append(articleLink);
        }
        row.append(links);
        nowList.append(row);
      });
    }

    var toolList = document.getElementById("workbench-tools-list");
    if (toolList) {
      (Array.isArray(data.tools) ? data.tools : []).forEach(function (item) {
        var row = element("dl", "workbench-tool-row");
        var term = element("dt");
        term.append(
          element("span", "workbench-entry-meta", item.purpose),
          element("span", "workbench-tool-title", item.title),
        );
        row.append(term, element("dd", "", item.description));
        var project = projects.find(function (entry) {
          return entry.id === item.projectId;
        });
        if (project) {
          var linkRow = element("dd", "workbench-entry-links");
          linkRow.append(projectLink(project));
          row.append(linkRow);
        }
        toolList.append(row);
      });
    }

    var updateList = document.getElementById("workbench-update-list");
    if (updateList) {
      (Array.isArray(data.updates) ? data.updates : [])
        .slice()
        .sort(function (a, b) {
          return String(b.date).localeCompare(String(a.date));
        })
        .slice(0, 2)
        .forEach(function (item) {
          var row = element("article", "workbench-entry");
          var meta = element("p", "workbench-entry-meta");
          meta.append(
            dateNode(item.date),
            document.createTextNode(" · v" + item.version),
          );
          row.append(meta, element("h3", "", item.title));
          var list = element("ul");
          (Array.isArray(item.changes) ? item.changes : []).forEach(
            function (change) {
              list.append(element("li", "", change));
            },
          );
          row.append(list);
          updateList.append(row);
        });
      var allUpdates = element(
        "a",
        "home-text-link",
        "完整版本史已放进房屋说明书 →",
      );
      allUpdates.href = "colophon.html#changelog";
      updateList.append(allUpdates);
    }
  })();
}
