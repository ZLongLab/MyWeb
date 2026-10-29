import { useLayoutEffect } from "react";
import { createControllerScope } from "./controller-scope.js";

// React owns the semantic shell. Native tools own their empty output regions
// and uncontrolled fields; their generated children are never reconciled by React.
export function usePageControllers(page, controllers) {
  useLayoutEffect(() => {
    const scope = createControllerScope();
    const bodyNodes = new Set(document.body.children);
    const previousOverflow = document.documentElement.style.overflow;
    try {
      for (const initialize of controllers) initialize(scope);
      // Native fragment navigation can finish before async React pages exist.
      // Restore the same landing position after their sections have mounted.
      if (location.hash) scope.frame(() => {
        let id;
        try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
        const target = document.getElementById(id);
        if (target?.getClientRects().length) target.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      document.documentElement.dataset.reactReady = "true";
      document.dispatchEvent(new Event("myweb:ready"));
    } catch (error) {
      scope.dispose();
      throw error;
    }
    return () => {
      scope.dispose();
      window.SITE_MOTION?.clear();
      [
        "SITE_THEME",
        "SITE_DETAILS",
        "SITE_FEEDBACK",
        "SITE_MOTION",
        "SITE_GARDEN",
        "SITE_CONTENT",
        "SITE_NAV",
        "SITE_PICTURES",
      ].forEach((key) => {
        delete window[key];
      });
      for (const node of [...document.body.children])
        if (!bodyNodes.has(node)) node.remove();
      document.documentElement.style.overflow = previousOverflow;
      delete document.documentElement.dataset.reactReady;
    };
  }, [page, controllers]);
}
