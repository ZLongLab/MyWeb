import { test, expect } from '@playwright/test';
import fs from 'node:fs';

test('Prompt engines and catalogs load only in their own tool pages', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('html')).toHaveAttribute('data-react-ready', 'true');
  expect(await page.evaluate(() => [window.IMAGE_INSPIRATION, window.IMAGE_CORE, window.VIDEO_TEMPLATES, window.VIDEO_CORE].every(value => value === undefined))).toBeTruthy();
  await page.goto('image-prompts.html');
  await expect(page.locator('.image-room-card')).toHaveCount(20);
  expect(await page.evaluate(() => !!window.IMAGE_CORE && window.VIDEO_TEMPLATES === undefined)).toBeTruthy();
  await page.goto('video-prompts.html');
  await expect(page.locator('[data-template]')).toHaveCount(8);
  expect(await page.evaluate(() => !!window.VIDEO_CORE && window.IMAGE_INSPIRATION === undefined)).toBeTruthy();
});

test('React Compiler output and Fast Refresh preserve an active project filter', async ({ page, request }) => {
  const origin = 'http://127.0.0.1:4193/MyWeb/';
  const response = await request.get(origin + 'src/components/ProjectCard.jsx');
  const transformed = await response.text();
  expect(transformed).toMatch(/react(?:\/|_)compiler-runtime/);
  expect(transformed).toContain('react.memo_cache_sentinel');
  expect(transformed).toContain('$RefreshReg$');
  const boundary = await request.get(origin + 'src/components/Navbar.jsx');
  expect(await boundary.text()).not.toContain('$RefreshReg$');

  await page.goto(origin + 'projects.html');
  await page.getByRole('button', { name: '本地工具', exact: true }).click();
  const count = await page.locator('.portfolio-project').count();
  await page.evaluate(() => { window.hotRefreshMarker = 'preserve-this-document'; });
  const file = 'src/components/ProjectCard.jsx';
  const original = fs.readFileSync(file, 'utf8');
  const updated = original.replace('aria-label="项目技术与特点"', 'aria-label="项目技术与特点 · 热更新检查"');
  expect(updated).not.toBe(original);
  try {
    fs.writeFileSync(file, updated);
    await expect(page.locator('.portfolio-tags').first()).toHaveAttribute('aria-label', '项目技术与特点 · 热更新检查');
    expect(await page.evaluate(() => window.hotRefreshMarker)).toBe('preserve-this-document');
    await expect(page.getByRole('button', { name: '本地工具', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.portfolio-project')).toHaveCount(count);
    await expect(page.locator('.nav-theme')).toHaveCount(1);
  } finally {
    // Restore only our own temporary edit, preserving any concurrent human edit.
    if (fs.readFileSync(file, 'utf8') === updated) fs.writeFileSync(file, original);
  }
  await expect(page.locator('.portfolio-tags').first()).toHaveAttribute('aria-label', '项目技术与特点');
});
