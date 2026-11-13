import { test, expect } from "@playwright/test";
import fs from "node:fs";

for (const width of [1440, 390]) {
  test(`Morning gallery layout, graph navigation and source data at ${width}`, async ({
    page,
  }) => {
    const errors = [],
      external = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (
        /^https?:/.test(request.url()) &&
        new URL(request.url()).hostname !== "127.0.0.1"
      )
        external.push(request.url());
    });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("");
    await expect(page.locator("html")).toHaveAttribute(
      "data-react-ready",
      "true",
    );
    await expect(page.locator(".product-glass-card")).toHaveCount(2);
    await expect(page.locator(".product-copy").first()).toHaveAttribute(
      "href",
      /project.html\?id=recallai/,
    );
    const expectedDays = await page.evaluate(() =>
      window.SITE_SNAPSHOT.github.weeks
        .slice(0, 26)
        .reduce((count, week) => count + week.days.length, 0),
    );
    await expect(page.locator(".gallery-heatmap rect")).toHaveCount(
      expectedDays,
    );
    await expect(page.locator(".gallery-metrics")).toContainText("53");
    await page.locator('.idea-card a[aria-label="视频灵感"]').hover();
    await expect(page.locator(".idea-card line.is-connected")).toHaveCount(3);
    await expect(
      page.locator('.idea-card a[aria-label="视频灵感"]'),
    ).toHaveAttribute("href", "video-prompts.html");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    fs.mkdirSync(".tmp/home-gallery", { recursive: true });
    await page.locator('#home-title').scrollIntoViewIfNeeded();
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
    await page.screenshot({
      path: `.tmp/home-gallery/${width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
  });
}
