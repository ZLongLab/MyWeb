import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import vm from 'node:vm';

const key = 'myweb_video_studio_v1';
const legacy = { window: {} };
vm.runInNewContext(fs.readFileSync('tests/fixtures/video-studio-1.11-core.txt', 'utf8'), legacy);
const oldCore = legacy.window.VIDEO_CORE;
fs.mkdirSync('.tmp/video-studio-dialects', { recursive: true });
test.use({ serviceWorkers: 'block' });
async function open(page) {
  await page.goto('video-prompts.html');
  await expect(page.locator('html')).toHaveAttribute('data-react-ready', 'true');
}
async function state(page) { return page.evaluate(key => JSON.parse(localStorage.getItem(key)), key); }
async function exported(page) {
  const event = page.waitForEvent('download');
  await page.locator('#prompt-export').click();
  return JSON.parse(fs.readFileSync(await (await event).path(), 'utf8'));
}
async function importData(page, backup) {
  await page.locator('#prompt-import-file').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
}

test('All five platforms filter templates and immediately recompose without losing any filled field', async ({ page }) => {
  const dialogs = [];
  page.on('dialog', async dialog => { dialogs.push(dialog.message()); await dialog.accept(); });
  await open(page);
  await page.locator('.prompt-advanced summary').click();
  const values = { subject: '穿蓝外套的店主', scene: '傍晚的旧书店', action: '拾起明信片后微笑', camera: '缓慢推近', look: '暖色台灯与蓝色暮光', extra: '结尾停在微笑。不展示卡片文字；不增加其他人物。', duration: '约 10 秒', aspect: '横屏 16:9' };
  for (const [name, value] of Object.entries(values)) {
    if (name === 'aspect') await page.locator('#prompt-' + name).selectOption(value);
    else await page.locator('#prompt-' + name).fill(value);
  }
  for (const [platform, count] of [['seedance', 13], ['kling', 5], ['sora', 3], ['runway', 3], ['generic', 3], ['seedance', 13]]) {
    await page.locator('#prompt-platform').selectOption(platform);
    await expect(page.locator('[data-template]')).toHaveCount(count);
    for (const [name, value] of Object.entries(values)) await expect(page.locator('#prompt-' + name)).toHaveValue(value);
    const output = await page.locator('#prompt-output').inputValue();
    if (platform === 'seedance') {
      expect(output).not.toContain('\n');
      expect(output).not.toContain('分镜序列：');
      expect(output).toContain('不展示卡片文字');
      expect(output).not.toContain('不增加其他人物');
    } else {
      expect(output).toContain('\n\n分镜序列：\nS01｜0–10 秒');
      expect(output).toMatch(/缓慢推近（[^）]*[A-Za-z][^）]*）/);
    }
  }
  await page.locator('#prompt-output').fill('手动编辑的旧输出');
  await page.locator('#prompt-platform').selectOption('sora');
  await expect(page.locator('#prompt-output')).not.toHaveValue('手动编辑的旧输出');
  await expect(page.locator('#prompt-status')).toContainText('全部表单内容保留');
  await page.locator('[data-prompt-filter="展示"]').click();
  await page.locator('#prompt-search').fill('自然');
  await page.locator('#prompt-platform').selectOption('kling');
  await expect(page.locator('#prompt-search')).toHaveValue('自然');
  await expect(page.locator('[data-prompt-filter="展示"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-template]')).toHaveCount(1);
  expect(dialogs).toEqual([]);
});

test('Real new export is accepted by the unchanged 1.11 importer and its old export is readable in 1.12', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());
  await open(page);
  await page.locator('[data-favorite="cinematic"]').click();
  await page.locator('#prompt-platform').selectOption('sora');
  await page.locator('#prompt-save').click();
  const saved = await state(page);
  expect(saved.drafts[0].platform).toBe('sora');
  await page.reload();
  await page.locator('[data-draft-open]').click();
  await expect(page.locator('#prompt-platform')).toHaveValue('sora');
  await expect(page.locator('#prompt-output')).toHaveValue(saved.drafts[0].output);
  const backup = await exported(page);
  expect(backup.version).toBe(1);
  expect(backup.data.version).toBe(1);
  const ids = await page.evaluate(() => window.VIDEO_TEMPLATES.map(template => template.id));
  const oldState = JSON.parse(JSON.stringify(oldCore.merge(oldCore.empty(), backup.data, ids)));
  expect(oldState.favorites).toEqual(saved.favorites);
  expect(oldState.drafts[0]).toEqual(Object.fromEntries(Object.entries(saved.drafts[0]).filter(([name]) => name !== 'platform')));
  await page.evaluate(key => localStorage.removeItem(key), key);
  await page.reload();
  await importData(page, { ...backup, data: oldState });
  await expect(page.locator('.prompt-draft')).toHaveCount(1);
  expect(await state(page)).toEqual(oldState);
  await page.locator('#prompt-platform').selectOption('kling');
  await page.locator('[data-draft-open]').click();
  await expect(page.locator('#prompt-platform')).toHaveValue('seedance');
  await expect(page.locator('#prompt-output')).toHaveValue(saved.drafts[0].output);
  expect((await exported(page)).data).toEqual(oldState);
});

test('Invalid platform or colliding draft rejects the whole import without changing existing data', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());
  await open(page);
  await page.locator('#prompt-save').click();
  const original = await state(page);
  const backup = await exported(page);
  const bad = structuredClone(backup);
  bad.data.favorites = ['pet'];
  bad.data.drafts = [{ ...original.drafts[0], id: 'new-first-draft' }, { ...original.drafts[0], id: 'invalid-second-draft', platform: 'unknown' }];
  await importData(page, bad);
  await expect(page.locator('#prompt-status')).toContainText('原有资料保持不变');
  expect(await state(page)).toEqual(original);
  const conflict = structuredClone(backup);
  conflict.data.drafts[0].platform = 'kling';
  await importData(page, conflict);
  await expect(page.locator('#prompt-status')).toContainText('同编号');
  expect(await state(page)).toEqual(original);
});

for (const theme of ['paper', 'night']) {
  test(`Dialect selector, rich preview and sources at 1440 / ${theme}`, async ({ page, context }) => {
    const external = [], errors = [];
    context.on('request', request => {
      if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== 'http://127.0.0.1:4192') external.push(request.url());
    });
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.addInitScript(theme => localStorage.setItem('myweb_theme_v1', theme), theme);
    await open(page);
    await page.locator('#prompt-platform').selectOption('kling');
    await expect(page.locator('[data-video-source="platform-dialects"]')).toContainText('只借简派与繁派的划分方法');
    const geometry = await page.locator('#prompt-platform').boundingBox();
    expect(geometry.height).toBeGreaterThanOrEqual(44);
    expect(geometry.width).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('#prompt-output').scrollWidth <= document.querySelector('#prompt-output').clientWidth)).toBeTruthy();
    await page.screenshot({ path: `.tmp/video-studio-dialects/1440-${theme}.png`, fullPage: true });
    expect(external).toEqual([]);
    expect(errors).toEqual([]);
  });
}
