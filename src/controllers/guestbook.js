// Local-only notes controller with optional tags, pinning, inline editing and search.
export default function initialize(scope) {
  (function () {
    "use strict";

    var STORAGE_KEY = "myweb_guestbook_v1";
    var MAX_ENTRIES = 100;
    var MAX_STORED_LENGTH = 300000;
    var DEFAULT_LABEL = "随手记";

    function StorageProblem(code, message) {
      this.name = "StorageProblem";
      this.code = code;
      this.message = message;
    }
    StorageProblem.prototype = Object.create(Error.prototype);
    StorageProblem.prototype.constructor = StorageProblem;

    function exactKeys(value, keys) {
      return (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === keys.length &&
        keys.every(function (key) {
          return Object.prototype.hasOwnProperty.call(value, key);
        })
      );
    }

    function validText(value, limit) {
      return (
        typeof value === "string" &&
        value.length >= 1 &&
        value.length <= limit &&
        value === value.trim() &&
        !value.includes("\0")
      );
    }

    function validEntry(entry) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry))
        return false;
      var keys = Object.keys(entry);
      var required = ["id", "nickname", "content", "createdAt"];
      var allowed = ["id", "nickname", "content", "createdAt", "pinned"];
      if (
        !required.every(function (k) {
          return Object.prototype.hasOwnProperty.call(entry, k);
        }) ||
        !keys.every(function (k) {
          return allowed.indexOf(k) !== -1;
        })
      )
        return false;
      if (
        typeof entry.id !== "string" ||
        !/^[a-zA-Z0-9-]{16,80}$/.test(entry.id) ||
        !validText(entry.nickname, 30) ||
        !validText(entry.content, 600) ||
        typeof entry.createdAt !== "string" ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(entry.createdAt) ||
        (entry.pinned !== undefined && typeof entry.pinned !== "boolean")
      )
        return false;
      var date = new Date(entry.createdAt);
      return (
        !Number.isNaN(date.getTime()) && date.toISOString() === entry.createdAt
      );
    }

    function decodeStored(raw) {
      if (raw === null) return [];
      var data;
      try {
        if (typeof raw !== "string" || raw.length > MAX_STORED_LENGTH)
          throw new Error("size");
        data = JSON.parse(raw);
        if (
          !exactKeys(data, ["version", "entries"]) ||
          data.version !== 1 ||
          !Array.isArray(data.entries) ||
          data.entries.length > MAX_ENTRIES
        )
          throw new Error("shape");
        var ids = new Set();
        data.entries.forEach(function (entry) {
          if (!validEntry(entry) || ids.has(entry.id)) throw new Error("entry");
          ids.add(entry.id);
        });
      } catch (error) {
        throw new StorageProblem(
          "corrupt",
          "本地便签数据格式异常，已暂停读写以保留原始内容。请先保留当前浏览器的数据，再检查留言存储。",
        );
      }
      return data.entries;
    }

    function unavailableMessage() {
      return "无法使用当前浏览器的本地存储，便签没有保存。请允许本站使用本地存储；如果是双击打开页面，请使用“启动预览.cmd”重新打开。";
    }

    function readEntries() {
      var raw;
      try {
        raw = window.localStorage.getItem(STORAGE_KEY);
      } catch (error) {
        throw new StorageProblem("unavailable", unavailableMessage());
      }
      return decodeStored(raw);
    }

    function writeEntries(entries) {
      var raw = JSON.stringify({ version: 1, entries: entries });
      decodeStored(raw);
      try {
        window.localStorage.setItem(STORAGE_KEY, raw);
      } catch (error) {
        if (
          error &&
          (error.name === "QuotaExceededError" ||
            error.name === "NS_ERROR_DOM_QUOTA_REACHED")
        ) {
          throw new StorageProblem(
            "quota",
            "浏览器存储空间不足，本次更改没有保存。输入内容仍在，请释放一些浏览器存储空间后重试。",
          );
        }
        throw new StorageProblem("unavailable", unavailableMessage());
      }
    }

    function newId() {
      if (window.crypto && typeof window.crypto.randomUUID === "function")
        return window.crypto.randomUUID();
      if (
        window.crypto &&
        typeof window.crypto.getRandomValues === "function"
      ) {
        var bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        return Array.from(bytes, function (byte) {
          return byte.toString(16).padStart(2, "0");
        }).join("");
      }
      return (
        "note-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 14) +
        Math.random().toString(36).slice(2, 14)
      );
    }

    var form = document.getElementById("guestbook-form");
    if (!form) return;
    var nameInput = document.getElementById("guestbook-name");
    var contentInput = document.getElementById("guestbook-content");
    var characterCount = document.getElementById("guestbook-character-count");
    var filterInput = document.getElementById("guestbook-filter");
    var list = document.getElementById("guestbook-list");
    var count = document.getElementById("guestbook-count");
    var empty = document.getElementById("guestbook-empty");
    var errorBox = document.getElementById("guestbook-error");
    var status = document.getElementById("guestbook-status");
    var submitButton = document.getElementById("guestbook-submit");
    var exportButton = document.getElementById("guestbook-export");
    var importButton = document.getElementById("guestbook-import");
    var importFile = document.getElementById("guestbook-import-file");
    var deleteDialog = document.getElementById("delete-message-dialog");
    var deletePreview = document.getElementById("delete-message-preview");
    var deleteError = document.getElementById("delete-message-error");
    var confirmDelete = document.getElementById("delete-message-confirm");
    var tagButtons = form.querySelectorAll("[data-note-tag]");
    var filterChipButtons = document.querySelectorAll("[data-filter-chip]");
    var statTotal = document.getElementById("guestbook-stat-total");
    var statPinned = document.getElementById("guestbook-stat-pinned");
    var statTags = document.getElementById("guestbook-stat-tags");
    var activeFilterChip = "all";
    var entries = [];
    var storageReady = false;
    var pendingDeleteId = null;
    var editingId = null;
    var importing = false;

    function element(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function showError(message) {
      errorBox.textContent = message;
      errorBox.hidden = false;
      status.textContent = "";
    }

    function clearError() {
      errorBox.textContent = "";
      errorBox.hidden = true;
    }

    function renderEntries() {
      list.replaceChildren();
      var query = filterInput
        ? filterInput.value.trim().toLocaleLowerCase()
        : "";
      var visible = entries
        .slice()
        .sort(function (a, b) {
          var pinDiff = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
          return pinDiff || Date.parse(b.createdAt) - Date.parse(a.createdAt);
        })
        .filter(function (entry) {
          if (activeFilterChip === "pinned" && !entry.pinned) return false;
          if (
            activeFilterChip !== "all" &&
            activeFilterChip !== "pinned" &&
            entry.nickname !== activeFilterChip
          ) {
            return false;
          }
          if (!query) return true;
          return (
            entry.nickname.toLocaleLowerCase().indexOf(query) !== -1 ||
            entry.content.toLocaleLowerCase().indexOf(query) !== -1
          );
        });

      if (statTotal) statTotal.textContent = String(entries.length);
      if (statPinned) {
        statPinned.textContent = String(
          entries.filter(function (item) {
            return Boolean(item.pinned);
          }).length,
        );
      }
      if (statTags) {
        statTags.textContent = String(
          new Set(
            entries.map(function (item) {
              return item.nickname;
            }),
          ).size,
        );
      }

      empty.hidden = !storageReady || visible.length !== 0;
      if (storageReady && entries.length > 0 && visible.length === 0) {
        empty.querySelector("h3").textContent = "没有匹配的便签。";
        empty.querySelector("p").textContent = "换个关键词，或者切换上方分类筛选看看。";
      } else {
        empty.querySelector("h3").textContent = "还没有便签。";
        empty.querySelector("p").textContent = "留一句话，让这一页从你开始。";
      }

      var filtered = Boolean(query) || activeFilterChip !== "all";
      count.textContent = storageReady
        ? filtered
          ? "匹配 " + visible.length + " / 共 " + entries.length + " 条便签"
          : entries.length + " 条本地便签 / 最多 100 条"
        : "暂时无法读取本地便签";
      submitButton.disabled = !storageReady;
      exportButton.disabled = !storageReady || entries.length === 0;
      importButton.disabled = !storageReady || importing;

      visible.forEach(function (entry) {
        var card = element(
          "article",
          "guestbook-entry" + (entry.pinned ? " is-pinned" : ""),
        );
        var header = element("div", "guestbook-entry-header");
        var avatar = element(
          "span",
          "guestbook-avatar",
          Array.from(entry.nickname)[0],
        );
        avatar.setAttribute("aria-hidden", "true");
        header.appendChild(avatar);
        var info = element("div", "guestbook-entry-info");
        var titleRow = element("div", "guestbook-entry-title-row");
        titleRow.appendChild(
          element("h3", "guestbook-entry-name", entry.nickname),
        );
        if (entry.pinned)
          titleRow.appendChild(element("span", "guestbook-pin-badge", "置顶"));
        info.appendChild(titleRow);
        var time = element(
          "time",
          "guestbook-entry-date",
          new Date(entry.createdAt).toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        );
        time.dateTime = entry.createdAt;
        info.appendChild(time);
        header.appendChild(info);

        var actions = element("div", "guestbook-entry-actions");
        var pin = element(
          "button",
          "guestbook-entry-action",
          entry.pinned ? "取消置顶" : "置顶",
        );
        pin.type = "button";
        pin.setAttribute("data-pin-message", entry.id);
        pin.disabled = !storageReady;
        actions.appendChild(pin);

        var edit = element("button", "guestbook-entry-action", "编辑");
        edit.type = "button";
        edit.setAttribute("data-edit-message", entry.id);
        edit.disabled = !storageReady;
        actions.appendChild(edit);

        var remove = element("button", "guestbook-entry-delete", "删除");
        remove.type = "button";
        remove.setAttribute("data-delete-message", entry.id);
        remove.setAttribute(
          "aria-label",
          "删除" + entry.nickname + "的这条本地便签",
        );
        remove.setAttribute("aria-haspopup", "dialog");
        remove.disabled = !storageReady;
        actions.appendChild(remove);
        header.appendChild(actions);
        card.appendChild(header);

        if (editingId === entry.id) {
          var editForm = element("form", "guestbook-edit-form");
          editForm.setAttribute("data-save-edit", entry.id);
          var editArea = element("textarea", "guestbook-edit-area");
          editArea.rows = 4;
          editArea.maxLength = 600;
          editArea.value = entry.content;
          editArea.setAttribute("aria-label", "编辑便签内容");
          editForm.appendChild(editArea);
          var editBar = element("div", "guestbook-edit-actions");
          var saveBtn = element("button", "guestbook-edit-save", "保存修改");
          saveBtn.type = "submit";
          var cancelBtn = element("button", "guestbook-edit-cancel", "取消");
          cancelBtn.type = "button";
          cancelBtn.setAttribute("data-cancel-edit", "");
          editBar.appendChild(cancelBtn);
          editBar.appendChild(saveBtn);
          editForm.appendChild(editBar);
          card.appendChild(editForm);
        } else {
          card.appendChild(
            element("p", "guestbook-entry-content", entry.content),
          );
        }

        list.appendChild(card);
      });
    }

    function handleStorageError(error) {
      var message =
        error instanceof StorageProblem
          ? error.message
          : "无法完成这次本地操作，数据没有更改。请保留输入内容后重试。";
      if (error.code === "corrupt" || error.code === "unavailable") {
        storageReady = false;
        entries = [];
        renderEntries();
      }
      showError(message);
      return message;
    }

    function refreshEntries() {
      try {
        entries = readEntries();
        storageReady = true;
        clearError();
        renderEntries();
        return true;
      } catch (error) {
        handleStorageError(error);
        return false;
      }
    }

    function updateCharacterCount() {
      characterCount.textContent = contentInput.value.length + " / 600";
    }

    tagButtons.forEach(function (btn) {
      scope.listen(btn, "click", function () {
        nameInput.value = btn.getAttribute("data-note-tag") || "";
        nameInput.removeAttribute("aria-invalid");
        if (storageReady) clearError();
        contentInput.focus();
      });
    });

    scope.listen(nameInput, "input", function () {
      nameInput.removeAttribute("aria-invalid");
      if (storageReady) clearError();
    });
    scope.listen(contentInput, "input", function () {
      contentInput.removeAttribute("aria-invalid");
      updateCharacterCount();
      if (storageReady) clearError();
    });
    if (filterInput) {
      scope.listen(filterInput, "input", renderEntries);
    }
    filterChipButtons.forEach(function (chip) {
      scope.listen(chip, "click", function () {
        activeFilterChip = chip.getAttribute("data-filter-chip") || "all";
        filterChipButtons.forEach(function (other) {
          other.setAttribute(
            "aria-pressed",
            other === chip ? "true" : "false",
          );
        });
        renderEntries();
      });
    });

    scope.listen(form, "submit", function (event) {
      event.preventDefault();
      if (!storageReady) return;
      clearError();
      var nickname = nameInput.value.trim() || DEFAULT_LABEL;
      var content = contentInput.value.trim();
      nameInput.removeAttribute("aria-invalid");
      contentInput.removeAttribute("aria-invalid");
      if (!validText(nickname, 30)) {
        showError("分类或称呼最多 30 个字符。");
        nameInput.setAttribute("aria-invalid", "true");
        nameInput.focus();
        return;
      }
      if (!validText(content, 600)) {
        showError("请填写 1–600 个字符的便签，不能只输入空格。");
        contentInput.setAttribute("aria-invalid", "true");
        contentInput.focus();
        return;
      }
      try {
        var latest = readEntries();
        if (latest.length >= MAX_ENTRIES) {
          entries = latest;
          renderEntries();
          showError(
            "当前浏览器已保留 100 条便签。请先导出留存，再按需删除单条便签后重试。",
          );
          return;
        }
        var id = newId();
        while (
          latest.some(function (entry) {
            return entry.id === id;
          })
        )
          id = newId();
        var next = [
          {
            id: id,
            nickname: nickname,
            content: content,
            createdAt: new Date().toISOString(),
          },
        ].concat(latest);
        writeEntries(next);
        entries = next;
        renderEntries();
        contentInput.value = "";
        updateCharacterCount();
        status.textContent = "已保存在当前浏览器。站主不会收到这张便签。";
      } catch (error) {
        handleStorageError(error);
      }
    });

    scope.listen(list, "click", function (event) {
      if (!storageReady) return;
      var pinBtn = event.target.closest("[data-pin-message]");
      if (pinBtn) {
        var pinId = pinBtn.getAttribute("data-pin-message");
        try {
          var latest = readEntries();
          var next = latest.map(function (item) {
            if (item.id !== pinId) return item;
            var updated = {
              id: item.id,
              nickname: item.nickname,
              content: item.content,
              createdAt: item.createdAt,
            };
            if (!item.pinned) updated.pinned = true;
            return updated;
          });
          writeEntries(next);
          entries = next;
          renderEntries();
          status.textContent = "已更新置顶状态。";
        } catch (error) {
          handleStorageError(error);
        }
        return;
      }

      var editBtn = event.target.closest("[data-edit-message]");
      if (editBtn) {
        editingId = editBtn.getAttribute("data-edit-message");
        renderEntries();
        var activeArea = list.querySelector(".guestbook-edit-area");
        if (activeArea) activeArea.focus();
        return;
      }

      var cancelBtn = event.target.closest("[data-cancel-edit]");
      if (cancelBtn) {
        editingId = null;
        renderEntries();
        return;
      }

      var button = event.target.closest("[data-delete-message]");
      if (!button) return;
      var entry = entries.find(function (item) {
        return item.id === button.getAttribute("data-delete-message");
      });
      if (!entry) return;
      if (!deleteDialog || typeof deleteDialog.showModal !== "function") {
        showError(
          "当前浏览器不支持删除确认窗口。请使用较新的浏览器操作，便签保持不变。",
        );
        return;
      }
      pendingDeleteId = entry.id;
      deletePreview.textContent = entry.nickname + "：" + entry.content;
      deleteError.textContent = "";
      deleteError.hidden = true;
      deleteDialog.showModal();
    });

    scope.listen(list, "submit", function (event) {
      var editForm = event.target.closest("[data-save-edit]");
      if (!editForm || !storageReady) return;
      event.preventDefault();
      var id = editForm.getAttribute("data-save-edit");
      var area = editForm.querySelector(".guestbook-edit-area");
      var nextContent = area ? area.value.trim() : "";
      if (!validText(nextContent, 600)) {
        showError("请填写 1–600 个字符的便签内容。");
        if (area) area.focus();
        return;
      }
      try {
        var latest = readEntries();
        var next = latest.map(function (item) {
          if (item.id !== id) return item;
          var updated = {
            id: item.id,
            nickname: item.nickname,
            content: nextContent,
            createdAt: item.createdAt,
          };
          if (item.pinned) updated.pinned = true;
          return updated;
        });
        writeEntries(next);
        entries = next;
        editingId = null;
        clearError();
        renderEntries();
        status.textContent = "便签修改已保存到当前浏览器。";
      } catch (error) {
        handleStorageError(error);
      }
    });

    scope.listen(deleteDialog, "close", function () {
      pendingDeleteId = null;
      deleteError.textContent = "";
      deleteError.hidden = true;
    });

    scope.listen(confirmDelete, "click", function () {
      if (!pendingDeleteId || !storageReady) return;
      try {
        var latest = readEntries();
        var next = latest.filter(function (entry) {
          return entry.id !== pendingDeleteId;
        });
        if (next.length === latest.length) {
          entries = latest;
          renderEntries();
          deleteDialog.close();
          status.textContent = "这张便签已在另一个页面删除，列表已更新。";
          return;
        }
        writeEntries(next);
        entries = next;
        clearError();
        renderEntries();
        deleteDialog.close();
        status.textContent = "已从当前浏览器删除这张便签。";
        document.getElementById("saved-heading").focus();
      } catch (error) {
        deleteError.textContent = handleStorageError(error);
        deleteError.hidden = false;
      }
    });

    scope.listen(exportButton, "click", function () {
      if (!storageReady) return;
      try {
        var latest = readEntries();
        entries = latest;
        renderEntries();
        if (!latest.length) {
          status.textContent = "当前没有可导出的便签。";
          return;
        }
        var blob = new Blob(
          [JSON.stringify({ version: 1, entries: latest }, null, 2)],
          { type: "application/json;charset=utf-8" },
        );
        var url = scope.url(blob);
        var link = element("a");
        link.href = url;
        link.download =
          "小站便签-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        scope.timeout(function () {
          URL.revokeObjectURL(url);
        }, 1000);
        clearError();
        status.textContent =
          "已开始下载本地便签文件。请在浏览器中确认保存位置。";
      } catch (error) {
        handleStorageError(error);
      }
    });

    scope.listen(importButton, "click", function () {
      if (storageReady && !importing) importFile.click();
    });
    scope.listen(importFile, "change", async function () {
      var file = importFile.files && importFile.files[0];
      if (!file || !storageReady || importing) return;
      importing = true;
      importButton.disabled = true;
      clearError();
      try {
        if (file.size > MAX_STORED_LENGTH * 4)
          throw new StorageProblem("import", "备份文件过大，未导入任何内容。");
        var imported;
        try {
          imported = decodeStored((await file.text()).replace(/^\uFEFF/, ""));
        } catch (error) {
          throw new StorageProblem(
            "import",
            "备份格式无效。请选择本站导出的版本 1 JSON 文件，现有便签保持不变。",
          );
        }
        var latest = readEntries();
        var known = new Map(
          latest.map(function (entry) {
            return [entry.id, entry];
          }),
        );
        var additions = [];
        imported.forEach(function (entry) {
          var previous = known.get(entry.id);
          if (!previous) additions.push(entry);
          else if (
            previous.nickname !== entry.nickname ||
            previous.content !== entry.content ||
            previous.createdAt !== entry.createdAt
          ) {
            throw new StorageProblem(
              "import",
              "备份中有相同编号但内容不同的便签，本次未导入，现有内容保持不变。",
            );
          }
        });
        if (latest.length + additions.length > MAX_ENTRIES)
          throw new StorageProblem(
            "import",
            "合并后超过 100 条便签，本次未导入。请先导出并整理现有便签。",
          );
        var next = additions.concat(latest);
        if (additions.length) writeEntries(next);
        entries = next;
        status.textContent =
          "已导入 " +
          additions.length +
          " 条便签，跳过 " +
          (imported.length - additions.length) +
          " 条重复记录。现有便签已保留。";
      } catch (error) {
        handleStorageError(error);
      } finally {
        importing = false;
        importFile.value = "";
        renderEntries();
      }
    });

    scope.listen(window, "storage", function (event) {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      if (refreshEntries()) {
        if (
          pendingDeleteId &&
          !entries.some(function (entry) {
            return entry.id === pendingDeleteId;
          })
        )
          deleteDialog.close();
        status.textContent = "已同步当前浏览器其他页面中的便签更改。";
      }
    });

    updateCharacterCount();
    refreshEntries();
  })();
}
