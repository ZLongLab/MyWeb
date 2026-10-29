import { test, expect } from "@playwright/test";

test("List return restores scroll position and old deep section links still land correctly", async ({
  page,
}) => {
  await page.goto("articles.html?view=time");
  const last = page.locator("#article-list .article-row").last();
  await last.scrollIntoViewIfNeeded();
  const previousY = await page.evaluate(() => scrollY);
  expect(previousY).toBeGreaterThan(0);
  await last.click();
  await expect(page.locator("#article-title")).toBeVisible();
  await page.locator("[data-article-list-link]").first().click();
  await expect
    .poll(async () =>
      Math.abs((await page.evaluate(() => scrollY)) - previousY),
    )
    .toBeLessThan(2);
  await page.goto("project.html?id=recallai#project-section-3");
  await expect
    .poll(() =>
      page
        .locator("#project-section-3")
        .evaluate((node) => node.getBoundingClientRect().top),
    )
    .toBeLessThan(300);
  await page.goto("articles.html?view=topics#garden-map");
  await expect(page.locator("#garden-map")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator("#garden-map")
        .evaluate((node) => node.getBoundingClientRect().top),
    )
    .toBeLessThan(300);
});
