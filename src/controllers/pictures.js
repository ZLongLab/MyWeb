// Behavior preserved from the 1.9.0 implementation; initialized by the React lifecycle.
export default function initialize(scope) {
  (function () {
    "use strict";
    function picture(image, options) {
      options = options || {};
      var frame = document.createElement("picture"),
        img = document.createElement("img");
      img.src = image.src;
      img.alt = image.caption || "";
      img.width = image.width;
      img.height = image.height;
      img.decoding = "async";
      if (options.priority) img.fetchPriority = "high";
      else img.loading = "lazy";
      if (image.smallSrc) {
        var source = document.createElement("source");
        source.type = "image/webp";
        source.srcset = image.smallSrc + " 640w, " + image.src + " 960w";
        source.sizes = options.sizes || "(max-width: 768px) 92vw, 720px";
        frame.append(source);
      }
      frame.append(img);
      return frame;
    }
    window.SITE_PICTURES = { create: picture };
  })();
}
