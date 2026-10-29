import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import zlib from 'node:zlib';

// Deterministic, actual PNG input without adding an image/PNG test dependency.
function png(width = 1024, height = 768) {
  const crc = data => {
    let value = 0xffffffff;
    for (const byte of data) {
      value ^= byte;
      for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
    }
    return (value ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const label = Buffer.from(type), length = Buffer.alloc(4), checksum = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    checksum.writeUInt32BE(crc(Buffer.concat([label, data])));
    return Buffer.concat([length, label, data, checksum]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  let seed = 73;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const offset = y * (width * 4 + 1) + 1 + x * 4;
    raw[offset] = (x * 255 / width + (seed & 31)) & 255;
    raw[offset + 1] = (y * 255 / height + ((seed >>> 8) & 31)) & 255;
    raw[offset + 2] = ((x + y) / 8 + ((seed >>> 16) & 31)) & 255;
    raw[offset + 3] = x < 8 && y < 8 ? 0 : 255;
  }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const sample = png();
const upload = (name = 'workshop-test.png', buffer = sample) => ({ name, mimeType: 'image/png', buffer });

function network(context) {
  const wasm = [], external = [], uploads = [], errors = [];
  context.on('request', request => {
    const url = request.url();
    if (/^https?:/.test(url) && new URL(url).origin !== 'http://127.0.0.1:4192') external.push(url);
    if (new URL(url).pathname.endsWith('.wasm')) wasm.push(url);
    if (!['GET', 'HEAD'].includes(request.method())) uploads.push(url);
  });
  context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  context.pages().forEach(page => page.on('pageerror', error => errors.push(error.message)));
  return { wasm, external, uploads, errors };
}
async function open(page) {
  await page.goto('image-tools.html');
  await expect(page.locator('html')).toHaveAttribute('data-react-ready', 'true');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('图片工坊。');
}
async function finish(page, count = 1) {
  await expect(page.locator('[data-image-status="done"]')).toHaveCount(count, { timeout: 45000 });
  await expect(page.getByRole('button', { name: '开始转换', exact: true })).toBeEnabled();
}
async function output(page) {
  return page.locator('.image-tools-download').first().evaluate(async link => {
    const blob = await (await fetch(link.href)).blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0);
    const value = { type: blob.type, size: blob.size, width: bitmap.width, height: bitmap.height, corner: [...context.getImageData(0, 0, 1, 1).data] };
    bitmap.close();
    return value;
  });
}

test.use({ serviceWorkers: 'block' });

test('Image workshop lazily converts a real PNG to a smaller WebP and downloads it without external requests', async ({ page, context }) => {
  const requests = network(context);
  await open(page);
  expect(requests.wasm).toEqual([]);
  expect(page.workers()).toHaveLength(0);
  await page.getByLabel('选择需要转换的图片').setInputFiles(upload());
  expect(requests.wasm).toEqual([]);
  await page.getByRole('button', { name: '开始转换', exact: true }).click();
  await finish(page);
  const result = await output(page);
  expect(result.type).toBe('image/webp');
  expect(result.size).toBeGreaterThan(0);
  expect(result.size).toBeLessThan(sample.length);
  const downloadEvent = page.waitForEvent('download');
  await page.locator('.image-tools-download').click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('workshop-test-01.webp');
  const bytes = fs.readFileSync(await download.path());
  expect(bytes.subarray(0, 4).toString()).toBe('RIFF');
  expect(bytes.subarray(8, 12).toString()).toBe('WEBP');
  fs.writeFileSync('.tmp/image-tools-conversion.json', JSON.stringify({ inputBytes: sample.length, outputBytes: result.size, type: result.type, width: result.width, height: result.height, download: download.suggestedFilename(), wasmRequests: requests.wasm, external: requests.external, uploads: requests.uploads }, null, 2));
  expect(requests.wasm).toHaveLength(1);
  expect(requests.wasm[0]).toMatch(/webp_enc[^/]*\.wasm$/);
  expect(requests.external).toEqual([]);
  expect(requests.uploads).toEqual([]);
  expect(requests.errors).toEqual([]);
});

test('All four formats, alpha handling, resize and singleton single-thread codec loading work', async ({ page, context }) => {
  test.setTimeout(60000);
  const requests = network(context);
  await open(page);
  await page.getByLabel('选择需要转换的图片').setInputFiles(upload());
  await page.getByLabel('目标格式', { exact: true }).selectOption('png');
  await expect(page.getByRole('slider')).toBeDisabled();
  await page.getByLabel('尺寸档').selectOption('1920');
  await page.getByRole('button', { name: '开始转换', exact: true }).click();
  await finish(page);
  expect(await output(page)).toMatchObject({ type: 'image/png', width: 1024, height: 768, corner: [0, 0, 0, 0] });
  expect(requests.wasm).toEqual([]);
  await page.getByLabel('尺寸档').selectOption('640');
  const results = [];
  for (const format of ['webp', 'jpeg', 'avif', 'png', 'webp', 'jpeg', 'avif']) {
    await page.getByLabel('目标格式', { exact: true }).selectOption(format);
    await page.getByRole('button', { name: '开始转换', exact: true }).click();
    await finish(page);
    const result = await output(page);
    results.push({ format, ...result });
    expect(result).toMatchObject({ type: `image/${format}`, width: 640, height: 480 });
    if (format === 'jpeg') expect(result.corner.slice(0, 3).every(value => value > 240)).toBeTruthy();
  }
  expect(requests.wasm).toHaveLength(4);
  expect(new Set(requests.wasm).size).toBe(4);
  expect(requests.wasm.some(url => /_mt|hqx|magic|simd/.test(url))).toBeFalsy();
  expect(page.workers()).toHaveLength(1);
  expect(await page.evaluate(() => crossOriginIsolated)).toBeFalsy();
  expect(requests.external).toEqual([]);
  expect(requests.uploads).toEqual([]);
  expect(requests.errors).toEqual([]);
  fs.writeFileSync('.tmp/image-tools-formats.json', JSON.stringify({ results, wasmRequests: requests.wasm, external: requests.external, uploads: requests.uploads, workers: page.workers().length, crossOriginIsolated: await page.evaluate(() => crossOriginIsolated) }, null, 2));
});

test('An invalid image does not block subsequent jobs, and completed files can all download', async ({ page }) => {
  await open(page);
  await page.getByLabel('选择需要转换的图片').setInputFiles([upload('broken.png', Buffer.from('not an image')), upload('one.png'), upload('two.png')]);
  await page.getByRole('button', { name: '开始转换', exact: true }).click();
  await finish(page, 2);
  await expect(page.locator('[data-image-status="error"]')).toHaveCount(1);
  await expect(page.locator('.image-tools-error')).toContainText('处理失败');
  const downloads = [];
  page.on('download', download => downloads.push(download.suggestedFilename()));
  await page.getByRole('button', { name: '全部下载', exact: true }).click();
  await expect.poll(() => downloads.length).toBe(2);
  expect(downloads).toEqual(['one-02.webp', 'two-03.webp']);
  await page.getByRole('button', { name: '清空列表' }).click();
  await expect(page.locator('.image-tools-item')).toHaveCount(0);
});

test('Tool entry points connect workbench, projects and commands, and file drop works', async ({ page }) => {
  await page.goto('workbench.html');
  await page.getByRole('link', { name: '打开图片工坊 →', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('图片工坊。');
  const transfer = await page.evaluateHandle(base64 => {
    const data = new DataTransfer();
    data.items.add(new File([Uint8Array.from(atob(base64), character => character.charCodeAt(0))], 'drop-test.png', { type: 'image/png' }));
    return data;
  }, sample.toString('base64'));
  await page.dispatchEvent('.image-tools-drop', 'drop', { dataTransfer: transfer });
  await transfer.dispose();
  await expect(page.locator('.image-tools-file h3')).toHaveText('drop-test.png');
  await page.goto('projects.html');
  await expect(page.locator('#image-tools a')).toHaveAttribute('href', 'image-tools.html');
  await page.locator('.nav-search').click();
  await page.locator('#site-search-dialog input').fill('图片工坊');
  await expect(page.locator('#site-search-dialog a[href="image-tools.html"]').first()).toBeVisible();
  await page.locator('#site-search-dialog a[href="image-tools.html"]').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('图片工坊。');
});

for (const width of [1280, 1440, 1920]) for (const theme of ['paper', 'night']) {
  test(`Desktop five-image queue stays responsive at ${width} / ${theme}`, async ({ page, context }) => {
    const requests = network(context);
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(({ theme }) => {
      localStorage.setItem('myweb_theme_v1', theme);
      localStorage.setItem('myweb_season_v1', 'autumn');
    }, { theme });
    await open(page);
    await page.getByLabel('选择需要转换的图片').setInputFiles(Array.from({ length: 5 }, (_, i) => upload(`batch-${i + 1}.png`)));
    await page.evaluate(() => {
      window.workshopTicks = 0;
      window.workshopStates = [];
      window.workshopTimer = setInterval(() => window.workshopTicks++, 20);
      window.workshopObserver = new MutationObserver(() => {
        window.workshopStates.push([...document.querySelectorAll('.image-tools-item')].map(item => item.dataset.imageStatus));
      });
      window.workshopObserver.observe(document.querySelector('.image-tools-list'), { subtree: true, attributes: true, attributeFilter: ['data-image-status'] });
    });
    await page.getByRole('button', { name: '开始转换', exact: true }).click();
    const scrolling = await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
      return { y: window.scrollY, busy: document.querySelector('.image-tools-actions button').disabled };
    });
    expect(scrolling.y).toBeGreaterThan(100);
    expect(scrolling.busy).toBeTruthy();
    await finish(page, 5);
    const responsiveness = await page.evaluate(() => {
      clearInterval(window.workshopTimer);
      window.workshopObserver.disconnect();
      return { ticks: window.workshopTicks, states: window.workshopStates };
    });
    expect(responsiveness.ticks).toBeGreaterThan(5);
    expect(responsiveness.states.every(state => state.filter(value => value === 'processing').length <= 1)).toBeTruthy();
    expect(responsiveness.states.some(state => state.includes('done') && state.includes('processing'))).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.screenshot({ path: `.tmp/image-tools-visual/${width}-${theme}.png`, fullPage: true });
    fs.mkdirSync('.tmp/image-tools-visual', { recursive: true });
    fs.writeFileSync(`.tmp/image-tools-visual/${width}-${theme}.json`, JSON.stringify({ scrolling, responsiveness, external: requests.external, wasm: requests.wasm }, null, 2));
    expect(requests.wasm).toHaveLength(1);
    expect(requests.external).toEqual([]);
    expect(requests.errors).toEqual([]);
  });
}

test('The cached workshop shell opens offline, excludes all WASM and clearly asks to reconnect', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4192/MyWeb/image-tools.html');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    const keys = await page.evaluate(async () => {
      const names = await caches.keys();
      const cache = await caches.open(names.find(name => name.startsWith('myweb-shell-')));
      return (await cache.keys()).map(request => request.url);
    });
    expect(keys.some(url => url.endsWith('/image-tools.html'))).toBeTruthy();
    expect(keys.some(url => new URL(url).pathname.endsWith('.wasm'))).toBeFalsy();
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('图片工坊。');
    await expect(page.locator('.image-tools-offline')).toContainText('首次转换需要联网');
    await page.getByLabel('选择需要转换的图片').setInputFiles(upload());
    await page.getByRole('button', { name: '开始转换', exact: true }).click();
    await expect(page.locator('.image-tools-notice')).toContainText('请先联网');
    expect(page.workers()).toHaveLength(0);
  } finally { await context.close(); }
});
