// Publish only the same runtime files served by the local preview.
import { readFile, writeFile, mkdir, mkdtemp, lstat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { optimizerFiles } from './optimizer-files.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = await readFile(path.join(root, 'server.mjs'), 'utf8');
const map = server.match(/const files = new Map\(\[([\s\S]*?)\]\);/);
if (!map) throw Error('Cannot find the preview runtime allowlist.');
const files = [...map[1].matchAll(/\['\/([^']+)',\s*'[^']+'\]/g)].map(match => match[1]);
if (!files.includes('index.html') || !files.includes('404.html') || new Set(files).size !== files.length) {
  throw Error('Invalid runtime allowlist.');
}
for (const file of files) {
  if (!/^(?:[a-z0-9-]+\.html|sw\.js|manifest\.webmanifest|feed\.xml|sitemap\.xml|robots\.txt|assets\/[a-z0-9/_.-]+)$/.test(file)
      || file.split('/').some(part => part === '.' || part === '..')) throw Error('Unsafe runtime path.');
  let current = root;
  for (const part of file.split('/')) {
    current = path.join(current, part);
    if ((await lstat(current)).isSymbolicLink()) throw Error('Runtime symlinks are not allowed.');
  }
  if (!(await lstat(current)).isFile()) throw Error('Runtime resource is not a regular file.');
}

const option = process.argv.find(arg => arg.startsWith('--site-url='));
const site = new URL(option ? option.slice(11) : 'https://zlonglab.github.io/MyWeb/');
if (site.protocol !== 'https:' || site.username || site.password || site.search || site.hash) throw Error('Invalid site URL.');
if (!site.pathname.endsWith('/')) site.pathname += '/';
const basePath = site.pathname.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
await mkdir(path.join(root, '.tmp'), { recursive: true });
const directory = await mkdtemp(path.join(root, '.tmp', 'pages-site-'));
for (const file of files) {
  let data = await readFile(path.join(root, file));
  // Pages serves this document at arbitrary missing URLs, including nested paths.
  if (file === '404.html') data = Buffer.from(data.toString('utf8').replace('<head>', '<head>\n  <base href="' + basePath + '">'));
  await mkdir(path.dirname(path.join(directory, file)), { recursive: true });
  await writeFile(path.join(directory, file), data);
}
await writeFile(path.join(directory, '.nojekyll'), '');
const optimizer = await optimizerFiles(root);
const toolFiles = [];
for (const file of optimizer.files) {
  const relative = 'prompt-optimizer/' + file.relative;
  await mkdir(path.dirname(path.join(directory, relative)), { recursive: true });
  await writeFile(path.join(directory, relative), await readFile(file.full));
  toolFiles.push(relative);
}
await writeFile(path.join(root, '.tmp', 'pages-build.json'), JSON.stringify({ site: site.href, directory, runtimeFiles: files.length + toolFiles.length, mainFiles: files.length, optimizerFiles: toolFiles.length, files: files.concat(toolFiles) }, null, 2) + '\n');
if (process.env.GITHUB_OUTPUT) await writeFile(process.env.GITHUB_OUTPUT, 'directory=' + directory + '\n', { flag: 'a' });
console.log('Prepared ' + files.length + ' main files and ' + toolFiles.length + ' optimizer files at ' + directory);
