// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
export default function initialize(scope) {
  (function () {
    "use strict";
    var house = window.SITE_HOUSE || {};
    var life = window.SITE_LIFE || {};
    var desk = window.SITE_WORKBENCH || {};
    var projects = window.SITE_PROJECTS || [];
    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text;
      return n;
    }
    function a(text, href) {
      var n = el("a", "", text);
      n.href = href;
      return n;
    }
    function empty(target, text) {
      if (target)
        target.append(
          el(/^(UL|OL)$/.test(target.tagName) ? "li" : "p", "room-empty", text),
        );
    }
    function renderLife(target, entries, message) {
      if (!target) return;
      if (!Array.isArray(entries) || !entries.length) {
        empty(target, message);
        return;
      }
      entries.forEach(function (item) {
        var row = el("article", "life-item");
        row.append(el("h3", "", item.title || "未命名"));
        if (item.creator) row.append(el("p", "room-meta", item.creator));
        if (item.note) row.append(el("p", "", item.note));
        if (
          typeof item.progress === "number" &&
          item.progress >= 0 &&
          item.progress <= 100
        ) {
          var progress = el("progress");
          progress.max = 100;
          progress.value = item.progress;
          progress.setAttribute("aria-label", (item.title || "") + " 进度");
          row.append(progress, el("span", "room-meta", item.progress + "%"));
        }
        target.append(row);
      });
    }
    var doing = document.getElementById("now-doing");
    if (doing)
      (desk.focus || []).forEach(function (item) {
        var project = projects.find(function (p) {
          return p.id === item.projectId;
        });
        if (!project) return;
        var li = el("li");
        li.append(
          el("h3", "", project.title),
          el("p", "", item.description),
          a("看看作品 →", "project.html?id=" + encodeURIComponent(project.id)),
        );
        doing.append(li);
      });
    var nowReadingEl = document.getElementById("now-reading");
    if (nowReadingEl) {
      if (Array.isArray(life.reading) && life.reading.length) {
        renderLife(nowReadingEl, life.reading, "还没有公开的在读记录。");
      } else {
        var readingPanel = nowReadingEl.closest(".room-panel");
        if (readingPanel) readingPanel.hidden = true;
      }
    }
    var nowListeningEl = document.getElementById("now-listening");
    if (nowListeningEl) {
      if (Array.isArray(life.listening) && life.listening.length) {
        renderLife(nowListeningEl, life.listening, "还没有公开的在听记录。");
      } else {
        var listeningPanel = nowListeningEl.closest(".room-panel");
        if (listeningPanel) listeningPanel.hidden = true;
      }
    }
    var notDoing = document.getElementById("now-not-doing");
    if (notDoing) {
      (house.notDoing || []).forEach(function (text) {
        notDoing.append(el("li", "", text));
      });
      var hasReading = Array.isArray(life.reading) && life.reading.length > 0;
      var hasListening =
        Array.isArray(life.listening) && life.listening.length > 0;
      var notDoingPanel = notDoing.closest(".room-panel");
      if (notDoingPanel && !hasReading && !hasListening) {
        notDoingPanel.classList.add("room-panel-full");
        var kicker = notDoingPanel.querySelector(".room-kicker");
        if (kicker) kicker.textContent = "02 / NOT NOW";
      }
    }
    var software = document.getElementById("uses-software");
    if (software)
      ((house.tools || {}).software || []).forEach(function (item) {
        var li = el("li");
        li.append(
          el("h3", "", item.title),
          el("p", "", item.reason),
          el("p", "room-meta", "依据：" + item.source),
        );
        software.append(li);
      });
    var hardware = document.getElementById("uses-hardware");
    if (hardware) {
      var devices = (house.tools || {}).hardware || [];
      if (!devices.length) {
        var hwSection = hardware.closest(".room-section");
        if (hwSection) hwSection.hidden = true;
      }
      devices.forEach(function (item) {
        var li = el("li");
        li.append(el("h3", "", item.title), el("p", "", item.reason));
        hardware.append(li);
      });
    }
    var defaults = document.getElementById("uses-defaults");
    if (defaults) {
      var defaultItems = (house.tools || {}).defaults || [];
      var hasAnyDefault = defaultItems.some(function (item) {
        return typeof item.value === "string" && item.value.trim().length > 0;
      });
      if (!hasAnyDefault) {
        var defSection = defaults.closest(".room-section");
        if (defSection) defSection.hidden = true;
      } else {
        defaultItems.forEach(function (item) {
          var row = el("div");
          row.append(
            el("dt", "", item.title),
            el(
              "dd",
              "",
              typeof item.value === "string" && item.value.trim()
                ? item.value.trim()
                : "待补充",
            ),
          );
          defaults.append(row);
        });
      }
    }
    ["reading", "listening", "watching"].forEach(function (key) {
      renderLife(
        document.getElementById("life-" + key),
        life[key],
        "这个位置先留着，等一条真实记录。",
      );
    });
    var photos = document.getElementById("life-photos");
    if (photos) {
      var entries = Array.isArray(life.photos) ? life.photos : [];
      var photoHelp = document.getElementById("life-photo-help");
      if (photoHelp) photoHelp.hidden = !entries.length;
      if (!entries.length)
        empty(photos, "相册还没有公开照片。以后把愿意留下的日常放在这里。");
      entries.forEach(function (item) {
        if (
          typeof item.src !== "string" ||
          !/^assets\/images\/[\w/.-]+\.(png|jpe?g|webp|avif)$/i.test(
            item.src,
          ) ||
          item.src.indexOf("..") !== -1
        )
          return;
        var figure = el("figure");
        var link = a("", item.src);
        link.dataset.imagePreview = "";
        link.dataset.imageCaption = item.caption || "生活照片";
        var img = el("img");
        img.src = item.src;
        img.alt = item.caption || "生活照片";
        img.loading = "lazy";
        if (item.width > 0) img.width = item.width;
        if (item.height > 0) img.height = item.height;
        link.append(img);
        figure.append(link, el("figcaption", "", item.caption || "生活照片"));
        photos.append(figure);
      });
    }
    function resourceList(target, items, missing) {
      if (!target) return;
      if (!items || !items.length) {
        empty(target, missing);
        return;
      }
      items.forEach(function (item) {
        var url;
        try {
          url = new URL(item.url);
        } catch (e) {
          return;
        }
        if (url.protocol !== "https:" || url.username || url.password) return;
        var li = el("li");
        var link = a(item.title + " ↗", url.href);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        li.append(el("h3"));
        li.firstChild.append(link);
        li.append(el("p", "", item.reason));
        if (item.nowUrl && /^https:\/\//.test(item.nowUrl)) {
          var now = a("对方近况 ↗", item.nowUrl);
          now.target = "_blank";
          now.rel = "noopener noreferrer";
          li.append(now);
        }
        target.append(li);
      });
    }
    var friendsList = document.getElementById("links-friends");
    if (friendsList) {
      if (Array.isArray(house.friends) && house.friends.length) {
        resourceList(friendsList, house.friends, "");
      } else {
        var friendsSection = friendsList.closest(".room-section");
        if (friendsSection) friendsSection.hidden = true;
      }
    }
    resourceList(
      document.getElementById("links-resources"),
      house.resources,
      "暂时没有整理的资源。",
    );
    var palette = document.getElementById("colophon-palette");
    if (palette)
      [
        ["瓷白", "#FAF9F7"],
        ["墨色", "#222222"],
        ["正文", "#333333"],
        ["小字", "#9CA3AF"],
        ["薄荷", "#EFF6F4"],
        ["浅杏", "#FBF6F1"],
      ].forEach(function (entry) {
        var b = el("button", "palette-swatch");
        b.type = "button";
        b.setAttribute("aria-label", "复制" + entry[0] + "色值 " + entry[1]);
        var color = el("i", "swatch-color");
        color.style.backgroundColor = entry[1];
        color.setAttribute("aria-hidden", "true");
        b.append(color, el("strong", "", entry[0]), el("code", "", entry[1]));
        scope.listen(b, "click", async function () {
          var result = document.getElementById("palette-status");
          function feedback(message) {
            if (window.SITE_FEEDBACK) {
              result.removeAttribute("role");
              result.setAttribute("aria-live", "off");
            }
            result.textContent = message;
            if (window.SITE_FEEDBACK) window.SITE_FEEDBACK.show(message);
          }
          try {
            if (!navigator.clipboard || !navigator.clipboard.writeText)
              throw new Error("clipboard unavailable");
            await navigator.clipboard.writeText(entry[1]);
            feedback("已复制 " + entry[0] + " " + entry[1]);
          } catch (e) {
            feedback("复制不可用，请手动复制：" + entry[1]);
          }
        });
        palette.append(b);
      });
    var changelog = document.getElementById("colophon-changelog");
    if (changelog) {
      var updates = desk.updates || [];
      function buildLogEntry(item) {
        var row = el("article", "room-changelog-entry");
        var time = el("time", "room-meta", item.date + " / v" + item.version);
        time.dateTime = item.date;
        var ul = el("ul");
        (item.changes || []).forEach(function (text) {
          ul.append(el("li", "", text));
        });
        row.append(time, el("h3", "", item.title), ul);
        return row;
      }
      updates.slice(0, 6).forEach(function (item) {
        changelog.append(buildLogEntry(item));
      });
      if (updates.length > 6) {
        var older = updates.slice(6);
        var details = el("details", "room-changelog-archive");
        details.append(
          el(
            "summary",
            "",
            "展开更早的 " + older.length + " 条历史版本记录",
          ),
        );
        var archiveBody = el("div", "room-changelog-archive-list");
        older.forEach(function (item) {
          archiveBody.append(buildLogEntry(item));
        });
        details.append(archiveBody);
        changelog.append(details);
      }
    }
    document.querySelectorAll("[data-room-updated]").forEach(function (node) {
      node.textContent = desk.updated || house.updated;
      node.setAttribute("datetime", desk.updated || house.updated);
    });
    // Renumber room section kickers only when at least one sibling section was hidden.
    var allSections = Array.from(
      document.querySelectorAll(".room-page .room-section"),
    );
    var hasHiddenSection = allSections.some(function (section) {
      return section.hidden;
    });
    if (hasHiddenSection) {
      allSections
        .filter(function (section) {
          return !section.hidden;
        })
        .forEach(function (section, index) {
          var kicker = section.querySelector(".room-section-head .room-kicker");
          if (kicker && /^\d{2}\s*\//.test(kicker.textContent)) {
            kicker.textContent = kicker.textContent.replace(
              /^\d{2}/,
              String(index + 1).padStart(2, "0"),
            );
          }
        });
    }
  })();
}
