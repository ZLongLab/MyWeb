import { test, expect } from "@playwright/test";
import fs from "node:fs";

for (const theme of ["paper", "night"]) {
  test(`Journal feature, directory, topic links and footer clearance in ${theme}`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem("myweb_theme_v1", value),
      theme,
    );
    await page.goto("articles.html?view=time");
    await expect(page.locator("html")).toHaveAttribute(
      "data-react-ready",
      "true",
    );
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(248, 247, 244)",
    );
    await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
    await expect(page.locator(".journal-summary")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await expect(page.locator(".journal-summary")).toHaveCSS(
      "box-shadow",
      "none",
    );
    await expect(page.locator(".journal-prism")).toHaveCount(1);
    await expect(page.locator(".nav-search-shortcut")).toHaveCSS(
      "color",
      "rgb(156, 163, 175)",
    );
    await expect(page.locator('.site-nav a[aria-current="page"]')).toHaveCSS(
      "border-radius",
      "8px",
    );
    await expect(page.locator(".journal-feature")).toHaveCSS(
      "border-top-color",
      "rgba(26, 48, 38, 0.05)",
    );
    await expect(page.locator(".journal-feature")).toHaveCSS(
      "backdrop-filter",
      "blur(16px)",
    );
    await expect(page.locator('[data-article-filter="all"] small')).toHaveText(
      "08",
    );
    await expect(page.locator('[data-article-filter="all"]')).toHaveCSS(
      "border-top-width",
      "0px",
    );
    await expect(page.locator('[data-article-view="time"]')).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await expect(page.locator(".journal-summary")).toContainText("8 篇文章");
    await expect(page.locator(".journal-summary")).toContainText("3 类主题");
    await expect(page.locator(".journal-summary time")).toHaveAttribute(
      "datetime",
      "2026-11-13",
    );
    await expect(page.locator(".journal-feature")).toHaveCount(1);
    await expect(page.locator(".journal-feature .garden-maturity")).toHaveText(
      "种树",
    );
    await expect(page.locator(".journal-entry")).toHaveCount(7);
    await expect(page.locator("#article-list .article-cover")).toHaveCount(0);
    await expect(page.locator(".journal-feature-visual use")).toHaveAttribute(
      "href",
      "#journal-evolution-symbol",
    );
    await expect(page.locator("#journal-evolution-symbol")).toHaveCount(1);
    await expect(page.locator("#journal-evolution-symbol line")).toHaveCount(
      14,
    );
    await expect(page.locator("#journal-evolution-symbol path")).toHaveCount(0);
    fs.mkdirSync(".tmp/journal-gallery", { recursive: true });
    await page.screenshot({
      path: `.tmp/journal-gallery/time-${theme}.png`,
      fullPage: true,
    });

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.locator(".journal-feature").hover();
    await expect
      .poll(() =>
        page.locator(".journal-title-arrow").evaluate((node) => {
          const matrix = new DOMMatrix(getComputedStyle(node).transform);
          return [matrix.m41, matrix.m42];
        }),
      )
      .toEqual([3, -3]);
    await page.locator(".journal-entry").first().hover();
    await expect
      .poll(() =>
        page
          .locator(".journal-entry")
          .first()
          .evaluate(
            (node) => new DOMMatrix(getComputedStyle(node).transform).m41,
          ),
      )
      .toBe(4);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".journal-entry").first()).toHaveCSS(
      "transform",
      "none",
    );

    await page.locator('[data-article-view="topics"]').click();
    await expect(page.locator("#article-list")).toBeHidden();
    await expect(page.locator("#garden-map")).toBeVisible();
    const cards = page.locator(".journal-topic-card");
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
    const widths = await cards.evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().width)),
    );
    expect(new Set(widths).size).toBe(2);
    for (const card of await cards.all()) {
      const count = await card.locator("h2 small").textContent();
      await expect(card.locator(".journal-topic-articles a")).toHaveCount(
        Number(count.match(/\d+/)[0]),
      );
    }
    await page.screenshot({
      path: `.tmp/journal-gallery/topics-${theme}.png`,
      fullPage: true,
    });
    await page.locator(".journal-topic-articles a").first().click();
    await expect(page.locator("#article-title")).toBeVisible();
    await page.locator("[data-article-list-link]").first().click();
    await expect(page.locator('[data-article-view="topics"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator("#article-clusters")).toBeVisible();
    await page.locator('[data-article-view="time"]').click();
    await page
      .locator("#article-search")
      .fill("RecallAI：本地检索与收纳的边界");
    await expect(page.locator("#article-list .article-row")).toHaveCount(1);
    await expect(page.locator(".journal-feature-visual")).toHaveCount(0);
    await page.locator("#article-search").fill("");
    await expect(page.locator(".journal-feature-visual")).toHaveCount(1);

    for (const width of [1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      const bounds = await page.evaluate(() => {
        const mark = document.querySelector(".gallery-watermark");
        const watermark = mark.getBoundingClientRect();
        const footer = document
          .querySelector(".gallery-footer")
          .getBoundingClientRect();
        return {
          bottomGap: footer.bottom - watermark.bottom,
          topGap: watermark.top - footer.top,
          overflow: document.documentElement.scrollWidth > innerWidth,
          watermarkOverflow: mark.scrollWidth > mark.clientWidth,
        };
      });
      expect(bounds.bottomGap).toBeGreaterThanOrEqual(24);
      expect(bounds.topGap).toBeGreaterThanOrEqual(24);
      expect(bounds.overflow || bounds.watermarkOverflow).toBe(false);
    }
  });
}

test("Narrow journal keeps the illustration inside its feature and both views usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.addInitScript(() =>
    localStorage.setItem("myweb_theme_v1", "paper"),
  );
  await page.goto("articles.html?view=time");
  await expect(page.locator(".journal-feature-visual")).toBeVisible();
  const bounds = await page.locator(".journal-feature").evaluate((node) => {
    const card = node.getBoundingClientRect(),
      graphic = node.querySelector("figure").getBoundingClientRect();
    return {
      contained: graphic.bottom <= card.bottom && graphic.top >= card.top,
      readOffset:
        node.querySelector(".article-read-link").getBoundingClientRect().left -
        card.left,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  expect(bounds.contained).toBe(true);
  expect(bounds.readOffset).toBeGreaterThanOrEqual(24);
  expect(bounds.readOffset).toBeLessThanOrEqual(26);
  expect(bounds.overflow).toBe(false);
  await page.screenshot({
    path: ".tmp/journal-gallery/time-390.png",
    fullPage: true,
  });
  await page.locator('[data-article-view="topics"]').click();
  await expect(page.locator(".journal-topic-card").first()).toBeVisible();
  const widths = await page
    .locator(".journal-topic-card")
    .evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().width)),
    );
  expect(new Set(widths).size).toBe(1);
  await page.screenshot({
    path: ".tmp/journal-gallery/topics-390.png",
    fullPage: true,
  });
});
