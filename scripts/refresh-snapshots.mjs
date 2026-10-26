// Optional maintenance only. The website never runs this script or fetches GitHub.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const args = new Set(process.argv.slice(2));
const draftPath = new URL('.tmp/github-snapshot-draft.json', root);
const approvedPath = new URL('assets/site-snapshot.js', root);
const login = 'ZLongLab';
function today() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
function dayString(date) { return date.toISOString().slice(0, 10); }
async function readData(path, key) {
  const source = await readFile(new URL(path, root), 'utf8'); const window = {};
  runInNewContext(source, { window }, { timeout: 1000 });
  return { value: window[key], hash: createHash('sha256').update(source).digest('hex') };
}
function attr(attrs, name) { return new RegExp('(?:^|\\s)' + name + '="([^"]*)"').exec(attrs)?.[1]; }
function decode(text) { return text.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').trim(); }
function validateGithub(data) {
  if (data?.login !== login || data.status !== 'ready' || !/^\d{4}-\d{2}-\d{2}$/.test(data.from) || !/^\d{4}-\d{2}-\d{2}$/.test(data.to) || data.weeks?.length !== 26) throw Error('Invalid public calendar identity or range.');
  const days = data.weeks.flatMap(w => w.days);
  if (data.weeks.some((week, i) => !Array.isArray(week.days) || (i < 25 ? week.days.length !== 7 : week.days.length < 1 || week.days.length > 7))) throw Error('Invalid calendar week boundaries.');
  if (data.sourceURL !== 'https://github.com/users/' + login + '/contributions?from=' + data.from + '&to=' + data.to) throw Error('Unexpected public calendar source.');
  const dates = new Set();
  let expected = Date.parse(data.from + 'T00:00:00Z');
  for (const day of days) {
    if (day.date !== dayString(new Date(expected)) || dates.has(day.date) || !Number.isInteger(day.count) || day.count < 0 || !Number.isInteger(day.level) || day.level < 0 || day.level > 4) throw Error('Invalid or non-contiguous calendar day.');
    dates.add(day.date); expected += 86400000;
  }
  if (dayString(new Date(expected - 86400000)) !== data.to || data.total !== days.reduce((sum, day) => sum + day.count, 0)) throw Error('Calendar totals do not match the date range.');
}
async function fetchPublicGithub() {
  const end = new Date(today() + 'T12:00:00Z');
  const start = new Date(end); start.setUTCDate(end.getUTCDate() - 25 * 7 - end.getUTCDay());
  const from = dayString(start), to = dayString(end);
  const sourceURL = 'https://github.com/users/' + login + '/contributions?from=' + from + '&to=' + to;
  const response = await fetch(sourceURL, { headers: { 'User-Agent': 'MyWeb-local-snapshot/1.0', 'Accept': 'text/html' }, signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw Error('Public GitHub calendar returned HTTP ' + response.status);
  const html = await response.text(); if (html.length > 6000000) throw Error('Calendar response is unexpectedly large.');
  const tips = new Map();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attr(match[1], 'for'); if (id) tips.set(id, decode(match[2]));
  }
  const byDate = new Map();
  for (const match of html.matchAll(/<td\b([^>]*)>/g)) {
    const date = attr(match[1], 'data-date'); if (!date || date < from || date > to) continue;
    const level = Number(attr(match[1], 'data-level'));
    const tip = tips.get(attr(match[1], 'id')) || '';
    const countText = /^(\d[\d,]*) contributions?\b/i.exec(tip);
    const legacyCount = attr(match[1], 'data-count');
    const count = countText ? Number(countText[1].replaceAll(',', '')) : /^No contributions\b/i.test(tip) ? 0 : legacyCount !== undefined ? Number(legacyCount) : NaN;
    if (!Number.isInteger(count) || !Number.isInteger(level)) throw Error('GitHub calendar markup changed; no snapshot was published.');
    byDate.set(date, { date, count, level });
  }
  const weeks = Array.from({ length: 26 }, () => ({ days: [] }));
  for (let cursor = new Date(start), index = 0; cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1), index++) {
    const date = dayString(cursor), day = byDate.get(date);
    if (!day) throw Error('Public calendar is incomplete at ' + date + '; keep the previous approved snapshot.');
    weeks[Math.floor(index / 7)].days.push(day);
  }
  const data = { login, status: 'ready', sourceURL, fetchedAt: new Date().toISOString(), from, to, weeks, total: weeks.flatMap(w => w.days).reduce((sum, day) => sum + day.count, 0), svg: 'assets/images/github-activity.svg' };
  validateGithub(data); await mkdir(new URL('.tmp/', root), { recursive: true });
  await writeFile(draftPath, JSON.stringify(data, null, 2) + '\n');
  console.log(JSON.stringify({ draft: '.tmp/github-snapshot-draft.json', login, from, to, weeks: weeks.length, days: byDate.size, total: data.total, published: false }));
}
function githubSvg(github) {
  const colors = ['#34443a', '#426b4e', '#648c63', '#8eb37c', '#c0d59a'];
  const rects = github.weeks.flatMap((week, w) => week.days.map((day, d) => '<rect class="contribution-day" data-week="' + w + '" x="' + (28 + w * 13) + '" y="' + (18 + d * 13) + '" width="10" height="10" rx="2" fill="' + colors[day.level] + '"><title>' + day.date + '：' + day.count + ' 次公开贡献</title></rect>')).join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 370 122" role="img" aria-labelledby="title desc"><title id="title">ZLongLab 最近 26 周公开贡献</title><desc id="desc">' + github.from + ' 至 ' + github.to + '，共 ' + github.total + ' 次。公开贡献日历的静态快照。</desc><g font-family="Consolas,monospace" font-size="8" fill="#b9cbb5"><text x="0" y="39">一</text><text x="0" y="65">三</text><text x="0" y="91">五</text><text x="28" y="120">' + github.from + '</text><text x="280" y="120">' + github.to + '</text></g>' + rects + '</svg>\n';
}
async function generate(approve) {
  const [articles, projects, house] = await Promise.all([readData('assets/articles-data.js', 'SITE_ARTICLES'), readData('assets/projects-data.js', 'SITE_PROJECTS'), readData('assets/house-data.js', 'SITE_HOUSE')]);
  let previous = {}; try { previous = (await readData('assets/site-snapshot.js', 'SITE_SNAPSHOT')).value || {}; } catch (e) { if (e.code !== 'ENOENT') throw e; }
  let github = previous.github || { login, status: 'unavailable' }, reviewedAt = previous.reviewedAt || '';
  if (approve) {
    reviewedAt = [...args].find(arg => arg.startsWith('--reviewed='))?.slice(11) || '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt) || !Number.isFinite(Date.parse(reviewedAt + 'T00:00:00Z')) || dayString(new Date(reviewedAt + 'T00:00:00Z')) !== reviewedAt || reviewedAt > today()) throw Error('Approval requires an actual --reviewed=YYYY-MM-DD date.');
    github = JSON.parse(await readFile(draftPath, 'utf8')); validateGithub(github);
    await writeFile(new URL(github.svg, root), githubSvg(github));
  }
  const text = articles.value.map(article => (article.sections || []).map(section => [section.heading || '', ...(section.paragraphs || []), ...(section.list || [])].join('')).join('')).join('');
  const snapshot = {
    generatedAt: new Date().toISOString(), reviewedAt, siteStarted: house.value.started,
    statistics: { articles: articles.value.length, words: (text.match(/[\p{L}\p{N}]/gu) || []).length, projects: projects.value.length },
    sources: { articles: { file: 'assets/articles-data.js', sha256: articles.hash }, projects: { file: 'assets/projects-data.js', sha256: projects.hash }, wordCount: '文章小节标题、段落与列表中的字母和数字计数，不包含标点' }, github
  };
  await writeFile(approvedPath, '// Generated by scripts/refresh-snapshots.mjs. GitHub changes require explicit review.\nwindow.SITE_SNAPSHOT = ' + JSON.stringify(snapshot, null, 2) + ';\n');
  console.log(JSON.stringify({ output: 'assets/site-snapshot.js', statistics: snapshot.statistics, github: github.status, reviewedAt, networkRequested: false }));
}
try {
  if (args.has('--github')) await fetchPublicGithub();
  else await generate(args.has('--approve-github'));
} catch (error) { console.error(error.message); process.exitCode = 1; }
