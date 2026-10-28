// Build a pinned, uncredentialed Prompt Optimizer for a website subdirectory.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { optimizerAppearance } from './optimizer-appearance.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const pin = JSON.parse(await fs.readFile(new URL('./optimizer-source.json', import.meta.url), 'utf8'));
const sourceArg = process.argv.find(arg => arg.startsWith('--source='));
const source = path.resolve(sourceArg ? sourceArg.slice(9) : path.join(root, '.tmp/prompt-optimizer-source'));
const env = { ...process.env };
// Optional frontend model settings must never be inherited from the builder.
for (const name of Object.keys(env)) if (/^VITE_|^(?:OPENAI|ANTHROPIC|GEMINI|DEEPSEEK|ARK|CF|MODELSCOPE).*?(?:KEY|TOKEN|SECRET)$/i.test(name)) delete env[name];
env.VITE_VERCEL_DEPLOYMENT = 'false';
env.NODE_OPTIONS = '--max-old-space-size=4096';
function run(command, args, capture = false) {
  const result = spawnSync(command, args, { cwd: source, env, stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', encoding: capture ? 'utf8' : undefined, maxBuffer: 30 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw Error('Optimizer build step failed: ' + command + ' ' + args.slice(0, 4).join(' ') + (capture ? '\n' + result.stderr : ''));
  return result.stdout;
}
if (run('git', ['rev-parse', 'HEAD'], true).trim() !== pin.commit) throw Error('Unexpected upstream source revision.');
for (const name of await fs.readdir(source)) if (/^\.env(?:\.|$)/.test(name) && !name.endsWith('.example')) throw Error('Refusing to build with an upstream environment file.');
const pristine = run('git', ['show', 'HEAD:packages/web/index.html'], true);
const { nav, style, patchTheme, templatePaths, patchTemplate } = await optimizerAppearance();
const themePath = 'packages/ui/src/config/naive-theme.ts';
await fs.writeFile(path.join(source, themePath), patchTheme(run('git', ['show', 'HEAD:' + themePath], true)));
for (const file of templatePaths) await fs.writeFile(path.join(source, file), patchTemplate(file, run('git', ['show', 'HEAD:' + file], true)));
if (process.argv.includes('--reuse-libraries')) throw Error('Theme adaptation requires rebuilding the UI library.');
const patched = pristine.replace('href="/favicon.ico"', 'href="%BASE_URL%favicon.ico"').replace('src="/config.js"', 'src="%BASE_URL%config.js"').replace('</head>', style + '\n</head>').replace('<body>', '<body>\n' + nav);
await fs.writeFile(path.join(source, 'packages/web/index.html'), patched);
const pnpmBin = env.MYWEB_PNPM_JS;
const pnpm = args => pnpmBin ? run(process.execPath, [pnpmBin, ...args]) : run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', args);
pnpm(['-F', '@prompt-optimizer/core', 'build']);
pnpm(['-F', '@prompt-optimizer/ui', 'build:bundle']);
pnpm(['-F', '@prompt-optimizer/web', 'exec', 'vite', 'build', '--base', './']);
await fs.mkdir(path.join(root, '.tmp'), { recursive: true });
const directory = await fs.mkdtemp(path.join(root, '.tmp/optimizer-public-'));
const built = path.join(source, 'packages/web/dist');
let count = 0, bytes = 0;
const allowed = /\.(?:html|js|css|png|jpe?g|webp|svg|ico|webmanifest|json|woff2?|ttf|wasm)$/;
const secrets = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/;
async function copy(dir, prefix = '') {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw Error('Symlink in optimizer output.');
    const relative = prefix + entry.name;
    if (entry.isDirectory()) { await copy(path.join(dir, entry.name), relative + '/'); continue; }
    if (!entry.isFile() || !allowed.test(relative) || relative.endsWith('.map')) throw Error('Unexpected optimizer output: ' + relative);
    const data = await fs.readFile(path.join(dir, entry.name));
    if (/\.(?:js|json|html)$/.test(relative) && secrets.test(data.toString('utf8'))) throw Error('Credential pattern in output: ' + relative);
    await fs.mkdir(path.dirname(path.join(directory, relative)), { recursive: true });
    await fs.writeFile(path.join(directory, relative), data); count++; bytes += data.length;
  }
}
await copy(built);
const config = await fs.readFile(path.join(directory, 'config.js'), 'utf8');
if (!/window\.runtime_config\s*=\s*\{\s*\}/.test(config)) throw Error('Runtime model configuration is not empty.');
const html = await fs.readFile(path.join(directory, 'index.html'), 'utf8');
if (/\b(?:src|href)="\/(?!\/)/.test(html)) throw Error('Root-relative resource escaped the optimizer directory.');
await fs.copyFile(path.join(source, 'LICENSE'), path.join(directory, 'LICENSE.txt'));
run('git', ['archive', '--format=tar.gz', '--output=' + path.join(directory, 'source-original.tar.gz'), 'HEAD']);
await fs.writeFile(path.join(directory, 'myweb-changes.patch'), run('git', ['diff', '--', 'packages/web/index.html', themePath, ...templatePaths], true));
await fs.copyFile(fileURLToPath(import.meta.url), path.join(directory, 'myweb-build.mjs'));
for (const file of ['optimizer-appearance.mjs', 'optimizer-appearance.css', 'optimizer-theme.ts']) await fs.copyFile(new URL('./' + file, import.meta.url), path.join(directory, file));
await fs.copyFile(new URL('./optimizer-source.json', import.meta.url), path.join(directory, 'optimizer-source.json'));
await fs.writeFile(path.join(directory, 'deployment-info.html'), `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>来源与许可 · 提示词优化器</title><style>body{max-width:760px;margin:48px auto;padding:0 24px;font:16px/1.9 system-ui;background:#faf7f2;color:#272c26}a{color:#2b5b46}code{overflow-wrap:anywhere}</style></head><body><p><a href="./">← 返回提示词优化器</a> · <a href="../index.html">有间小站</a></p><h1>Prompt Optimizer</h1><p>作者：linshenkx 及项目贡献者。本站部署版本 ${pin.version}，许可为 AGPL-3.0-only。</p><p>源码版本：<code>${pin.commit}</code>。</p><p>本站适配入口相对路径、纸色与夜色主题、字体及组件外观，加入小站导航；模型调用、存储与工作区沿用上游实现。没有预置模型密钥；使用者在模型管理中自行配置服务。调用会把输入发送给使用者所选的模型服务商，可能产生费用。</p><ul><li><a href="${pin.repository}/tree/${pin.commit}">浏览原始源码</a></li><li><a href="source-original.tar.gz">下载对应版本原始源码</a></li><li><a href="myweb-changes.patch">查看本站完整修改补丁</a></li><li><a href="myweb-build.mjs">查看本站构建脚本</a> · <a href="optimizer-appearance.mjs">适配脚本</a> · <a href="optimizer-appearance.css">页面样式</a> · <a href="optimizer-theme.ts">主题定义</a> · <a href="optimizer-source.json">版本配置</a></li><li><a href="LICENSE.txt">完整许可文本</a></li></ul><p>本工具与视频灵感室分别保存数据。更换网址或清理浏览器前，请先导出自己的配置、历史与收藏。</p></body></html>`);
const meta = { ...pin, directory, buildFiles: count, buildBytes: bytes, credentialsConfigured: false, base: './', sourcePatch: 'myweb-changes.patch' };
await fs.writeFile(path.join(directory, 'deployment.json'), JSON.stringify({ ...pin, credentialsConfigured: false, base: './' }, null, 2));
await fs.writeFile(path.join(root, '.tmp/optimizer-build.json'), JSON.stringify(meta, null, 2));
console.log(JSON.stringify(meta));
