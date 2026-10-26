// Prepare future publishing assets only when a real public origin is supplied.
// Nothing generated here is linked from the current local website.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
const root = new URL('../', import.meta.url);
const option = process.argv.find(arg => arg.startsWith('--site-url='));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
try {
  if (!option) throw Error('尚未生成：开放前请传入真实地址 --site-url=https://你的域名/ 。');
  const base = new URL(option.slice(11));
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash || ['localhost', '127.0.0.1', 'example.com'].includes(base.hostname)) throw Error('需要真实的 HTTPS 发布地址，不使用占位域名。');
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  const window = {}; runInNewContext(await readFile(new URL('assets/articles-data.js', root), 'utf8'), { window }, { timeout: 1000 });
  const houseWindow = {}; runInNewContext(await readFile(new URL('assets/house-data.js', root), 'utf8'), { window: houseWindow }, { timeout: 1000 });
  const projectWindow = {}; runInNewContext(await readFile(new URL('assets/projects-data.js', root), 'utf8'), { window: projectWindow }, { timeout: 1000 });
  const articles = window.SITE_ARTICLES.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const url = path => new URL(path, base).href;
  const items = articles.map(a => '<item><title>' + escape(a.title) + '</title><link>' + escape(url('article.html?id=' + encodeURIComponent(a.id))) + '</link><guid isPermaLink="true">' + escape(url('article.html?id=' + encodeURIComponent(a.id))) + '</guid><pubDate>' + new Date(a.date + 'T12:00:00+08:00').toUTCString() + '</pubDate><description>' + escape(a.summary) + '</description></item>').join('');
  const feed = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>有间小站</title><link>' + escape(base.href) + '</link><description>ZL 的作品与开发手记</description><language>zh-CN</language>' + items + '</channel></rss>\n';
  const paths = [...houseWindow.SITE_HOUSE.rooms.map(r => r.href), 'about.html', ...articles.map(a => 'article.html?id=' + encodeURIComponent(a.id)), ...projectWindow.SITE_PROJECTS.map(p => 'project.html?id=' + encodeURIComponent(p.id))];
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + paths.map(p => '<url><loc>' + escape(url(p)) + '</loc></url>').join('') + '</urlset>\n';
  const og = Object.fromEntries(houseWindow.SITE_HOUSE.rooms.map(r => [r.href, { title: r.name + ' · 有间小站', description: r.description, url: url(r.href), type: 'website' }]));
  og['about.html'] = { title: '关于 ZL · 有间小站', description: '计算机学生，记录实用工具与把想法做出来的过程。', url: url('about.html'), type: 'website' };
  for (const article of articles) og['article.html?id=' + article.id] = { title: article.title + ' · 有间小站', description: article.summary, url: url('article.html?id=' + encodeURIComponent(article.id)), type: 'article' };
  for (const project of projectWindow.SITE_PROJECTS) og['project.html?id=' + project.id] = { title: project.title + ' · 有间小站', description: project.summary, url: url('project.html?id=' + encodeURIComponent(project.id)), type: 'website' };
  await mkdir(new URL('.tmp/discovery/', root), { recursive: true });
  await writeFile(new URL('.tmp/discovery/feed.xml', root), feed);
  await writeFile(new URL('.tmp/discovery/sitemap.xml', root), sitemap);
  await writeFile(new URL('.tmp/discovery/og-metadata.json', root), JSON.stringify(og, null, 2) + '\n');
  console.log('已生成到 .tmp/discovery/：feed.xml、sitemap.xml、og-metadata.json；尚未启用或部署。');
} catch (error) { console.error(error.message); process.exitCode = 1; }
