// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
import "../../assets/video-templates.js";
import "../../assets/video-dialects.js";
import "../../assets/video-lexicon.js";
import "../../assets/video-prompts-core.js";
export default function initialize(scope) {
  (function () {
    "use strict";
    var templates = window.VIDEO_TEMPLATES,
      core = window.VIDEO_CORE;
    if (!templates || !core) return;
    var byId = Object.fromEntries(
        templates.map(function (t) {
          return [t.id, t];
        }),
      ),
      ids = Object.keys(byId);
    var key = "myweb_video_studio_v1",
      state = core.empty(),
      locked = false,
      originalRaw = null;
    var selected = ids.includes(
      new URLSearchParams(location.search).get("template"),
    )
      ? new URLSearchParams(location.search).get("template")
      : "cinematic";
    var platform = byId[selected].platform === '通用' ? 'generic' : byId[selected].platform || 'seedance';
    var category = "全部",
      mode = "draft",
      manual = false,
      dirty = false,
      draftId = null;
    var $ = function (id) {
      return document.getElementById(id);
    };
    var form = $("prompt-form"),
      output = $("prompt-output");
    function node(tag, className, text) {
      var e = document.createElement(tag);
      if (className) e.className = className;
      if (text !== undefined) e.textContent = text;
      return e;
    }
    function status(message, error) {
      if ($("prompt-status").textContent !== message)
        $("prompt-status").textContent = message;
      $("prompt-status").classList.toggle("is-error", !!error);
    }
    function read() {
      var raw = localStorage.getItem(key);
      return raw === null ? core.empty() : core.validate(JSON.parse(raw), ids);
    }
    try {
      originalRaw = localStorage.getItem(key);
      state = read();
    } catch (error) {
      locked = true;
    }
    function commit(change) {
      if (!scope.active) return false;
      try {
        if (locked)
          throw Error(
            "本地保存暂不可用，请先导出已有资料；你的输入仍可复制使用。",
          );
        var fresh = read();
        var next = core.validate(change(fresh), ids);
        localStorage.setItem(key, JSON.stringify(next));
        state = next;
        renderCards();
        renderDrafts();
        return true;
      } catch (error) {
        status(
          error.name === "QuotaExceededError"
            ? "浏览器存储空间不足，未保存。请复制结果或导出已有资料。"
            : "未保存：" + error.message,
          true,
        );
        return false;
      }
    }
    function fields() {
      return Object.fromEntries(
        core.fields.map(function (name) {
          return [name, form.elements[name].value.trim()];
        }),
      );
    }
    function count() {
      $("prompt-output-count").textContent = output.value.length + " 字符";
    }
    function renderOutput(force) {
      if (manual && !force) {
        $("prompt-output-state").textContent = "表单有变化 · 点“重新整理”更新";
        return;
      }
      output.value = core.compose(byId[selected], fields(), mode, platform);
      manual = false;
      $("prompt-output-state").textContent = "已按填写内容整理";
      count();
    }
    function modes() {
      document
        .querySelectorAll("[data-output-mode]")
        .forEach(function (button) {
          button.setAttribute(
            "aria-pressed",
            String(button.dataset.outputMode === mode),
          );
        });
      $("prompt-output-label").textContent =
        mode === "draft"
          ? "可编辑的文字草稿。你可以直接修改，再复制到视频平台试用。"
          : "把这段指令复制给 ChatGPT 或其他对话 AI，完善后再去视频平台使用。";
      $("prompt-copy").textContent =
        mode === "draft" ? "复制提示词草稿 ↗" : "复制给 AI 完善 ↗";
    }
    function updateUrl() {
      try {
        var url = new URL(location.href);
        url.searchParams.set("template", selected);
        history.replaceState(null, "", url);
      } catch (error) {
        /* Direct file opening can still use the form. */
      }
    }
    function discard() {
      return (
        !dirty ||
        window.confirm("当前有尚未保存的填写或编辑。继续会替换它们，是否继续？")
      );
    }
    function select(id, example, initial) {
      if (!initial && !discard()) return false;
      selected = id;
      draftId = null;
      manual = false;
      dirty = false;
      $("prompt-template-title").textContent = byId[id].title;
      $("prompt-template-description").textContent = byId[id].description;
      $("prompt-extra-label").textContent = byId[id].extraLabel;
      $("prompt-extra-hint").textContent = byId[id].extraHint;
      core.fields.forEach(function (name) {
        form.elements[name].value = example
          ? byId[id].example[name] || ""
          : name === "look"
            ? byId[id].look
            : "";
      });
      $("prompt-tips").replaceChildren(
        ...byId[id].tips.map(function (text) {
          return node("li", "", text);
        }),
      );
      $("prompt-pitfalls").replaceChildren(
        ...byId[id].pitfalls.map(function (text) {
          return node("li", "", text);
        }),
      );
      $("prompt-source").href =
        byId[id].sourceUrl ||
        "https://github.com/LearnPrompt/awesome-seedance/blob/main/docs/templates/zh/" +
        byId[id].source +
        ".md";
      renderCards();
      modes();
      renderOutput(true);
      updateUrl();
      if (!initial)
        status(
          example
            ? "已填入本站编写的示例，可以改成自己的想法。"
            : "已切换到" + byId[id].title + "。填写主体、场景和动作即可开始。",
        );
      return true;
    }
    function renderCards() {
      var query = $("prompt-search").value.trim().toLocaleLowerCase();
      var filtered = templates.filter(function (t) {
        return (
          core.supportsPlatform(t, platform) &&
          (category === "全部" ||
            (category === "收藏"
              ? state.favorites.includes(t.id)
              : t.family === category)) &&
          (
            t.title +
            " " +
            t.family +
            " " +
            t.description +
            " " +
            t.tips.join(" ")
          )
            .toLocaleLowerCase()
            .includes(query)
        );
      });
      $("prompt-result-count").textContent =
        filtered.length +
        " 个模板" +
        (category === "收藏" ? " · 收藏只在本浏览器保存" : " · 选一个开始");
      $("prompt-template-list").replaceChildren(
        ...filtered.map(function (t) {
          var card = node(
            "div",
            "prompt-card" + (t.id === selected ? " is-selected" : ""),
          );
          card.dataset.tone = t.tone;
          var choose = node("button", "prompt-card-main");
          choose.type = "button";
          choose.dataset.template = t.id;
          choose.setAttribute("aria-pressed", String(t.id === selected));
          var number = node("span", "prompt-card-number", t.motif);
          number.setAttribute("aria-hidden", "true");
          var label = node("span", "");
          label.append(node("strong", "", t.title), node("small", "", t.en));
          choose.append(number, label);
          scope.listen(choose, "click", function () {
            if (t.id !== selected) select(t.id, false, false);
          });
          var favorite = node(
            "button",
            "prompt-favorite",
            state.favorites.includes(t.id) ? "★" : "☆",
          );
          favorite.type = "button";
          favorite.dataset.favorite = t.id;
          favorite.setAttribute(
            "aria-label",
            (state.favorites.includes(t.id) ? "取消收藏" : "收藏") + t.title,
          );
          favorite.setAttribute(
            "aria-pressed",
            String(state.favorites.includes(t.id)),
          );
          scope.listen(favorite, "click", function () {
            var saved = commit(function (fresh) {
              fresh.favorites = fresh.favorites.includes(t.id)
                ? fresh.favorites.filter(function (id) {
                    return id !== t.id;
                  })
                : fresh.favorites.concat(t.id);
              return fresh;
            });
            if (saved)
              status(
                state.favorites.includes(t.id)
                  ? "已在本浏览器收藏" + t.title + "。"
                  : "已取消收藏" + t.title + "。",
              );
          });
          card.append(choose, favorite);
          return card;
        }),
      );
      $("prompt-no-results").hidden = filtered.length !== 0;
      document
        .querySelectorAll("[data-prompt-filter]")
        .forEach(function (button) {
          button.setAttribute(
            "aria-pressed",
            String(button.dataset.promptFilter === category),
          );
        });
    }
    function renderDrafts() {
      $("prompt-drafts").replaceChildren(
        ...state.drafts
          .slice()
          .sort(function (a, b) {
            return b.updated.localeCompare(a.updated);
          })
          .map(function (draft) {
            var card = node("article", "prompt-draft");
            card.append(
              node("h3", "", draft.title),
              node(
                "p",
                "",
                byId[draft.template].title +
                  " · " +
                  new Date(draft.updated).toLocaleString("zh-CN"),
              ),
            );
            var actions = node("div", "prompt-draft-actions"),
              open = node("button", "prompt-text-button", "继续编辑 →"),
              remove = node("button", "prompt-text-button", "删除");
            open.type = remove.type = "button";
            open.dataset.draftOpen = draft.id;
            remove.dataset.draftDelete = draft.id;
            scope.listen(open, "click", function () {
              if (!discard()) return;
              var current = state.drafts.find(function (item) {
                return item.id === draft.id;
              });
              if (!current) return;
              platform = current.platform || 'seedance';
              $('prompt-platform').value = platform;
              select(current.template, false, true);
              core.fields.forEach(function (name) {
                form.elements[name].value = current.fields[name];
              });
              draftId = current.id;
              mode = current.mode;
              modes();
              output.value = current.output;
              manual = true;
              dirty = false;
              count();
              $("prompt-output-state").textContent = "已恢复保存版本";
              status("草稿已恢复，保存时会更新这一份。");
              $("prompt-editor-heading").focus();
            });
            scope.listen(remove, "click", function () {
              if (!window.confirm("删除这份草稿？建议先导出备份。")) return;
              if (
                commit(function (fresh) {
                  fresh.drafts = fresh.drafts.filter(function (d) {
                    return d.id !== draft.id;
                  });
                  return fresh;
                })
              ) {
                if (draftId === draft.id) {
                  draftId = null;
                  dirty = true;
                }
                status("草稿已删除。");
              }
            });
            actions.append(open, remove);
            card.append(actions);
            return card;
          }),
      );
      $("prompt-drafts-empty").hidden = state.drafts.length > 0;
      $("prompt-draft-count").textContent =
        state.drafts.length + " / 50 份 · 只保存在当前浏览器";
    }
    scope.listen($("prompt-search"), "input", renderCards);
    scope.listen($('prompt-platform'), 'change', function () {
      platform = $('prompt-platform').value;
      renderCards();
      renderOutput(true);
      dirty = true;
      status('已按' + window.VIDEO_PLATFORMS.find(function (item) { return item.id === platform; }).option + '重新整理，全部表单内容保留。' + (core.supportsPlatform(byId[selected], platform) ? '' : '当前编辑模板不在此平台列表中，可继续编辑或另选起点。'));
    });
    document
      .querySelectorAll("[data-prompt-filter]")
      .forEach(function (button) {
        scope.listen(button, "click", function () {
          category = button.dataset.promptFilter;
          renderCards();
        });
      });
    document.querySelectorAll('[data-video-vocabulary]').forEach(function (picker) {
      scope.listen(picker, 'change', function () {
        var field = form.elements[picker.dataset.videoVocabulary];
        var phrase = picker.value;
        picker.value = '';
        if (!field || !phrase) return;
        var next = field.value.trimEnd();
        next = next ? next + '；' + phrase : phrase;
        if (next.length > 1000) {
          status('当前字段加入词条后会超过 1000 字，请先精简原内容。', true);
          return;
        }
        field.value = next;
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    scope.listen(form, "submit", function (event) {
      event.preventDefault();
    });
    scope.listen(form, "input", function () {
      dirty = true;
      renderOutput(false);
      status("当前有未保存的修改。");
    });
    scope.listen(output, "input", function () {
      manual = true;
      dirty = true;
      count();
      $("prompt-output-state").textContent = "手动编辑中 · 不会自动覆盖";
    });
    scope.listen($("prompt-example"), "click", function () {
      if (select(selected, true, false)) dirty = true;
    });
    scope.listen($("prompt-clear"), "click", function () {
      select(selected, false, false);
    });
    scope.listen($("prompt-regenerate"), "click", function () {
      if (
        manual &&
        !window.confirm("重新整理将替换你在结果框中的手动修改，是否继续？")
      )
        return;
      renderOutput(true);
      dirty = true;
      status("已按当前填写内容重新整理。");
    });
    document.querySelectorAll("[data-output-mode]").forEach(function (button) {
      scope.listen(button, "click", function () {
        if (mode === button.dataset.outputMode) return;
        if (
          manual &&
          !window.confirm("切换输出类型将替换结果框中的手动修改，是否继续？")
        )
          return;
        mode = button.dataset.outputMode;
        modes();
        renderOutput(true);
        dirty = true;
      });
    });
    function complete() {
      if (!form.reportValidity()) {
        status("请先填写主体、场景和主要动作。", true);
        return false;
      }
      if (
        ["subject", "scene", "action"].some(function (name) {
          return !form.elements[name].value.trim();
        })
      ) {
        status("主体、场景和动作不能只填写空格。", true);
        return false;
      }
      if (!output.value.trim()) {
        status("结果框为空，请填写内容或重新整理。", true);
        output.focus();
        return false;
      }
      return true;
    }
    scope.listen($("prompt-copy"), "click", async function () {
      if (!complete()) return;
      if (
        manual &&
        $("prompt-output-state").textContent.includes("表单有变化")
      ) {
        status(
          "结果尚未同步表单。请先重新整理，或保留当前编辑内容并保存草稿。",
          true,
        );
        return;
      }
      try {
        if (navigator.clipboard && window.isSecureContext)
          await navigator.clipboard.writeText(output.value);
        else {
          output.focus();
          output.select();
          if (!document.execCommand("copy")) throw Error("copy unavailable");
        }
        status(
          "已复制" +
            (mode === "draft"
              ? "提示词草稿。到视频平台试用，或继续交给 AI 完善。"
              : "完善指令。粘贴到对话 AI 后再获取最终提示词。"),
        );
      } catch (error) {
        output.focus();
        output.select();
        status("未能自动复制，已选中全文，请按 Ctrl+C 或长按复制。", true);
      }
    });
    scope.listen($("prompt-save"), "click", function () {
      if (!complete()) return;
      var values = fields(),
        id =
          draftId ||
          (window.crypto && crypto.randomUUID
            ? crypto.randomUUID()
            : "d" + Date.now() + Math.random().toString(36).slice(2));
      var saved = {
        id: id,
        template: selected,
        title: (byId[selected].title + " · " + values.subject).slice(0, 100),
        fields: values,
        output: output.value,
        mode: mode,
        platform: platform,
        updated: new Date().toISOString(),
      };
      if (
        commit(function (fresh) {
          fresh.drafts = [saved].concat(
            fresh.drafts.filter(function (d) {
              return d.id !== id;
            }),
          );
          return fresh;
        })
      ) {
        draftId = id;
        dirty = false;
        status("草稿已保存到本浏览器。重要内容请导出备份。");
      }
    });
    function download(text, filename, type) {
      var url = scope.url(new Blob([text], { type: type })),
        link = node("a", "");
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      scope.timeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
    }
    scope.listen($("prompt-export"), "click", function () {
      if (locked) {
        if (originalRaw !== null) {
          download(
            originalRaw,
            "video-studio-recovery.txt",
            "text/plain;charset=utf-8",
          );
          status("已导出未改动的原始资料文本，请保留用于恢复。");
        } else status("浏览器未允许读取本地资料，当前无法导出。", true);
        return;
      }
      try {
        state = read();
        download(
          JSON.stringify(
            {
              app: "myweb-video-studio",
              version: 1,
              exportedAt: new Date().toISOString(),
              data: state,
            },
            null,
            2,
          ),
          "video-studio-backup.json",
          "application/json",
        );
        status("已导出收藏与已保存草稿。未保存的输入不在备份中。");
      } catch (error) {
        status("未导出：本地资料已变化或异常，请刷新后保留原始备份。", true);
      }
    });
    scope.listen($("prompt-import"), "click", function () {
      $("prompt-import-file").click();
    });
    scope.listen($("prompt-import-file"), "change", async function (event) {
      var file = event.target.files[0];
      if (!file) return;
      try {
        if (file.size > 1500000) throw Error("备份文件超过 1.5 MB。");
        var backup = JSON.parse(await file.text());
        if (backup.app !== "myweb-video-studio" || backup.version !== 1)
          throw Error("请选择本工具导出的版本 1 备份。");
        var imported = core.validate(backup.data, ids);
        if (
          !window.confirm(
            "将合并收藏和草稿，不覆盖不同内容的同编号草稿。是否导入？",
          )
        )
          return;
        if (
          commit(function (fresh) {
            return core.merge(fresh, imported, ids);
          })
        )
          status("备份已合并，相同草稿自动跳过。当前填写内容保持原样。");
      } catch (error) {
        status("未导入：" + error.message + " 原有资料保持不变。", true);
      } finally {
        event.target.value = "";
      }
    });
    scope.listen(window, "storage", function (event) {
      if (event.key !== key && event.key !== null) return;
      try {
        state = read();
        locked = false;
        renderCards();
        renderDrafts();
        status("已同步本浏览器其他标签页的收藏与草稿。");
      } catch (error) {
        locked = true;
        status("本地资料发生异常，暂停保存；当前输入仍可复制。", true);
      }
    });
    scope.listen(window, "beforeunload", function (event) {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    });
    $('prompt-platform').value = platform;
    select(selected, true, true);
    renderDrafts();
    if (locked)
      status(
        "本地资料无法读取，已暂停保存，避免覆盖。仍可编辑复制；如有原始资料，可点“导出备份”保留。",
        true,
      );
  })();
}
