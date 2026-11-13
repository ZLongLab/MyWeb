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

test("Audio capsule plays, pauses, seeks and selects local tracks", async ({
  page,
}) => {
  await page.goto("");
  await expect(page.locator("html")).toHaveAttribute(
    "data-react-ready",
    "true",
  );
  const samples = 16000;
  const wav = Buffer.alloc(44 + samples * 2);
  wav.write("RIFF");
  wav.writeUInt32LE(36 + samples * 2, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24);
  wav.writeUInt32LE(16000, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(samples * 2, 40);
  await page.getByLabel("添加本地音频").setInputFiles([
    { name: "晨间.wav", mimeType: "audio/wav", buffer: wav },
    { name: "雨后.wav", mimeType: "audio/wav", buffer: wav },
  ]);
  await expect(page.locator(".audio-title")).toContainText("晨间.wav");
  await page.getByRole("button", { name: "播放", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "暂停", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "暂停", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "播放", exact: true }),
  ).toBeVisible();
  await page.getByLabel("播放进度").fill("1");
  await expect(page.getByLabel("播放进度")).toHaveValue("1");
  await page.getByRole("button", { name: "下一首" }).click();
  await expect(page.locator(".audio-title")).toContainText("雨后.wav");
});
