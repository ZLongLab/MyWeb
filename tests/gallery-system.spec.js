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
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute(
        "data-react-ready",
        "true",
      );
      await expect(page.locator("audio,.audio-capsule")).toHaveCount(0);
      await expect(page.locator(".gallery-footer")).toHaveCount(1);
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
        };
      });
      expect(colors.heading, route).toBeGreaterThan(7);
      expect(colors.muted, route).toBeGreaterThan(4.5);
      expect(colors.overflow, route).toBeFalsy();
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
