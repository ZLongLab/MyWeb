import { test, expect } from "@playwright/test";
import fs from "node:fs";

const routes = fs
  .readdirSync(".")
  .filter((name) => /^[a-z0-9-]+\.html$/.test(name));
for (const theme of ["paper", "night"]) {
  test(`All rooms share gallery surfaces, readable text and footer in ${theme}`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(
      (theme) => localStorage.setItem("myweb_theme_v1", theme),
      theme,
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    fs.mkdirSync(".tmp/site-paper", { recursive: true });
    for (const route of routes) {
      const target =
        route === "article.html"
          ? route + "?id=how-this-site-grew"
          : route === "project.html"
            ? route + "?id=recallai"
            : route;
      await page.goto(target);
      await expect(page.locator("html")).toHaveAttribute(
        "data-react-ready",
        "true",
      );
      await expect(page.locator("audio,.audio-capsule")).toHaveCount(0);
      await expect(page.locator(".gallery-footer")).toHaveCount(1);
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        "rgb(248, 247, 244)",
      );
      await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
      await expect(page.locator("h1:visible")).toHaveCSS(
        "color",
        "rgb(26, 48, 38)",
      );
      const colors = await page.evaluate(() => {
        function rgb(value) {
          return value
            .match(/[\d.]+/g)
            .slice(0, 3)
            .map(Number);
        }
        function luminance(color) {
          return rgb(color)
            .map((value) => {
              const c = value / 255;
              return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
            })
            .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
        }
        const body = getComputedStyle(document.body);
        const background = luminance(body.backgroundColor);
        const text = luminance(
          getComputedStyle(document.querySelector("h1")).color,
        );
        const probe = document.createElement("span");
        probe.style.color = "var(--muted)";
        document.body.append(probe);
        const muted = luminance(getComputedStyle(probe).color);
        probe.remove();
        const ratio = (value) =>
          (Math.max(background, value) + 0.05) /
          (Math.min(background, value) + 0.05);
        return {
          heading: ratio(text),
          muted: ratio(muted),
          overflow: document.documentElement.scrollWidth > innerWidth,
          darkSurfaces: [
            ...document.querySelectorAll(
              "main,header,footer,main section,main article,main div",
            ),
          ]
            .filter((node) => {
              if (
                node.closest("figure,.image-room-art") ||
                node.querySelector(":scope > img")
              )
                return false;
              const rect = node.getBoundingClientRect(),
                style = getComputedStyle(node);
              const color =
                style.backgroundColor.match(/[\d.]+/g)?.map(Number) || [];
              return (
                rect.width > 180 &&
                rect.height > 64 &&
                color.length >= 3 &&
                (color[3] ?? 1) > 0.5 &&
                color.slice(0, 3).every((channel) => channel < 150)
              );
            })
            .map((node) => ({
              tag: node.tagName,
              id: node.id,
              className: node.className,
            })),
        };
      });
      expect(colors.heading, route).toBeGreaterThan(7);
      expect(colors.muted, route).toBeGreaterThan(4.5);
      expect(colors.overflow, route).toBeFalsy();
      expect(colors.darkSurfaces, route).toEqual([]);
      await page.screenshot({
        path: `.tmp/site-paper/${route.replace(".html", "")}-${theme}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
    fs.mkdirSync(".tmp/gallery-system", { recursive: true });
    for (const route of [
      "index",
      "projects",
      "articles",
      "video-prompts",
      "image-tools",
    ]) {
      await page.goto(route + ".html");
      await expect(page.locator("html")).toHaveAttribute(
        "data-react-ready",
        "true",
      );
      await page.screenshot({
        path: `.tmp/gallery-system/${route}-${theme}.png`,
        fullPage: true,
      });
    }
  });
}
