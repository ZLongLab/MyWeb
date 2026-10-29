import React from "react";
import { createRoot } from "react-dom/client";
import "./data/site.js";
import App from "./App.jsx";
import { pages } from "./pages/registry.js";
import { pageControllers } from "./runtime/page-controllers.js";

let filename = location.pathname.split("/").pop() || "index.html";
if (!filename.includes(".")) filename += ".html";
// A nested missing URL uses 404.html's <base> and always renders the lost room.
const route =
  document.body.dataset.page === "notfound"
    ? pages["404.html"]
    : pages[filename] || pages["404.html"];
const [pageModule, controllers] = await Promise.all([
  route.load(),
  Promise.all(
    pageControllers[route.page].map((load) =>
      load().then((module) => module.default),
    ),
  ),
]);
document.body.dataset.page = route.page;
document.body.dataset.room = route.room;
export const currentRoute = {
  ...route,
  Component: pageModule.default,
  controllers,
};
export function mountSite(container, resolvedRoute = currentRoute) {
  const root = createRoot(container);
  root.render(<App route={resolvedRoute} />);
  return root;
}
export const root = mountSite(document.getElementById("root"));
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
