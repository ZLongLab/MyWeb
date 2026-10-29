import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import vm from 'node:vm';

const fixture = JSON.parse(fs.readFileSync('tests/fixtures/video-studio-1.10-export.json', 'utf8'));
const data = { window: {} };
for (const file of ['video-templates.js', 'video-lexicon.js', 'video-content-sources.js']) {
  vm.runInNewContext(fs.readFileSync('assets/' + file, 'utf8'), data);
}
const templates = data.window.VIDEO_TEMPLATES;
const key = 'myweb_video_studio_v1';
test.use({ serviceWorkers: 'block' });
async function open(page, id = 'cinematic') {
  await page.goto('video-prompts.html?template=' + id);
  await expect(page.locator('html')).toHaveAttribute('data-react-ready', 'true');
}

test('Actual old 1.10 export imports and restores all eight favorites and drafts verbatim', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());
  await open(page);
  await page.locator('#prompt-import-file').setInputFiles('tests/fixtures/video-studio-1.10-export.json');
  await expect(page.locator('.prompt-draft')).toHaveCount(8);
  await expect(page.locator('.prompt-favorite[aria-pressed="true"]')).toHaveCount(8);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key)).toEqual(fixture.data);
  await page.reload();
  for (const draft of fixture.data.drafts) {
    await page.locator(`[data-draft-open="${draft.id}"]`).click();
    await expect(page.locator('#prompt-output')).toHaveValue(draft.output);
    for (const [name, value] of Object.entries(draft.fields)) await expect(page.locator('#prompt-' + name)).toHaveValue(value);
    await expect(page.locator(`[data-output-mode="${draft.mode}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`[data-template="${draft.template}"]`)).toHaveAttribute('aria-pressed', 'true');
  }
  const downloadEvent = page.waitForEvent('download');
  await page.locator('#prompt-export').click();
  const exported = JSON.parse(fs.readFileSync(await (await downloadEvent).path(), 'utf8'));
  expect(exported.app).toBe('myweb-video-studio');
  expect(exported.version).toBe(1);
  expect(exported.data).toEqual(fixture.data);
  await page.locator('#prompt-import-file').setInputFiles('tests/fixtures/video-studio-1.10-export.json');
  await expect(page.locator('.prompt-draft')).toHaveCount(8);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key)).toEqual(fixture.data);
});

test('All fifteen complete examples are selectable, and platform briefs never cross-label models', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());
  await open(page);
  for (const template of templates) {
    await page.locator(`[data-template="${template.id}"]`).click();
    await page.locator('#prompt-example').click();
    for (const field of ['subject', 'scene', 'action', 'camera', 'look', 'duration', 'aspect', 'extra']) {
      await expect(page.locator('#prompt-' + field)).toHaveValue(template.example[field]);
    }
    await page.locator('[data-output-mode="draft"]').click();
    const draft = await page.locator('#prompt-output').inputValue();
    expect(draft).toContain('适用平台：');
    expect(draft.indexOf('主要动作：')).toBeLessThan(draft.indexOf('摄影机行为：'));
    expect(draft.indexOf('摄影机行为：')).toBeLessThan(draft.indexOf('画风与光线：'));
    await page.locator('[data-output-mode="brief"]').click();
    const brief = await page.locator('#prompt-output').inputValue();
    if (template.platform === 'kling') {
      expect(brief).toContain('可灵（kling）');
      expect(brief).not.toMatch(/Seedance/i);
    } else if (template.platform === 'seedance') {
      expect(brief).toContain('Seedance');
      expect(brief).not.toMatch(/kling|可灵/i);
    } else expect(brief).toContain('未绑定具体平台');
    await expect(page.locator('#prompt-source')).toHaveAttribute('href', template.sourceUrl);
  }
  await page.locator('#prompt-search').fill('可灵');
  await expect(page.locator('[data-template]')).toHaveCount(2);
  await page.locator('#prompt-search').fill('');
  await page.locator('[data-prompt-filter="展示"]').click();
  await expect(page.locator('[data-template]')).toHaveCount(templates.filter(template => template.family === '展示').length);
});

test('Vocabulary appends across the three pickers, respects limits and preserves manual output', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());
  await open(page, 'kling-daily');
  await page.locator('.prompt-advanced summary').click();
  expect(await page.getByLabel('添加运镜').locator('option[value]:not([value=""])').count()).toBe(16);
  expect(await page.getByLabel('添加景别或角度').locator('option[value]:not([value=""])').count()).toBe(16);
  expect(await page.getByLabel('添加光线或色彩').locator('option[value]:not([value=""])').count()).toBe(25);
  const movement = data.window.VIDEO_LEXICON.find(group => group.id === 'movement').entries[0];
  const shot = data.window.VIDEO_LEXICON.find(group => group.id === 'shot').entries[3];
  const light = data.window.VIDEO_LEXICON.find(group => group.id === 'lighting').entries[5];
  await page.getByLabel('添加运镜').selectOption(movement.value);
  await page.getByLabel('添加景别或角度').selectOption(shot.value);
  await page.getByLabel('添加光线或色彩').selectOption(light.value);
  for (const phrase of [movement.value, shot.value, light.value]) expect(await page.locator('#prompt-output').inputValue()).toContain(phrase);
  await page.locator('#prompt-output').fill('手工编辑的镜头正文，不能被词库覆盖。');
  await page.getByLabel('添加运镜').selectOption(data.window.VIDEO_LEXICON[0].entries[1].value);
  await expect(page.locator('#prompt-output')).toHaveValue('手工编辑的镜头正文，不能被词库覆盖。');
  await page.locator('#prompt-camera').fill('x'.repeat(1000));
  await page.getByLabel('添加运镜').selectOption(movement.value);
  await expect(page.locator('#prompt-camera')).toHaveValue('x'.repeat(1000));
  await expect(page.locator('#prompt-status')).toContainText('超过 1000');
  await page.locator('#prompt-camera').fill('固定机位');
  await page.locator('#prompt-save').click();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  expect(saved.version).toBe(1);
  expect(Object.keys(saved.drafts[0].fields)).toEqual(['subject', 'scene', 'action', 'look', 'camera', 'duration', 'aspect', 'extra']);
  expect(saved.drafts[0].output).toBe('手工编辑的镜头正文，不能被词库覆盖。');
});

for (const theme of ['paper', 'night']) {
  test(`Video content and source notes at desktop 1440 / ${theme}`, async ({ page, context }) => {
    const errors = [], external = [], media = [];
    context.on('request', request => {
      if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== 'http://127.0.0.1:4192') external.push(request.url());
      if (/\.(mp4|gif)(?:\?|$)/i.test(request.url())) media.push(request.url());
    });
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.addInitScript(theme => localStorage.setItem('myweb_theme_v1', theme), theme);
    await open(page, 'story-sequence');
    await expect(page.locator('[data-template]')).toHaveCount(15);
    await expect(page.locator('[data-video-source]')).toHaveCount(5);
    await expect(page.locator('#video-sources')).toContainText('未提供明确许可证');
    await expect(page.locator('#video-sources')).toContainText('CC BY 4.0');
    await expect(page.locator('#prompt-extra')).toHaveValue(/S01.*S02.*S03/s);
    await page.locator('.prompt-advanced summary').click();
    await page.getByLabel('添加景别或角度').selectOption(data.window.VIDEO_LEXICON[1].entries[3].value);
    await page.getByLabel('添加光线或色彩').selectOption(data.window.VIDEO_LEXICON[3].entries[4].value);
    expect(await page.locator('#prompt-output').inputValue()).toContain('角色');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
    await page.screenshot({ path: `.tmp/video-studio-content/1440-${theme}.png`, fullPage: true });
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
    expect(media).toEqual([]);
  });
}
