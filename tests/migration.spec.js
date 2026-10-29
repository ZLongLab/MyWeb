import { test, expect } from "@playwright/test";
import fs from "node:fs";
import vm from "node:vm";
const oldWindow = {};
for (const file of ["projects-data.js", "articles-data.js"])
  vm.runInNewContext(fs.readFileSync("assets/" + file, "utf8"), {
    window: oldWindow,
  });
const pages = fs
  .readdirSync(".")
  .filter((file) => /^[a-z0-9-]+\.html$/.test(file));
async function ready(page, path = "") {
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute(
    "data-react-ready",
    "true",
  );
}
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("myweb_theme_v1"))
      localStorage.setItem("myweb_theme_v1", "paper");
  });
});
for (const width of [1440, 390])
  test(`All sixteen pages, metadata, local resources and layout at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors = [],
      external = [],
      failed = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (
        /^https?:/.test(request.url()) &&
        new URL(request.url()).hostname !== "127.0.0.1"
      )
        external.push(request.url());
    });
    page.on("response", (response) => {
      if (response.status() >= 400) failed.push(response.url());
    });
    for (const path of pages) {
      await ready(page, path);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1:visible")).toHaveCount(1);
      if (path === "404.html")
        expect(
          await page
            .locator("main > *")
            .evaluateAll((nodes) => nodes.map((node) => node.tagName)),
        ).toEqual(["svg", "P", "H1", "P", "NAV"]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      expect(
        await page.locator('meta[property="og:url"]').getAttribute("content"),
      ).toContain("https://zlonglab.github.io/MyWeb/");
      const img = await page
        .locator('meta[property="og:image"]')
        .getAttribute("content");
      expect(img).toContain("/MyWeb/assets/images/");
      await page
        .locator("img[src]")
        .evaluateAll((images) =>
          images.forEach((img) => (img.loading = "eager")),
        );
      expect(
        await page.locator("img[src]").evaluateAll(async (images) => {
          await Promise.all(images.map((img) => img.decode().catch(() => {})));
          return images.every((img) => img.naturalWidth > 0);
        }),
      ).toBeTruthy();
    }
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
    expect(failed).toEqual([]);
  });
test("Every project and article, including missing IDs, keeps content and share metadata", async ({
  page,
}) => {
  for (const project of oldWindow.SITE_PROJECTS) {
    await ready(page, "project.html?id=" + project.id);
    await expect(page.locator("#project-title")).toHaveText(project.title);
    await expect(page.locator("#project-summary")).toHaveText(project.summary);
  }
  for (const article of oldWindow.SITE_ARTICLES) {
    await ready(page, "article.html?id=" + article.id);
    await expect(page.locator("#article-title")).toHaveText(article.title);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "article",
    );
    await expect(page.locator("#article-body")).toContainText(
      article.sections[0].paragraphs[0],
    );
  }
  await ready(page, "article.html?id=unknown");
  await expect(page.locator("#article-not-found")).toBeVisible();
  await ready(page, "project.html?id=unknown");
  await expect(page.locator("#project-not-found")).toBeVisible();
});
test("React project filters, query reload and legacy anchors", async ({
  page,
}) => {
  await ready(page, "projects.html");
  await expect(page.locator(".portfolio-project")).toHaveCount(7);
  await page.getByRole("button", { name: "本地工具", exact: true }).click();
  await expect(page.locator(".portfolio-project")).toHaveCount(
    oldWindow.SITE_PROJECTS.filter((p) => p.category === "本地工具").length,
  );
  expect(new URL(page.url()).searchParams.get("category")).toBe("本地工具");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "本地工具", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await ready(page, "projects.html#recallai");
  await expect(page).toHaveURL(/project\.html\?id=recallai/);
});
test("Article search, topic clusters, graph and filter restoration", async ({
  page,
}) => {
  await ready(page, "articles.html");
  await page.locator("#article-search").fill("RecallAI：本地检索与收纳的边界");
  await expect(page.locator("#article-list .article-row")).toHaveCount(1);
  const href = await page
    .locator("#article-list .article-row")
    .getAttribute("href");
  expect(href).toContain("q=");
  await page.locator("#article-list .article-row").click();
  await expect(page.locator("#article-title")).toContainText("RecallAI");
  await page.locator("[data-article-list-link]").first().click();
  await expect(page.locator("#article-search")).toHaveValue(
    "RecallAI：本地检索与收纳的边界",
  );
  await page.locator("#article-search").fill("never-matches-this-query");
  await expect(page.locator("#article-empty")).toBeVisible();
  await page.locator("#clear-article-filters").click();
  await expect(page.locator("#article-list .article-row")).toHaveCount(6);
  await page.locator('[data-article-view="topics"]').click();
  await expect(page.locator("#article-clusters")).toBeVisible();
  await expect(page.locator(".garden-graph-node")).toHaveCount(6);
  await expect(page.locator("#garden-map")).toBeVisible();
  await page.locator(".garden-cluster").first().click();
  await expect(page.locator("#garden-tag-filter")).toBeVisible();
});
test("Search keyboard commands and theme persistence", async ({ page }) => {
  await ready(page);
  await page.keyboard.press("Control+k");
  await expect(page.locator("#site-search-dialog")).toBeVisible();
  await page.locator("#site-search-dialog input").fill("切换纸色");
  await page.locator('[data-search-entry="command:theme"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  await page.locator("#site-search-dialog input").fill("切换到春日");
  await page.locator('[data-search-entry="command:season:spring"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-season", "spring");
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  await expect(page.locator("html")).toHaveAttribute("data-season", "spring");
  await page.locator(".nav-theme").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "paper");
});
test("Narrow navigation uses React state and closes after commands or Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const menu = page.locator("[data-menu-toggle]");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
  await menu.click();
  await page.locator(".nav-search").click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Escape");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.mouse.click(5, 700);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});
test("Picture viewer zoom, fit and focus restoration", async ({ page }) => {
  await ready(page);
  const trigger = page.locator(".home-shot-front");
  await trigger.click();
  await expect(page.locator(".image-viewer")).toBeVisible();
  await expect(page.locator("[data-image-scale]")).toHaveText("100%");
  await page.locator("[data-image-in]").click();
  await expect(page.locator("[data-image-scale]")).toHaveText("150%");
  await page.locator("[data-image-fit]").click();
  await expect(page.locator("[data-image-scale]")).toHaveText("100%");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
test("Old local notes are preserved, can merge backups, export and delete", async ({
  page,
}) => {
  await ready(page, "guestbook.html");
  const old = {
    version: 1,
    entries: [
      {
        id: "note-migration-123456",
        nickname: "迁移前便签",
        content: "需要保留的旧内容",
        createdAt: "2026-10-28T00:00:00.000Z",
      },
    ],
  };
  await page.evaluate(
    (data) => localStorage.setItem("myweb_guestbook_v1", JSON.stringify(data)),
    old,
  );
  await page.reload();
  await expect(page.locator(".guestbook-entry")).toContainText(
    "需要保留的旧内容",
  );
  await page.locator("#guestbook-name").fill("React 检查");
  await page.locator("#guestbook-content").fill("<script>这只是文字</script>");
  await page.locator("#guestbook-submit").click();
  await expect(page.locator(".guestbook-entry")).toHaveCount(2);
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#guestbook-export").click();
  const download = await downloadPromise;
  const exported = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
  expect(exported.entries).toHaveLength(2);
  await page.locator("#guestbook-import-file").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(old)),
  });
  await expect(page.locator(".guestbook-entry")).toHaveCount(2);
  await page.locator("#guestbook-import-file").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await expect(page.locator("#guestbook-error")).toBeVisible();
  await expect(page.locator(".guestbook-entry")).toHaveCount(2);
  await page.locator("[data-delete-message]").first().click();
  await page.locator("#delete-message-confirm").click();
  await expect(page.locator(".guestbook-entry")).toHaveCount(1);
});
test("Video templates, manual editing, old drafts, favorites and backups", async ({
  page,
}) => {
  page.on("dialog", (dialog) => dialog.accept());
  await ready(page, "video-prompts.html?template=cinematic");
  await expect(page.locator("[data-template]")).toHaveCount(8);
  await expect(page.locator("#prompt-subject")).not.toHaveValue("");
  await page.locator("#prompt-output").fill("手动保留的提示词");
  await page.locator("#prompt-subject").fill("灰衣书店店主");
  await expect(page.locator("#prompt-output")).toHaveValue("手动保留的提示词");
  await page.locator("#prompt-save").click();
  await expect(page.locator(".prompt-draft")).toHaveCount(1);
  await page.locator('[data-favorite="cinematic"]').click();
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#prompt-export").click();
  const download = await downloadPromise;
  const backup = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
  expect(backup.data.drafts[0].output).toBe("手动保留的提示词");
  expect(backup.data.favorites).toContain("cinematic");
  await page.reload();
  await page.locator("[data-draft-open]").click();
  await expect(page.locator("#prompt-output")).toHaveValue("手动保留的提示词");
  await page.locator("#prompt-import-file").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await expect(page.locator(".prompt-draft")).toHaveCount(1);
  await page.locator("#prompt-regenerate").click();
  expect(await page.locator("#prompt-output").inputValue()).toContain(
    "灰衣书店店主",
  );
});
test("Image examples, source credit, copy, local favorites, merge and cross-tab sync", async ({
  page,
  context,
}) => {
  await ready(page, "image-prompts.html");
  await expect(page.locator(".image-room-card")).toHaveCount(20);
  for (const category of ["人物", "产品", "海报", "场景", "插画"]) {
    await page.locator('[data-image-category="' + category + '"]').click();
    await expect(page.locator(".image-room-card")).toHaveCount(4);
  }
  await page.locator('[data-image-category="全部"]').click();
  await page.locator("#image-search").fill("水彩");
  await expect(page.locator(".image-room-card")).toHaveCount(1);
  await page.locator("#image-search").fill("");
  await page
    .getByRole("button", { name: "查看「人物引言卡的版式」", exact: true })
    .click();
  await expect(page.locator("#image-attribution")).toContainText("Nicolechan");
  await expect(page.locator("#image-attribution")).toContainText("CC BY 4.0");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedText = text;
        },
      },
    }),
  );
  await page.locator("#image-copy").click();
  expect(await page.evaluate(() => window.copiedText)).toBe(
    await page.locator("#image-prompt-text").inputValue(),
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#image-detail")).not.toBeVisible();
  await page
    .locator('[data-example="window-portrait"] .image-room-save')
    .click();
  await page.reload();
  await expect(
    page.locator('[data-example="window-portrait"] .image-room-save'),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator("#image-import-file").setInputFiles({
    name: "image.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({ version: 1, favorites: ["amber-bottle"] }),
    ),
  });
  const second = await context.newPage();
  await ready(second, "image-prompts.html");
  await second.locator('[data-example="blue-hour"] .image-room-save').click();
  await expect(
    page.locator('[data-example="blue-hour"] .image-room-save'),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("myweb_image_inspiration_v1"))
          .favorites,
    ),
  ).toEqual(
    expect.arrayContaining(["window-portrait", "amber-bottle", "blue-hour"]),
  );
  await second.close();
});
test("Corrupt local data is not overwritten", async ({ page }) => {
  await ready(page, "image-prompts.html");
  await page.evaluate(() =>
    localStorage.setItem("myweb_image_inspiration_v1", "{bad"),
  );
  await page.reload();
  await page
    .locator('[data-example="window-portrait"] .image-room-save')
    .click();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("myweb_image_inspiration_v1"),
    ),
  ).toBe("{bad");
  await ready(page, "guestbook.html");
  await page.evaluate(() => localStorage.setItem("myweb_guestbook_v1", "{bad"));
  await page.reload();
  await expect(page.locator("#guestbook-submit")).toBeDisabled();
  expect(
    await page.evaluate(() => localStorage.getItem("myweb_guestbook_v1")),
  ).toBe("{bad");
});
test("Real service worker keeps query pages and all lazy modules available offline", async ({
  page,
  context,
}) => {
  await ready(page, "image-prompts.html");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  const keys = await page.evaluate(async () => {
    const name = (await caches.keys()).find((name) => name.includes("-react-"));
    return (await (await caches.open(name)).keys()).map(
      (request) => new URL(request.url).pathname,
    );
  });
  expect(keys.length).toBe(
    JSON.parse(fs.readFileSync(".tmp/react-build.json", "utf8")).cachedFiles,
  );
  expect(
    keys.some((path) => /\/(feed.xml|sitemap.xml|robots.txt)$/.test(path)),
  ).toBeFalsy();
  await context.setOffline(true);
  await ready(page, "image-prompts.html?example=amber-bottle");
  await expect(page.locator("#image-detail")).toBeVisible();
  await ready(page, "article.html?id=recallai-local-search");
  await expect(page.locator("#article-title")).toContainText("RecallAI");
  await ready(page, "articles.html?view=topics");
  await expect(page.locator("#garden-map")).toBeVisible();
  await context.setOffline(false);
});
