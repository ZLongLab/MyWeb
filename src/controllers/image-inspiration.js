// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
import "../../assets/image-inspiration-data.js";
import "../../assets/image-inspiration-core.js";
export default function initialize(scope) {
  (function () {
    "use strict";
    var items = window.IMAGE_INSPIRATION,
      core = window.IMAGE_CORE;
    if (!items || !core) return;
    var ids = items.map(function (i) {
        return i.id;
      }),
      byId = Object.fromEntries(
        items.map(function (i) {
          return [i.id, i];
        }),
      );
    var key = "myweb_image_inspiration_v1",
      state = { version: 1, favorites: [] },
      category = "全部",
      onlyFavorites = false,
      selected = null,
      trigger = null,
      locked = false;
    var $ = function (id) {
        return document.getElementById(id);
      },
      dialog = $("image-detail"),
      output = $("image-prompt-text");
    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text;
      return n;
    }
    function status(text, error) {
      $("image-status").textContent = text;
      $("image-status").classList.toggle("is-error", !!error);
    }
    function read() {
      var raw = localStorage.getItem(key);
      return raw === null
        ? { version: 1, favorites: [] }
        : core.validate(JSON.parse(raw), ids);
    }
    try {
      state = read();
    } catch (e) {
      locked = true;
      status("收藏保存暂不可用，浏览与复制仍可使用；原有数据未改动。", true);
    }
    function commit(change) {
      if (!scope.active) return false;
      try {
        if (locked)
          throw Error("收藏数据暂不可写，请先检查当前浏览器的站点存储。");
        var fresh = read(),
          next = core.validate(change(fresh), ids);
        localStorage.setItem(key, JSON.stringify(next));
        state = next;
        render();
        updateFavorite();
        return true;
      } catch (e) {
        status(
          e.name === "QuotaExceededError"
            ? "浏览器存储空间不足，本次未保存。"
            : "未保存：" + e.message,
          true,
        );
        return false;
      }
    }
    function toggle(id) {
      var success = commit(function (fresh) {
        return {
          version: 1,
          favorites: fresh.favorites.includes(id)
            ? fresh.favorites.filter(function (i) {
                return i !== id;
              })
            : fresh.favorites.concat(id),
        };
      });
      if (success)
        status(
          state.favorites.includes(id) ? "已加入本地收藏。" : "已从收藏移除。",
        );
    }
    function updateFavorite() {
      if (!selected) return;
      var saved = state.favorites.includes(selected);
      $("image-dialog-save").setAttribute("aria-pressed", String(saved));
      $("image-dialog-save").textContent = saved
        ? "已收藏 · 取消"
        : "收藏这个起点";
    }
    function updateURL(id) {
      try {
        var url = new URL(location.href);
        if (id) url.searchParams.set("example", id);
        else url.searchParams.delete("example");
        history.replaceState(null, "", url);
      } catch (e) {
        /* file:// can still browse the dialog. */
      }
    }
    function source(item) {
      var box = $("image-attribution");
      box.replaceChildren();
      if (!item.source) {
        box.append(el("p", "", "提示词：本站编写。配图：本站原创构图示意。"));
        return;
      }
      box.append(
        el(
          "p",
          "",
          "参考改写 · " + item.source.author + " · " + item.source.license,
        ),
        el("p", "", item.source.changes),
      );
      [
        ["原作者帖子 ↗", item.source.url],
        ["收录案例 ↗", item.source.caseURL],
        ["许可 ↗", "https://creativecommons.org/licenses/by/4.0/"],
      ].forEach(function (row) {
        var a = el("a", "", row[0]);
        a.href = row[1];
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        box.append(a, document.createTextNode("　"));
      });
    }
    function open(id, from) {
      var item = byId[id];
      if (!item) return;
      selected = id;
      trigger = from || null;
      $("image-detail-title").textContent = item.title;
      $("image-detail-category").textContent =
        item.category + " / " + (item.source ? "参考改写" : "本站编写");
      $("image-detail-art").src = "assets/images/inspiration/" + id + ".svg";
      $("image-detail-art").alt = item.title + "的原创构图示意";
      $("image-detail-summary").textContent = item.summary;
      $("image-palette").textContent = item.palette;
      $("image-look").textContent = item.look;
      output.value = core.compose(item);
      $("image-dialog-status").textContent = "";
      $("image-video-link").href =
        "video-prompts.html?template=" + encodeURIComponent(item.video);
      source(item);
      updateFavorite();
      updateURL(id);
      if (!dialog.open) dialog.showModal();
    }
    function render() {
      var filtered = core.filter(
        items,
        category,
        $("image-search").value,
        state.favorites,
        onlyFavorites,
      );
      $("image-result-count").textContent =
        "显示 " +
        filtered.length +
        " / " +
        items.length +
        " 个起点" +
        (onlyFavorites ? " · 我的收藏" : "");
      var list = $("image-card-list");
      list.replaceChildren();
      filtered.forEach(function (item) {
        var card = el("article", "image-room-card");
        card.dataset.example = item.id;
        var button = el("button", "image-room-open");
        button.type = "button";
        button.setAttribute("aria-label", "查看「" + item.title + "」");
        var art = el("span", "image-room-art"),
          img = el("img");
        img.src = "assets/images/inspiration/" + item.id + ".svg";
        img.alt = item.title + "的构图示意";
        img.width = 500;
        img.height = 350;
        img.loading = "lazy";
        img.decoding = "async";
        art.append(img, el("span", "image-room-badge", "构图示意"));
        var copy = el("span", "image-room-copy");
        copy.append(
          el(
            "span",
            "image-room-category",
            item.category + " / " + (item.source ? "参考改写" : "本站编写"),
          ),
          el("span", "image-room-card-title", item.title),
          el("span", "image-room-summary", item.summary),
        );
        button.append(art, copy);
        scope.listen(button, "click", function () {
          open(item.id, button);
        });
        var bottom = el("div", "image-room-card-bottom"),
          save = el(
            "button",
            "image-room-save",
            state.favorites.includes(item.id) ? "★ 已收藏" : "☆ 收藏",
          );
        save.type = "button";
        save.setAttribute(
          "aria-pressed",
          String(state.favorites.includes(item.id)),
        );
        save.setAttribute(
          "aria-label",
          (state.favorites.includes(item.id) ? "取消收藏" : "收藏") +
            "「" +
            item.title +
            "」",
        );
        scope.listen(save, "click", function () {
          toggle(item.id);
        });
        bottom.append(
          el("span", "image-room-open-hint", "查看提示词 ↗"),
          save,
        );
        card.append(button, bottom);
        list.append(card);
      });
      $("image-no-results").hidden = filtered.length !== 0;
    }
    document.querySelectorAll("[data-image-category]").forEach(function (b) {
      scope.listen(b, "click", function () {
        category = b.dataset.imageCategory;
        document
          .querySelectorAll("[data-image-category]")
          .forEach(function (x) {
            x.setAttribute("aria-pressed", String(x === b));
          });
        render();
      });
    });
    scope.listen($("image-only-favorites"), "click", function () {
      onlyFavorites = !onlyFavorites;
      $("image-only-favorites").setAttribute(
        "aria-pressed",
        String(onlyFavorites),
      );
      render();
    });
    scope.listen($("image-search"), "input", render);
    scope.listen($("image-reset"), "click", function () {
      category = "全部";
      onlyFavorites = false;
      $("image-search").value = "";
      $("image-only-favorites").setAttribute("aria-pressed", "false");
      document.querySelectorAll("[data-image-category]").forEach(function (x) {
        x.setAttribute(
          "aria-pressed",
          String(x.dataset.imageCategory === "全部"),
        );
      });
      render();
      $("image-search").focus();
    });
    scope.listen($("image-dialog-save"), "click", function () {
      if (selected) toggle(selected);
    });
    scope.listen($("image-copy"), "click", async function () {
      var copied = false;
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText)
          throw Error("clipboard unavailable");
        await navigator.clipboard.writeText(output.value);
        copied = true;
      } catch (e) {
        output.focus();
        output.select();
        try {
          copied = document.execCommand("copy");
        } catch (ignore) {}
      }
      $("image-dialog-status").textContent = copied
        ? "已复制。可以粘贴到优化器或你使用的图片模型。"
        : "已选中文字，请手动复制；浏览器没有开放自动复制。";
    });
    scope.listen(dialog, "close", function () {
      selected = null;
      updateURL(null);
      if (trigger && trigger.isConnected) trigger.focus();
      else $("image-search").focus();
    });
    scope.listen($("image-export"), "click", function () {
      try {
        var exportState = read(),
          blob = new Blob([JSON.stringify(exportState, null, 2)], {
            type: "application/json",
          }),
          url = scope.url(blob),
          a = el("a");
        a.href = url;
        a.download =
          "图片灵感收藏-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.append(a);
        a.click();
        a.remove();
        scope.timeout(function () {
          URL.revokeObjectURL(url);
        }, 1000);
        status("已导出收藏编号，不包含 API 或其他模块的数据。");
      } catch (e) {
        status("导出失败：" + e.message, true);
      }
    });
    scope.listen($("image-import"), "click", function () {
      $("image-import-file").click();
    });
    scope.listen($("image-import-file"), "change", async function () {
      var file = this.files[0];
      this.value = "";
      if (!file) return;
      try {
        if (file.size > 65536) throw Error("文件超过 64 KB。");
        var incoming = core.validate(JSON.parse(await file.text()), ids);
        if (
          commit(function (fresh) {
            return core.merge(fresh, incoming, ids);
          })
        )
          status("已合并收藏，保留原有收藏。");
      } catch (e) {
        status("未导入：" + e.message, true);
      }
    });
    scope.listen(window, "storage", function (e) {
      if (e.key === key || e.key === null) {
        try {
          state = read();
          locked = false;
          render();
          updateFavorite();
        } catch (ignore) {
          locked = true;
          status("收藏数据发生变化，暂不覆盖原有内容。", true);
        }
      }
    });
    document.querySelectorAll("[data-image-example]").forEach(function (a) {
      scope.listen(a, "click", function (e) {
        e.preventDefault();
        open(a.dataset.imageExample, a);
      });
    });
    render();
    var initial = new URLSearchParams(location.search).get("example");
    if (ids.includes(initial)) open(initial, null);
  })();
}
