// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
export default function initialize(scope) {
  (function () {
    "use strict";

    var dialog = document.createElement("dialog");
    if (typeof dialog.showModal !== "function") return; // The image links remain a native fallback.
    dialog.className = "image-viewer";
    dialog.setAttribute("aria-labelledby", "image-viewer-title");
    dialog.setAttribute("aria-describedby", "image-viewer-help");
    dialog.innerHTML =
      '<header class="image-viewer-header"><h2 id="image-viewer-title">界面预览</h2><div class="image-viewer-tools"><button type="button" data-image-out aria-label="缩小图片">−</button><output aria-live="polite" data-image-scale>100%</output><button type="button" data-image-in aria-label="放大图片">+</button><button type="button" data-image-fit>适应窗口</button><button type="button" data-image-close aria-label="关闭图片预览">×</button></div></header><div class="image-viewer-stage" tabindex="0" role="region" aria-label="图片浏览区域，放大后可滚动查看"><div class="image-viewer-surface"><img alt="" draggable="false"></div></div><footer class="image-viewer-footer"><p id="image-viewer-help">可用 + / − 调整大小，放大后滚动查看；按 Esc 关闭。</p><p data-image-caption></p><a target="_blank" rel="noopener noreferrer" data-image-original>打开原图 ↗</a></footer>';
    document.body.appendChild(dialog);
    var stage = dialog.querySelector(".image-viewer-stage");
    var img = dialog.querySelector("img");
    var caption = dialog.querySelector("[data-image-caption]");
    var original = dialog.querySelector("[data-image-original]");
    var output = dialog.querySelector("[data-image-scale]");
    var zoomIn = dialog.querySelector("[data-image-in]");
    var zoomOut = dialog.querySelector("[data-image-out]");
    var fit = dialog.querySelector("[data-image-fit]");
    var close = dialog.querySelector("[data-image-close]");
    var trigger;
    var zoom = 1;
    var ready = false;
    var previousOverflow = "";

    function update() {
      zoomIn.disabled = !ready || zoom >= 4;
      zoomOut.disabled = !ready || zoom <= 1;
      fit.disabled = !ready;
      if (!ready || !dialog.open) return;
      var availableWidth = Math.max(1, stage.clientWidth - 32);
      var availableHeight = Math.max(1, stage.clientHeight - 32);
      var base = Math.min(
        1,
        availableWidth / img.naturalWidth,
        availableHeight / img.naturalHeight,
      );
      img.style.width = Math.round(img.naturalWidth * base * zoom) + "px";
      img.style.height = Math.round(img.naturalHeight * base * zoom) + "px";
      output.textContent = Math.round(zoom * 100) + "%";
    }

    function changeZoom(factor) {
      zoom = Math.max(1, Math.min(4, zoom * factor));
      update();
    }

    scope.listen(img, "load", function () {
      ready = img.naturalWidth > 0;
      update();
    });
    scope.listen(img, "error", function () {
      ready = false;
      output.textContent = "加载失败";
      caption.textContent = "图片未能加载，请关闭后重试，或打开原图查看。";
      update();
    });

    scope.listen(document, "click", function (event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      var link = event.target.closest("a[data-image-preview]");
      if (!link || document.querySelector("dialog[open]")) return;
      event.preventDefault();
      trigger = link;
      zoom = 1;
      ready = false;
      output.textContent = "加载中";
      caption.textContent =
        link.getAttribute("data-image-caption") || "应用界面示例";
      img.alt = caption.textContent;
      img.style.width = "";
      img.style.height = "";
      original.href = link.href;
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      dialog.showModal();
      img.src = link.href;
      ready = img.complete && img.naturalWidth > 0;
      update();
      stage.scrollTo(0, 0);
      close.focus();
    });

    scope.listen(zoomIn, "click", function () {
      changeZoom(1.5);
    });
    scope.listen(zoomOut, "click", function () {
      changeZoom(1 / 1.5);
    });
    scope.listen(fit, "click", function () {
      zoom = 1;
      update();
      stage.scrollTo(0, 0);
    });
    scope.listen(close, "click", function () {
      dialog.close();
    });
    scope.listen(dialog, "keydown", function (event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        changeZoom(1.5);
      }
      if (event.key === "-") {
        event.preventDefault();
        changeZoom(1 / 1.5);
      }
    });
    scope.listen(dialog, "click", function (event) {
      if (event.target !== dialog) return;
      var bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        dialog.close();
    });
    scope.listen(dialog, "close", function () {
      document.documentElement.style.overflow = previousOverflow;
      if (trigger && trigger.isConnected)
        trigger.focus({ preventScroll: true });
    });
    scope.listen(window, "resize", update);
  })();
}
