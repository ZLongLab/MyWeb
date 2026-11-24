import { test, expect } from "@playwright/test";
import fs from "node:fs";

test("Frame Studio renders locally, updates styles, and exports PNG without external requests", async ({
  page,
}) => {
  const errors = [];
  const external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (
      /^https?:/.test(request.url()) &&
      new URL(request.url()).hostname !== "127.0.0.1"
    ) {
      external.push(request.url());
    }
  });

  await page.goto("frame-studio.html");
  await expect(page.locator("html")).toHaveAttribute("data-react-ready", "true");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("画框工坊。");

  const size = await page.locator(".frame-preview-canvas").evaluate((canvas) => ({
    width: canvas.width,
    height: canvas.height,
  }));
  expect(size.width).toBeGreaterThan(800);
  expect(size.height).toBeGreaterThan(400);

  await page.getByRole("button", { name: "深松夜林" }).click();
  await expect(page.getByRole("button", { name: "深松夜林" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "细线玻璃" }).click();
  await page.locator("#frame-caption-input").fill("有间小站 · 作品展示");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载高清 PNG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("-framed.png");
  const bytes = fs.readFileSync(await download.path());
  expect(bytes.subarray(1, 4).toString()).toBe("PNG");

  fs.mkdirSync(".tmp/labs", { recursive: true });
  await page.screenshot({ path: ".tmp/labs/frame-studio-1440.png", fullPage: true });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("Focus Lab timer, Web Audio presets, and article TOC & share link work cleanly", async ({
  page,
  request,
}) => {
  const errors = [];
  const external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (
      /^https?:/.test(request.url()) &&
      new URL(request.url()).hostname !== "127.0.0.1"
    ) {
      external.push(request.url());
    }
  });

  await page.goto("focus-lab.html");
  await expect(page.locator("html")).toHaveAttribute("data-react-ready", "true");
  await expect(page.locator("audio,.audio-capsule")).toHaveCount(0);
  await page.getByRole("button", { name: "小憩 5 分" }).click();
  await expect(page.locator(".focus-clock-digits")).toHaveText("05:00");
  await page.getByRole("button", { name: "开始专注" }).click();
  await expect(page.getByRole("button", { name: "暂停计时" })).toBeVisible();
  await page.getByRole("button", { name: "雨夜书房" }).click();
  await expect(page.locator(".focus-sound-badge")).toHaveText("正在播放 2 路");
  await page.getByRole("button", { name: "暂停计时" }).click();

  fs.mkdirSync(".tmp/labs", { recursive: true });
  await page.screenshot({ path: ".tmp/labs/focus-lab-1440.png", fullPage: true });

  await page.goto("article.html?id=how-this-site-grew");
  await expect(page.locator("html")).toHaveAttribute("data-react-ready", "true");
  await expect(page.locator("#article-toc")).toBeVisible();
  expect(await page.locator("#article-toc a").count()).toBeGreaterThanOrEqual(3);
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.sharedUrl = text;
        },
      },
    }),
  );
  await page.locator("#article-copy-link").click();
  expect(await page.evaluate(() => window.sharedUrl)).toContain(
    "article.html?id=how-this-site-grew",
  );
  await page.screenshot({ path: ".tmp/labs/article-toc-1440.png", fullPage: true });

  const ogResponse = await request.get("assets/images/site-og-card.png");
  expect(ogResponse.status()).toBe(200);
  const sitemapText = await (await request.get("sitemap.xml")).text();
  expect(sitemapText).toContain("https://zlonglab.github.io/MyWeb/frame-studio.html");
  expect(sitemapText).toContain("https://zlonglab.github.io/MyWeb/focus-lab.html");

  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
