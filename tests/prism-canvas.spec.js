import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "no-preference", deviceScaleFactor: 2 });
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.prismPaints = 0;
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.closest(".prism-scene")) window.prismPaints++;
      return clear.apply(this, args);
    };
  });
});

async function stablePaintCount(page) {
  const before = await page.evaluate(() => window.prismPaints);
  await page.waitForTimeout(180);
  return (await page.evaluate(() => window.prismPaints)) - before;
}

test("Prism canvas is transparent, high-DPI, animated, and pauses with visibility and reduced motion", async ({
  page,
}) => {
  await page.goto("");
  await expect(page.locator("html")).toHaveAttribute(
    "data-react-ready",
    "true",
  );
  await expect
    .poll(() => page.evaluate(() => window.prismPaints))
    .toBeGreaterThan(3);
  const pixels = await page
    .locator(".prism-scene canvas")
    .evaluate((canvas) => ({
      width: canvas.width,
      cssWidth: canvas.clientWidth,
      height: canvas.height,
      cssHeight: canvas.clientHeight,
      alpha: canvas.getContext("2d").getImageData(0, 0, 1, 1).data[3],
    }));
  expect(pixels.width).toBe(pixels.cssWidth * 2);
  expect(pixels.height).toBe(pixels.cssHeight * 2);
  expect(pixels.alpha).toBe(0);
  await expect(
    page.locator("audio,.audio-capsule,.prism-object,.sphere-glow"),
  ).toHaveCount(0);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(await stablePaintCount(page)).toBe(0);
  const stopped = await page.evaluate(() => window.prismPaints);
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => page.evaluate(() => window.prismPaints))
    .toBeGreaterThan(stopped + 2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => stablePaintCount(page)).toBe(0);
  const source = await page
    .locator(".prism-scene canvas")
    .evaluate((canvas) => canvas.toDataURL());
  await page
    .locator(".prism-scene canvas")
    .hover({ position: { x: 30, y: 30 } });
  const changed = await page
    .locator(".prism-scene canvas")
    .evaluate((canvas) => canvas.toDataURL());
  expect(changed).not.toBe(source);
});

test("Canvas stops drawing after React unmount and restarts once after remount", async ({
  page,
}) => {
  const origin = "http://127.0.0.1:4193/MyWeb/";
  await page.goto(origin);
  await expect(page.locator("html")).toHaveAttribute(
    "data-react-ready",
    "true",
  );
  await expect
    .poll(() => page.evaluate(() => window.prismPaints))
    .toBeGreaterThan(3);
  await page.evaluate(async () => {
    const source = [...document.scripts].find(
      (script) =>
        script.src && new URL(script.src).pathname.endsWith("/src/main.jsx"),
    ).src;
    const main = await import(source);
    main.root.unmount();
  });
  await expect(page.locator(".prism-scene canvas")).toHaveCount(0);
  expect(await stablePaintCount(page)).toBe(0);
  const before = await page.evaluate(() => window.prismPaints);
  await page.evaluate(async () => {
    const source = [...document.scripts].find(
      (script) =>
        script.src && new URL(script.src).pathname.endsWith("/src/main.jsx"),
    ).src;
    const main = await import(source);
    window.prismRemount = main.mountSite(document.querySelector("#root"));
  });
  await expect(page.locator(".prism-scene canvas")).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => window.prismPaints))
    .toBeGreaterThan(before + 3);
});
