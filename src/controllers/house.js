// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
export default function initialize(scope) {
  (function () {
    "use strict";
    var data = window.SITE_HOUSE || {};
    var rooms = Array.isArray(data.rooms) ? data.rooms : [];
    var workbench = window.SITE_WORKBENCH || {};
    var page = document.body.dataset.page;
    var roomId =
      page === "project" ? "projects" : page === "article" ? "articles" : page;
    document.body.dataset.room = roomId || "home";
    if (page === "article") {
      var printedMain = document.querySelector("main");
      if (printedMain)
        printedMain.dataset.printDate = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Shanghai",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date());
    }
    function el(tag, cls, text) {
      var node = document.createElement(tag);
      if (cls) node.className = cls;
      if (text !== undefined) node.textContent = text;
      return node;
    }
    function link(label, href, cls) {
      var a = el("a", cls, label);
      a.href = href;
      return a;
    }
    var labels = {
      spring: "春 · 青瓷",
      summer: "夏 · 松针",
      autumn: "秋 · 陶土",
      winter: "冬 · 雾蓝",
    };
    function updateClock() {
      var now = new Date();
      var formatter = new Intl.DateTimeFormat("zh-CN", {
        timeZone: data.timeZone || "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      });
      var value = formatter.format(now);
      var hour = Number(value.split(":")[0]);
      document.querySelectorAll("[data-local-clock]").forEach(function (node) {
        node.textContent =
          node.tagName === "TIME" ? value : "ZL 这里现在是 " + value;
        if (node.tagName === "TIME") node.dateTime = value;
      });
      document.querySelectorAll("[data-owner-status]").forEach(function (node) {
        node.textContent =
          hour >= 23 || hour < 7 ? "夜间 · 休息时段" : "日间 · 创造时段";
        node.title = "仅按上海本地时段显示，不代表实时在线状态";
      });
      var season = document.documentElement.dataset.season || "autumn";
      var greeting = {
        spring: "春意正好，留一点时间让想法发芽。",
        summer: "把日子放慢一点，把想法做出来。",
        autumn: "收好一点灵感，慢慢把它做成东西。",
        winter: "外面冷，进来坐一会儿。",
      }[season];
      if (hour >= 20 || hour < 6)
        greeting = {
          spring: "春夜安静，给明天留一颗种子。",
          summer: "夏夜有风，慢慢看，别着急。",
          autumn: "秋夜灯亮，手边还有一点未完的想法。",
          winter: "冬夜灯暖，先让自己歇一会儿。",
        }[season];
      document
        .querySelectorAll("[data-season-greeting]")
        .forEach(function (node) {
          node.textContent = greeting;
        });
      document
        .querySelectorAll("[data-current-season]")
        .forEach(function (node) {
          node.textContent = labels[season];
        });
      document.dispatchEvent(
        new CustomEvent("myweb:clock-change", {
          detail: { hour: hour, time: value },
        }),
      );
    }
    updateClock();
    document.querySelectorAll("[data-house-quote]").forEach(function (node) {
      if (data.quote) node.textContent = data.quote;
    });
    var heatmap = document.querySelector("[data-heatmap]");
    if (heatmap && "IntersectionObserver" in window) {
      var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      var heatmapSeen = true;
      try {
        heatmapSeen = sessionStorage.getItem("myweb_heatmap_played_v1") === "1";
      } catch (error) {
        /* Without session storage, leave this optional animation quiet. */
      }
      if (!reducedMotion.matches && !heatmapSeen) {
        var heatmapObserver = scope.observer(
          function (entries) {
            if (
              entries.some(function (entry) {
                return entry.isIntersecting;
              })
            ) {
              try {
                sessionStorage.setItem("myweb_heatmap_played_v1", "1");
                heatmap.classList.add("is-growing");
              } catch (error) {
                /* Restricted storage keeps the chart static. */
              }
              heatmapObserver.disconnect();
            }
          },
          { threshold: 0.15 },
        );
        heatmapObserver.observe(heatmap);
        scope.listen(
          window,
          "pagehide",
          function () {
            heatmapObserver.disconnect();
          },
          { once: true },
        );
        scope.listen(reducedMotion, "change", function (event) {
          if (event.matches) {
            heatmapObserver.disconnect();
            heatmap.classList.remove("is-growing");
          }
        });
      }
    }
    var clockTimer = null;
    function startClock() {
      if (!clockTimer && !document.hidden)
        clockTimer = scope.interval(updateClock, 30000);
    }
    function stopClock() {
      clearInterval(clockTimer);
      clockTimer = null;
    }
    scope.listen(document, "visibilitychange", function () {
      if (document.hidden) stopClock();
      else {
        updateClock();
        startClock();
      }
    });
    scope.listen(window, "pagehide", stopClock);
    scope.listen(window, "pageshow", startClock);
    scope.listen(document, "myweb:season-change", updateClock);
    startClock();
    var snapshot = window.SITE_SNAPSHOT || {};
    var reviewed = snapshot.reviewedAt;
    var age = reviewed
      ? Math.floor(
          (Date.now() - Date.parse(reviewed + "T00:00:00+08:00")) / 86400000,
        )
      : Infinity;
    document
      .querySelectorAll("[data-snapshot-review]")
      .forEach(function (node) {
        node.textContent = !reviewed
          ? "GitHub 快照尚未核对，请运行本地快照脚本。"
          : age > 14
            ? "GitHub 快照已超过 14 天，请人工核对后更新。上次核对 " + reviewed
            : "GitHub 快照已核对：" + reviewed + "。页面不会实时请求 GitHub。";
        node.classList.toggle("is-stale", age > 14);
        if (snapshot.github && snapshot.github.status === "ready") {
          node.textContent +=
            " 范围 " +
            snapshot.github.from +
            " 至 " +
            snapshot.github.to +
            "，共 " +
            snapshot.github.total +
            " 次公开贡献。";
        }
      });
    // 现有截图查看器继续接管链接，仅给内页图片加同一套窗口外框。
    document
      .querySelectorAll(
        'body:not([data-page="home"]) .portfolio-image, body:not([data-page="home"]) .project-image-link',
      )
      .forEach(function (frame) {
        if (frame.querySelector(".room-window-bar")) return;
        frame.classList.add("room-window");
        var bar = el("span", "room-window-bar");
        bar.setAttribute("aria-hidden", "true");
        bar.append(
          el("i"),
          el("i"),
          el("i"),
          el("span", "", "有间 / 作品界面"),
        );
        frame.prepend(bar);
      });
  })();
}
