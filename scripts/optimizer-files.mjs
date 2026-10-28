import fs from 'node:fs/promises';
import path from 'node:path';
export function optimizerMime(file) {
  if (file.endsWith('.tar.gz')) return 'application/gzip';
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webmanifest': 'application/manifest+json', '.json': 'application/json', '.wasm': 'application/wasm', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8', '.patch': 'text/plain; charset=utf-8' };
  return types[path.extname(file)];
}
export async function optimizerFiles(root, optional = false) {
  let meta;
  try { meta = JSON.parse(await fs.readFile(path.join(root, '.tmp/optimizer-build.json'), 'utf8')); }
  catch (error) { if (optional && error.code === 'ENOENT') return null; throw Error('Build Prompt Optimizer first: npm run build:optimizer'); }
  const pin = JSON.parse(await fs.readFile(path.join(root, 'scripts/optimizer-source.json'), 'utf8'));
  if (meta.commit !== pin.commit || meta.credentialsConfigured !== false) throw Error('Unexpected optimizer build identity.');
  const directory = await fs.realpath(meta.directory);
  const tempRoot = await fs.realpath(path.join(root, '.tmp'));
  if (!directory.startsWith(tempRoot + path.sep + 'optimizer-public-') || (await fs.lstat(meta.directory)).isSymbolicLink()) throw Error('Optimizer output must be inside this checkout.');
  const files = []; let bytes = 0;
  async function walk(dir, prefix = '') {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(entry.name) || entry.isSymbolicLink()) throw Error('Unsafe optimizer output path.');
      const relative = prefix + entry.name, full = path.join(dir, entry.name);
      if (entry.isDirectory()) { await walk(full, relative + '/'); continue; }
      if (!entry.isFile() || !optimizerMime(relative) || relative.endsWith('.map')) throw Error('Unexpected optimizer resource.');
      bytes += (await fs.stat(full)).size;
      if (bytes > 64 * 1024 * 1024) throw Error('Optimizer static output exceeds 64 MB.');
      files.push({ relative, full, mime: optimizerMime(relative) });
    }
  }
  await walk(directory);
  for (const required of ['index.html', 'config.js', 'sw.js', 'manifest.webmanifest', 'deployment-info.html', 'LICENSE.txt', 'source-original.tar.gz', 'myweb-changes.patch']) if (!files.some(file => file.relative === required)) throw Error('Optimizer output is incomplete.');
  if (!/window\.runtime_config\s*=\s*\{\s*\}/.test(await fs.readFile(path.join(directory, 'config.js'), 'utf8'))) throw Error('Optimizer model configuration must be empty.');
  return { files, bytes, version: pin.version, commit: pin.commit };
}
