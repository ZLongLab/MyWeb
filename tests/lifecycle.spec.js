import { test, expect } from "@playwright/test";

test("Development entry can unmount and remount without duplicate native integrations", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:4193/MyWeb/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-react-ready",
    "true",
  );
  for (let iteration = 0; iteration < 2; iteration++) {
    await page.evaluate(async () => {
      const source = [...document.scripts].find(
        (script) =>
          script.src && new URL(script.src).pathname.endsWith("/src/main.jsx"),
      ).src;
      const entry = await import(source);
      (window.testRoot || entry.root).unmount();
    });
    await expect(page.locator("main")).toHaveCount(0);
    await expect(
      page.locator(
        "#site-search-dialog, .image-viewer, .floating-top, .site-toast",
      ),
    ).toHaveCount(0);
    await page.evaluate(async () => {
      const source = [...document.scripts].find(
        (script) =>
          script.src && new URL(script.src).pathname.endsWith("/src/main.jsx"),
      ).src;
      const entry = await import(source);
      window.testRoot = entry.mountSite(document.getElementById("root"));
    });
    await expect(page.locator("html")).toHaveAttribute(
      "data-react-ready",
      "true",
    );
    await expect(page.locator(".nav-theme")).toHaveCount(1);
    await expect(page.locator("#site-search-dialog")).toHaveCount(1);
    await expect(page.locator(".image-viewer")).toHaveCount(1);
    await expect(page.locator(".site-header-sentinel")).toHaveCount(1);
    const before = await page.locator("html").getAttribute("data-theme");
    await page.locator(".nav-theme").click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      before === "paper" ? "night" : "paper",
    );
  }
  expect(errors).toEqual([]);
});
