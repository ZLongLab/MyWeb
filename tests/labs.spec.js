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

test("Christmas tree countdown, tap-to-light, music box, and greeting card PNG export work cleanly", async ({
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

  await page.goto("christmas.html");
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.locator(".date-text")).toContainText("12 月");

  // Direct tap on the tree canvas silhouette lights the tree.
  const box = await page.locator(".tree-lights").boundingBox();
  await page.mouse.click(box.x + box.width * 0.63, box.y + box.height * 0.5);
  await expect(page.locator("#christmas")).toHaveAttribute("data-lit", "true");
  await expect(page.getByRole("button", { name: "调暗树灯" })).toBeVisible();

  // Switch theme to ice and toggle Web Audio music box.
  await page.getByRole("button", { name: "冰蓝" }).click();
  await expect(page.locator("#christmas")).toHaveAttribute("data-color", "ice");

  const musicBtn = page.getByRole("button", { name: "音乐" });
  await expect(musicBtn).toHaveAttribute("aria-pressed", "false");
  await musicBtn.click();
  await expect(musicBtn).toHaveAttribute("aria-pressed", "true");
  await musicBtn.click();
  await expect(musicBtn).toHaveAttribute("aria-pressed", "false");

  // Open greeting card modal, apply preset + signature, and download PNG.
  await page.getByRole("button", { name: "贺卡" }).click();
  await expect(page.locator("#card-dialog")).toBeVisible();
  await page.getByRole("button", { name: "平安顺遂" }).click();
  await expect(page.locator(".wish")).toContainText("平安夜的雪轻轻落下");
  await page.locator("#card-sign-input").fill("ZL");

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#card-download").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("christmas-card-ice.png");
  const bytes = fs.readFileSync(await download.path());
  expect(bytes.subarray(1, 4).toString()).toBe("PNG");

  await page.locator("#card-close").click();
  await expect(page.locator("#card-dialog")).not.toBeVisible();

  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("Site polish: Frame code/quote cards, Focus custom duration, Notes edit/pin/filter, and Workbench Data Vault", async ({
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

  // Top nav exposes Workbench toolbox and empty rooms stay tidy.
  await page.goto("uses.html");
  await expect(page.locator("html")).toHaveAttribute("data-react-ready", "true");
  await expect(page.locator('#site-nav a[href="workbench.html"]')).toHaveText("工具箱");
  await expect(page.locator("#uses-hardware")).not.toBeVisible();
  await expect(page.locator("#uses-defaults")).not.toBeVisible();

  // Frame Studio code card & quote card modes.
  await page.goto("frame-studio.html");
  await expect(page.locator("html")).toHaveAttribute("data-react-ready", "true");
  await page.getByRole("button", { name: "代码卡片" }).click();
  await expect(page.locator("#frame-code-input")).toBeVisible();
  await page.getByRole("button", { name: "引文摘录" }).click();
  await expect(page.locator("#frame-quote-input")).toBeVisible();

  // Focus Lab custom minutes.
  await page.goto("focus-lab.html");
  await expect(page.locator("html")).toHaveAttribute("data-react-ready", "true");
  await page.locator("#focus-custom-minutes").fill("12");
  await page.getByRole("button", { name: "设为专注" }).click();
  await expect(page.locator(".focus-clock-digits")).toHaveText("12:00");

  // Guestbook: save without nickname, pin, edit, and filter.
  await page.goto("guestbook.html");
  await expect(page.locator("html")).toHaveAttribute("data-react-ready", "true");
  await page.locator("#guestbook-content").fill("一条不用填名字的快捷灵感");
  await page.locator("#guestbook-submit").click();
  await expect(page.locator(".guestbook-entry-name").first()).toHaveText("随手记");
  await page.locator("[data-pin-message]").first().click();
  await expect(page.locator(".guestbook-pin-badge")).toHaveText("置顶");
  await page.locator("[data-edit-message]").first().click();
  await page.locator(".guestbook-edit-area").fill("修改后的置顶灵感");
  await page.locator(".guestbook-edit-save").click();
  await expect(page.locator(".guestbook-entry-content").first()).toHaveText("修改后的置顶灵感");
  await page.locator("#guestbook-filter").fill("不存在的词");
  await expect(page.locator(".guestbook-entry")).toHaveCount(0);
  await page.locator("#guestbook-filter").fill("");
  await expect(page.locator(".guestbook-entry")).toHaveCount(1);

  // Workbench Local Data Vault exports and restores local vault JSON.
  await page.goto("workbench.html");
  await expect(page.locator("html")).toHaveAttribute("data-react-ready", "true");
  await expect(page.locator("#vault")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#vault-export-all").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("myweb-local-vault-");
  const vaultJson = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
  expect(vaultJson.app).toBe("myweb-local-vault");
  expect(vaultJson.stores.myweb_guestbook_v1.entries).toHaveLength(1);

  await page.evaluate(() => localStorage.removeItem("myweb_guestbook_v1"));
  await page.locator("#vault-import-file").setInputFiles({
    name: "vault.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(vaultJson)),
  });
  await expect(page.locator("#vault-status")).toContainText("已恢复");
  const restored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("myweb_guestbook_v1") || "{}"),
  );
  expect(restored.entries).toHaveLength(1);

  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("Audio-visual editions: Starlight Music Box and Midnight Fireworks Lake work cleanly offline", async ({
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

  // 1. Starlight Music Box: timbre, palette, presets, playback, keyboard play, share hash.
  await page.goto("starlight-box.html");
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("星轨八音盒。");
  await page.getByRole("button", { name: "温暖电钢" }).click();
  await expect(page.getByRole("button", { name: "温暖电钢" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "极光翡翠" }).click();
  await expect(page.locator("#starlight-app")).toHaveAttribute("data-palette", "aurora");
  await page.getByRole("button", { name: "雨夜回响" }).click();
  await expect(page.locator("#star-play")).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("a");
  await page.locator("#star-share").click();
  expect(await page.evaluate(() => location.hash)).toMatch(/^#m=epiano\.\d+\.[0-9a-z]{32}$/);
  await page.locator("#star-play").click();
  await expect(page.locator("#star-play")).toHaveAttribute("aria-pressed", "false");
  await page.locator("#star-collapse").click();
  await expect(page.locator("#star-grid-wrap")).toBeHidden();
  await page.locator("#star-collapse").click();
  await expect(page.locator("#star-grid-wrap")).toBeVisible();

  // 2. Midnight Fireworks Lake: palettes, shapes, sound, salvo, and 1600x960 PNG wallpaper export.
  await page.goto("fireworks.html");
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("夜空烟花湖。");
  await page.getByRole("button", { name: "极光青碧" }).click();
  await expect(page.locator("#fireworks-app")).toHaveAttribute("data-palette", "aurora");
  await page.getByRole("button", { name: "星环" }).click();
  await expect(page.getByRole("button", { name: "星环" })).toHaveAttribute("aria-pressed", "true");
  await page.locator("#fw-sound").click();
  await expect(page.locator("#fw-sound")).toHaveAttribute("aria-pressed", "true");
  await page.locator("#fw-salvo").click();

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#fw-save").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("fireworks-lake-aurora.png");
  const bytes = fs.readFileSync(await download.path());
  expect(bytes.subarray(1, 4).toString()).toBe("PNG");

  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
