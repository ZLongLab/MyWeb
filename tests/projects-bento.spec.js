import { test, expect } from "@playwright/test";
import fs from "node:fs";

test("Whole project cards keep native links, keyboard access and filter context", async ({
  page,
}) => {
  await page.goto("projects.html");
  const destinations = await page
    .locator(".portfolio-title a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(destinations).toHaveLength(8);
  for (const [index, destination] of destinations.entries()) {
    await page.goto("projects.html");
    const target = new URL(destination, page.url());
    const card = page.locator(".portfolio-project").nth(index);
    const bounds = await card.boundingBox();
    await card.click({ position: { x: bounds.width - 10, y: 10 } });
    await expect(page).toHaveURL(
      (url) => url.pathname === target.pathname && url.search === target.search,
    );
  }
  await page.goto("projects.html");
  const imageCard = page.locator("#image-prompts");
  const visual = imageCard.locator(".inspiration-visual");
  const visualBounds = await visual.boundingBox();
  await page.mouse.click(
    visualBounds.x + visualBounds.width / 2,
    visualBounds.y + visualBounds.height / 2,
  );
  await expect(page).toHaveURL(/\/image-prompts\.html$/);

  await page.goto("projects.html");
  await page.getByRole("button", { name: "本地工具", exact: true }).click();
  const link = page.locator("#recallai .portfolio-title a");
  await page.keyboard.press("Tab");
  await link.focus();
  await expect(link).toBeFocused();
  await expect
    .poll(() =>
      link.evaluate((node) => getComputedStyle(node, "::after").outlineWidth),
    )
    .toBe("2px");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/project\.html\?id=recallai&category=/);
});

for (const width of [1440, 390]) {
  test(`Project Bento keeps routes, filters and decorative widgets at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(() =>
      localStorage.setItem("myweb_theme_v1", "paper"),
    );
    await page.goto("projects.html");
    await expect(page.locator("html")).toHaveAttribute(
      "data-react-ready",
      "true",
    );
    const cards = page.locator("[data-project-list] .portfolio-project");
    await expect(cards).toHaveCount(8);
    await expect(page.locator(".portfolio-state")).toContainText("持续打磨");
    await expect(page.locator(".portfolio-glass-aside svg")).toHaveCount(1);
    await expect(
      page.locator("#image-tools .portfolio-title a"),
    ).toHaveAttribute("href", "image-tools.html");
    await expect(
      page.locator("#image-prompts .portfolio-title a"),
    ).toHaveAttribute("href", "image-prompts.html");
    await expect(page.locator(".portfolio-project img")).toHaveCount(0);
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      columns: getComputedStyle(
        document.querySelector("[data-project-list]"),
      ).gridTemplateColumns.split(" ").length,
      spans: [...document.querySelectorAll(".portfolio-project")].map(
        (card) => getComputedStyle(card).gridColumn,
      ),
      radius: getComputedStyle(
        document.querySelector(".portfolio-filters button"),
      ).borderRadius,
      targets: [...document.querySelectorAll(".portfolio-filters button")].map(
        (button) => button.getBoundingClientRect().height,
      ),
    }));
    expect(layout.overflow).toBe(false);
    expect(layout.columns).toBe(12);
    expect(layout.radius).toBe("30px");
    expect(layout.targets.every((height) => height >= 44)).toBe(true);
    const filterBackgrounds = await page
      .locator(".portfolio-filters button")
      .evaluateAll((buttons) =>
        buttons
          .slice(0, 2)
          .map((button) => getComputedStyle(button).backgroundColor),
      );
    expect(filterBackgrounds[0]).not.toBe(filterBackgrounds[1]);
    expect(layout.spans).toEqual(
      (width === 1440 ? [6, 6, 6, 3, 3, 7, 5, 12] : Array(8).fill(12)).map(
        (span) => `span ${span}`,
      ),
    );

    if (width === 1440) {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.locator("#image-tools").hover();
      await expect
        .poll(() =>
          page
            .locator(".conversion-visual")
            .evaluate(
              (node) => new DOMMatrix(getComputedStyle(node).transform).m42,
            ),
        )
        .toBe(-7);
      const swatch = page.locator(".palette-fan > span").first();
      const rotation = await swatch.evaluate(
        (node) => getComputedStyle(node).transform,
      );
      await page.locator("#image-prompts").hover();
      await expect
        .poll(() => swatch.evaluate((node) => getComputedStyle(node).transform))
        .not.toBe(rotation);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.locator("#image-tools").hover();
      await expect(page.locator(".conversion-visual")).toHaveCSS(
        "transform",
        "none",
      );
    }

    fs.mkdirSync(".tmp/projects-bento", { recursive: true });
    await page.screenshot({
      path: `.tmp/projects-bento/projects-${width}.png`,
      fullPage: true,
    });
    const local = page.getByRole("button", { name: "本地工具", exact: true });
    await local.click();
    await expect(cards).toHaveCount(2);
    await expect(local).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await expect(
      page.getByRole("button", { name: "本地工具", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(cards).toHaveCount(2);
    await expect(page.locator("#recallai .portfolio-title a")).toHaveAttribute(
      "href",
      /project\.html\?id=recallai.*category=/,
    );
    await page.getByRole("button", { name: "全部", exact: true }).click();
    await expect(cards).toHaveCount(8);
  });
}
