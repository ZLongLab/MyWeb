import { test, expect } from "@playwright/test";
import fs from "node:fs";

test("New guides connect tools, journal, RSS, sitemap and current site notes", async ({
  page,
  request,
}) => {
  fs.mkdirSync(".tmp/content-guides", { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1050 });
  const guides = [
    {
      tool: "image-tools.html",
      id: "image-workshop-batch-guide",
      title: "用图片工坊完成一次批量压缩",
      entry: "阅读批量转换入门教程 →",
    },
    {
      tool: "video-prompts.html",
      id: "video-studio-first-prompt",
      title: "视频灵感室从一句想法到分镜提示词",
      entry: "阅读视频灵感室入门教程 →",
    },
  ];
  for (const guide of guides) {
    await page.goto(guide.tool);
    await page.getByRole("link", { name: guide.entry, exact: true }).click();
    await expect(page.locator("#article-title")).toHaveText(guide.title);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      guide.title + " · 有间小站",
    );
    await expect(page.locator(".article-project-reference a")).toHaveAttribute(
      "href",
      guide.tool,
    );
    await page.screenshot({
      path: `.tmp/content-guides/${guide.id}.png`,
      fullPage: true,
    });
  }
  await page.goto("articles.html?view=time");
  await expect(
    page.locator("#article-list .article-row").first(),
  ).toHaveAttribute("href", /id=how-this-site-grew/);
  await expect(page.locator("#article-list .article-row")).toHaveCount(8);
  for (const guide of guides)
    await expect(
      page.locator(`#article-list a[href*="id=${guide.id}"]`),
    ).toBeVisible();
  await page.locator('[data-article-view="topics"]').click();
  await expect(page.locator(".garden-graph-node")).toHaveCount(8);
  await page.screenshot({
    path: ".tmp/content-guides/topics-1440.png",
    fullPage: true,
  });
  const feed = await request.get("feed.xml"),
    sitemap = await request.get("sitemap.xml");
  expect(feed.status()).toBe(200);
  expect(sitemap.status()).toBe(200);
  const feedText = await feed.text(),
    mapText = await sitemap.text();
  expect((feedText.match(/<item>/g) || []).length).toBe(8);
  for (const guide of guides) {
    expect(feedText).toContain(guide.title);
    expect(mapText).toContain(
      `https://zlonglab.github.io/MyWeb/article.html?id=${guide.id}`,
    );
  }
  expect(mapText).toContain(
    "https://zlonglab.github.io/MyWeb/video-prompts.html",
  );
  await page.goto("colophon.html");
  await expect(page.locator("main")).toContainText("React 与 Vite");
  await expect(
    page.getByRole("button", { name: "复制暖白色值 #F8F7F4", exact: true }),
  ).toBeVisible();
  await page.goto("now.html");
  await expect(page.locator("#now-doing")).toContainText("使用教程");
  await page.goto("");
  for (const guide of guides)
    await expect(
      page.locator(`.gallery-reading a[href*="id=${guide.id}"]`),
    ).toBeVisible();
  await page.keyboard.press("Control+k");
  for (const guide of guides) {
    await page.locator("#site-search-dialog input").fill(guide.title);
    await expect(
      page.locator(`[data-search-entry="article:${guide.id}"]`),
    ).toBeVisible();
  }
  await page.keyboard.press("Escape");
  const snapshot = await page.evaluate(() => window.SITE_SNAPSHOT);
  expect(snapshot.statistics).toMatchObject({ articles: 8, projects: 8 });
  expect(snapshot.github.total).toBe(53);
});
