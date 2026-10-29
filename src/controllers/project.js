// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
export default function initialize(scope) {
  (function () {
    "use strict";
    var params = new URLSearchParams(location.search);
    var projects = Array.isArray(window.SITE_PROJECTS)
      ? window.SITE_PROJECTS
      : [];
    var project = projects.find(function (entry) {
      return entry.id === params.get("id");
    });
    var context = { category: params.get("category") || "" };
    var parentHref = window.SITE_NAV.listHref("projects", context);
    document
      .querySelectorAll("[data-project-list-link]")
      .forEach(function (link) {
        link.href = parentHref;
      });
    var breadcrumb = document.getElementById("project-breadcrumb-title");
    var siteTitle =
      (window.SITE_DATA && window.SITE_DATA.siteTitle) || "有间小站";
    if (!project) {
      document.getElementById("project-content").hidden = true;
      document.getElementById("project-not-found").hidden = false;
      breadcrumb.textContent = "作品不存在";
      document.title = "作品不存在 · " + siteTitle;
      return;
    }

    function element(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function previewLink(img, caption) {
      var link = element("a", "project-image-link");
      link.href = img.querySelector("img").src;
      link.setAttribute("data-image-preview", "");
      link.setAttribute(
        "data-image-caption",
        caption || project.title + " 界面示例",
      );
      link.setAttribute("aria-label", project.title + " · 查看界面大图");
      link.append(img, element("span", "image-preview-hint", "查看大图 ⤢"));
      return link;
    }

    document.getElementById("project-content").hidden = false;
    document.getElementById("project-not-found").hidden = true;
    document.title = project.title + " · " + siteTitle;
    breadcrumb.textContent = project.title;
    document.getElementById("project-title").textContent = project.title;
    document.getElementById("project-summary").textContent = project.summary;
    document.querySelector('meta[name="description"]').content =
      project.summary;
    window.SITE_CONTENT.updateDiscovery(
      document.title,
      project.summary,
      "project.html?id=" + encodeURIComponent(project.id),
      "website",
    );
    document
      .getElementById("project-meta")
      .append(
        element("span", "portfolio-category", project.category),
        element("span", "portfolio-status", project.status),
      );
    (Array.isArray(project.tags) ? project.tags : []).forEach(function (tag) {
      document.getElementById("project-tags").append(element("li", "", tag));
    });
    String(project.detail || "")
      .split(/\n\s*\n/)
      .filter(Boolean)
      .forEach(function (paragraph) {
        document
          .getElementById("project-body")
          .append(element("p", "", paragraph));
      });
    var headings = [];
    (Array.isArray(project.sections) ? project.sections : []).forEach(
      function (section, index) {
        var block = element("section", "project-body-section");
        if (section.heading) {
          var heading = element("h3", "", section.heading);
          heading.id = "project-section-" + (index + 1);
          heading.tabIndex = -1;
          block.append(heading);
          headings.push(heading);
        }
        (Array.isArray(section.paragraphs) ? section.paragraphs : []).forEach(
          function (paragraph) {
            block.append(element("p", "", paragraph));
          },
        );
        if (Array.isArray(section.list) && section.list.length) {
          var list = element(section.ordered ? "ol" : "ul");
          section.list.forEach(function (item) {
            list.append(element("li", "", item));
          });
          block.append(list);
        }
        if (
          section.image &&
          /^assets\/images\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|svg)$/.test(
            section.image.src,
          )
        ) {
          var sectionFigure = element("figure", "project-figure");
          sectionFigure.dataset.projectId = project.id;
          var sectionImage = window.SITE_PICTURES.create(section.image);
          sectionFigure.append(
            previewLink(sectionImage, section.image.caption),
            element("figcaption", "", section.image.caption || ""),
          );
          block.append(sectionFigure);
        }
        document.getElementById("project-body").append(block);
      },
    );
    var toc = document.getElementById("project-toc");
    if (toc && headings.length > 1) {
      var tocList = element("ol");
      headings.forEach(function (heading) {
        var item = element("li");
        var link = element("a", "", heading.textContent);
        link.href = "#" + heading.id;
        item.append(link);
        tocList.append(item);
      });
      toc.append(tocList);
      toc.hidden = false;
      // A shared URL with a section fragment must work on first load as well.
      scope.listen(
        window,
        "load",
        function () {
          var target = headings.find(function (heading) {
            return location.hash === "#" + heading.id;
          });
          if (target) target.scrollIntoView();
        },
        { once: true },
      );
    }
    var linkedArticle = (
      Array.isArray(window.SITE_ARTICLES) ? window.SITE_ARTICLES : []
    ).find(function (article) {
      return article.id === project.articleId;
    });
    if (linkedArticle) {
      var note = element("p", "project-related-note");
      var noteLink = element(
        "a",
        "text-link",
        "开发手记：" + linkedArticle.title + " →",
      );
      noteLink.href = window.SITE_NAV.detailHref("articles", linkedArticle.id);
      note.append(noteLink);
      document.getElementById("project-body").append(note);
    }
    var image = project.image;
    if (
      image &&
      /^assets\/images\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|svg)$/.test(image.src)
    ) {
      var figure = document.getElementById("project-figure");
      figure.dataset.projectId = project.id;
      var img = window.SITE_PICTURES.create(image, { priority: true });
      figure.append(
        previewLink(img, image.caption),
        element("figcaption", "", image.caption),
      );
      figure.hidden = false;
    }
    if (project.sourceUrl) {
      try {
        var source = new URL(project.sourceUrl);
        if (
          source.protocol === "https:" &&
          !source.username &&
          !source.password
        ) {
          var link = element("a", "text-link", "查看源码仓库（新标签页） ↗");
          link.href = source.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.getElementById("project-source").append(link);
        }
      } catch (error) {
        /* An invalid optional source URL never affects local detail reading. */
      }
    }
  })();
}
