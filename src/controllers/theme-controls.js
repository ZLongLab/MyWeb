// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
export default function initialize(scope) {
  (function () {
    "use strict";

    if (window.SITE_THEME) return;
    var root = document.documentElement;
    var navigation = document.getElementById("site-nav");
    var themeKey = "myweb_theme_v1";
    var seasonKey = "myweb_season_v1";
    var seasonNames = {
      spring: "春 · 青瓷",
      summer: "夏 · 松针",
      autumn: "秋 · 陶土",
      winter: "冬 · 雾蓝",
    };
    var paperColors = {
      spring: "#f9faf8",
      summer: "#faf9f7",
      autumn: "#faf9f7",
      winter: "#f8f9fa",
    };
    var seasonPreference = "auto";

    function isTheme(value) {
      return value === "paper" || value === "night";
    }
    function isSeason(value) {
      return Object.prototype.hasOwnProperty.call(seasonNames, value);
    }
    function timeDefault() {
      var hour = new Date().getHours();
      return hour >= 20 || hour < 6 ? "night" : "paper";
    }
    function dateSeason() {
      var month = new Date().getMonth() + 1;
      return month >= 3 && month <= 5
        ? "spring"
        : month >= 6 && month <= 8
          ? "summer"
          : month >= 9 && month <= 11
            ? "autumn"
            : "winter";
    }
    function readPreference(key) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    }
    function savePreference(key, value) {
      try {
        if (value === "auto") localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch (error) {
        /* The current page still works when browser storage is restricted. */
      }
    }
    function updateMeta() {
      var color = document.querySelector('meta[name="theme-color"]');
      if (color) color.content = paperColors[root.dataset.season] || "#faf9f7";
    }

    // The main site uses a unified light porcelain-warm palette; omit the legacy
    // dark-mode toggle from the header so visitors never click an inactive switch.
    var button = navigation && navigation.querySelector(".nav-theme");
    var shape = button ? button.querySelector("path") : null;
    var label = button ? button.querySelector(".nav-theme-label") : null;

    function applyTheme(theme, persist) {
      var mode = isTheme(theme) ? theme : timeDefault();
      root.dataset.theme = mode;
      root.style.colorScheme = "light";
      updateMeta();
      var night = mode === "night";
      var action = night ? "切换为纸色模式" : "切换为夜色模式";
      if (button) {
        button.setAttribute("aria-pressed", String(night));
        button.setAttribute("aria-label", action);
        button.title = action;
      }
      if (label) label.textContent = night ? "切换纸色" : "切换夜色";
      if (shape)
        shape.setAttribute(
          "d",
          night
            ? "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
            : "M20.3 14.1A8.2 8.2 0 0 1 9.9 3.7 8.3 8.3 0 1 0 20.3 14.1Z",
        );
      if (persist) savePreference(themeKey, mode);
      document.dispatchEvent(
        new CustomEvent("myweb:theme-change", {
          detail: { theme: mode, manual: Boolean(persist) },
        }),
      );
      return mode;
    }

    function applySeason(preference, persist) {
      seasonPreference = isSeason(preference) ? preference : "auto";
      var season =
        seasonPreference === "auto" ? dateSeason() : seasonPreference;
      root.dataset.season = season;
      root.dataset.seasonPreference = seasonPreference;
      document
        .querySelectorAll("[data-season-picker]")
        .forEach(function (picker) {
          picker.value = seasonPreference;
        });
      document
        .querySelectorAll("[data-season-status]")
        .forEach(function (status) {
          status.textContent =
            (seasonPreference === "auto" ? "随本地月份：" : "已固定：") +
            seasonNames[season] +
            "。房间的身份色保持不变。";
        });
      updateMeta();
      if (persist) savePreference(seasonKey, seasonPreference);
      document.dispatchEvent(
        new CustomEvent("myweb:season-change", {
          detail: {
            season: season,
            preference: seasonPreference,
            manual: Boolean(persist),
          },
        }),
      );
      return season;
    }

    window.SITE_THEME = {
      getTheme: function () {
        return root.dataset.theme;
      },
      setTheme: function (theme) {
        return isTheme(theme) ? applyTheme(theme, true) : false;
      },
      toggleTheme: function () {
        return applyTheme(
          root.dataset.theme === "night" ? "paper" : "night",
          true,
        );
      },
      getSeason: function () {
        return root.dataset.season;
      },
      getSeasonPreference: function () {
        return seasonPreference;
      },
      setSeason: function (season) {
        return season === "auto" || isSeason(season)
          ? applySeason(season, true)
          : false;
      },
    };

    var storedTheme = readPreference(themeKey);
    var storedSeason = readPreference(seasonKey);
    applySeason(isSeason(storedSeason) ? storedSeason : "auto", false);
    applyTheme(
      isTheme(storedTheme)
        ? storedTheme
        : isTheme(root.dataset.theme)
          ? root.dataset.theme
          : timeDefault(),
      false,
    );
    if (button) scope.listen(button, "click", window.SITE_THEME.toggleTheme);
    document
      .querySelectorAll("[data-season-picker]")
      .forEach(function (picker) {
        scope.listen(picker, "change", function () {
          window.SITE_THEME.setSeason(picker.value);
        });
      });
    scope.listen(window, "storage", function (event) {
      if (event.key === themeKey)
        applyTheme(
          isTheme(event.newValue) ? event.newValue : timeDefault(),
          false,
        );
      if (event.key === seasonKey)
        applySeason(isSeason(event.newValue) ? event.newValue : "auto", false);
      if (event.key === null) {
        applySeason("auto", false);
        applyTheme(timeDefault(), false);
      }
    });
  })();
}
