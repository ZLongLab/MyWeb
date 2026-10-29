// Apply inspected generator output without changing body content or resource paths.
import fs from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const base = 'https://zlonglab.github.io/MyWeb/';
const recordOption = process.argv.find(arg => arg.startsWith('--record-dir='));
const recordDir = recordOption ? recordOption.slice(13) : 'docs/discovery-1.8';
if (!/^docs\/[a-z0-9][a-z0-9.-]*$/.test(recordDir) || recordDir.includes('..')) throw Error('Record directory must be one named directory under docs/.');
const image = base + 'assets/images/recallai-preview-960.webp';
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const generated = JSON.parse(await fs.readFile(new URL('.tmp/discovery/og-metadata.json', root), 'utf8'));
for (const data of Object.values(generated)) if (!data.url.startsWith(base)) throw Error('Unexpected generator origin.');
const differences = [];
const pages = (await fs.readdir(root)).filter(file => file.endsWith('.html')).sort();
for (const file of pages) {
  let html = await fs.readFile(new URL(file, root), 'utf8');
  html = html.replace(/  <!-- discovery:start -->[\s\S]*?<!-- discovery:end -->\r?\n/g, '');
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = decode(html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || '');
  if (!title || !description) throw Error('Missing existing metadata in ' + file);
  const metadata = generated[file] || { title, description, url: base + file, type: file === 'article.html' ? 'article' : 'website' };
  if (metadata.title !== title || metadata.description !== description) differences.push({ file, html: { title, description }, generator: metadata });
  const properties = { 'og:title': metadata.title, 'og:description': metadata.description, 'og:type': metadata.type, 'og:url': metadata.url, 'og:image': image };
  const twitter = { 'twitter:card': 'summary_large_image', 'twitter:title': metadata.title, 'twitter:description': metadata.description, 'twitter:url': metadata.url, 'twitter:image': image };
  const lines = Object.entries(properties).map(([key, value]) => '  <meta property="' + key + '" content="' + escape(value) + '">').concat(Object.entries(twitter).map(([key, value]) => '  <meta name="' + key + '" content="' + escape(value) + '">'));
  if (file === 'article.html' || file === 'articles.html') lines.push('  <link rel="alternate" type="application/rss+xml" title="有间小站" href="feed.xml">');
  const block = '  <!-- discovery:start -->\n' + lines.join('\n') + '\n  <!-- discovery:end -->\n';
  html = html.replace('</head>', block + '</head>');
  await fs.writeFile(new URL(file, root), html);
}
for (const file of ['feed.xml', 'sitemap.xml']) {
  const content = await fs.readFile(new URL('.tmp/discovery/' + file, root));
  const text = content.toString('utf8');
  const urls = [...text.matchAll(/<(?:loc|link|guid\b[^>]*?)>(https?:[^<]*)<\//g)].map(match => match[1]);
  if (!urls.length || urls.some(url => !url.startsWith(base))) throw Error('Unexpected public URL in ' + file);
  await fs.writeFile(new URL('public/' + file, root), content);
}
await fs.writeFile(new URL('public/robots.txt', root), 'User-agent: *\nAllow: /\nSitemap: ' + base + 'sitemap.xml\n');
await fs.mkdir(new URL(recordDir + '/', root), { recursive: true });
await fs.writeFile(new URL(recordDir + '/og-metadata.json', root), JSON.stringify(generated, null, 2) + '\n');
await fs.writeFile(new URL(recordDir + '/generator-differences.json', root), JSON.stringify({ base, image, metadataDifferences: differences, fallbackPages: pages.filter(file => !generated[file]), sitemapNote: 'Preserved generator output and existing HTML/query URLs. Image room has an explicit standalone URL; no standalone video room, 404 or bare detail shells. No clean URLs generated.', robotsNote: 'Generator emits no robots.txt; added Allow and Sitemap only.' }, null, 2) + '\n');
console.log(JSON.stringify({ htmlPages: pages.length, generatorMetadataDifferences: differences.length, fallbackPages: pages.filter(file => !generated[file]), published: false }));
