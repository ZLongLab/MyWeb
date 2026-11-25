// Prepare future publishing assets only when a real public origin is supplied.
// Nothing generated here is linked from the current local website.
import { access, readFile, writeFile, mkdir } from 'node:fs/promises';
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
  if (projectWindow.SITE_PROJECTS.some(p => p.id === 'image-prompts')) paths.push('image-prompts.html');
  if (projectWindow.SITE_PROJECTS.some(p => p.id === 'image-tools')) paths.push('image-tools.html');
  if (projectWindow.SITE_PROJECTS.some(p => p.id === 'video-prompts')) paths.push('video-prompts.html');
  const hasChristmas = await access(new URL('christmas.html', root)).then(() => true, () => false);
  const hasStarlight = await access(new URL('starlight-box.html', root)).then(() => true, () => false);
  const hasFireworks = await access(new URL('fireworks.html', root)).then(() => true, () => false);
  const hasFrameStudio = await access(new URL('frame-studio.html', root)).then(() => true, () => false);
  const hasFocusLab = await access(new URL('focus-lab.html', root)).then(() => true, () => false);
  if (hasFrameStudio) paths.push('frame-studio.html');
  if (hasFocusLab) paths.push('focus-lab.html');
  if (hasStarlight) paths.push('starlight-box.html');
  if (hasFireworks) paths.push('fireworks.html');
  if (hasChristmas) paths.push('christmas.html');
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + paths.map(p => '<url><loc>' + escape(url(p)) + '</loc></url>').join('') + '</urlset>\n';
  const og = Object.fromEntries(houseWindow.SITE_HOUSE.rooms.map(r => [r.href, { title: r.name + ' · 有间小站', description: r.description, url: url(r.href), type: 'website' }]));
  og['about.html'] = { title: '关于 ZL · 有间小站', description: '计算机学生，记录实用工具与把想法做出来的过程。', url: url('about.html'), type: 'website' };
  if (hasFrameStudio) og['frame-studio.html'] = { title: '画框工坊 · 截图美化器 · 有间小站', description: '拖入或 Ctrl+V 粘贴截图，一键套上画廊渐变背景、圆角玻璃画框与柔和阴影并高清导出；全程本地处理，不上传图片。', url: url('frame-studio.html'), type: 'website' };
  if (hasFocusLab) og['focus-lab.html'] = { title: '专注时钟 · 白噪音实验室 · 有间小站', description: '纯浏览器 Web Audio 实时合成窗外细雨、冬夜壁炉、松林微风与午后溪流白噪音，搭配极简专注番茄钟与本地专注记录；零音频下载、离线可用。', url: url('focus-lab.html'), type: 'website' };
  if (hasStarlight) og['starlight-box.html'] = { title: '星轨八音盒 · 声光特辑 · 有间小站', description: '点击星格编织五声音阶旋律，支持 4 种纯 Web Audio 音色、键盘弹奏与 3D 星尘粒子绽放。', url: url('starlight-box.html'), type: 'website' };
  if (hasFireworks) og['fireworks.html'] = { title: '夜空烟花湖 · 声光特辑 · 有间小站', description: '点击夜空发射 5 种物理形态烟花，带实时湖面水波倒影、纯 Web Audio 合成音效与 1600×960 壁纸导出。', url: url('fireworks.html'), type: 'website' };
  if (hasChristmas) og['christmas.html'] = { title: '圣诞夜 · 有间小站', description: '转动粒子圣诞树，点亮盘旋的光带，换一串喜欢的灯。', url: url('christmas.html'), type: 'website', image: url('assets/images/christmas-snow-forest.webp') };
  for (const article of articles) og['article.html?id=' + article.id] = { title: article.title + ' · 有间小站', description: article.summary, url: url('article.html?id=' + encodeURIComponent(article.id)), type: 'article' };
  for (const project of projectWindow.SITE_PROJECTS) og['project.html?id=' + project.id] = { title: project.title + ' · 有间小站', description: project.summary, url: url('project.html?id=' + encodeURIComponent(project.id)), type: 'website' };
  await mkdir(new URL('.tmp/discovery/', root), { recursive: true });
  await writeFile(new URL('.tmp/discovery/feed.xml', root), feed);
  await writeFile(new URL('.tmp/discovery/sitemap.xml', root), sitemap);
  await writeFile(new URL('.tmp/discovery/og-metadata.json', root), JSON.stringify(og, null, 2) + '\n');
  console.log('已生成到 .tmp/discovery/：feed.xml、sitemap.xml、og-metadata.json；尚未启用或部署。');
} catch (error) { console.error(error.message); process.exitCode = 1; }
