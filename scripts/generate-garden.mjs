// Optional local draft generator; ordinary browsing never runs this script.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2), option = key => args.find(a => a.startsWith(key + '='))?.slice(key.length + 1);
const input = resolve(root, option('--input') || 'assets/articles-data.js');
const output = resolve(root, option('--out') || '.tmp/garden');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
function inside(path) { const p = relative(root, path); return p && !p.startsWith('..') && !p.includes(':'); }
function date(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value || '') && Number.isFinite(Date.parse(value)) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value; }
async function load(path, key) { const source = await readFile(path, 'utf8'), window = {}; runInNewContext(source, { window }, { timeout: 1000 }); return { value: window[key], source }; }
function build(articles, source) {
  if (!Array.isArray(articles) || !articles.every(a => a && typeof a.id === 'string' && a.id && typeof a.title === 'string') || new Set(articles.map(a => a.id)).size !== articles.length) throw Error('Article ids must be unique and titles must be text.');
  const sorted = articles.slice().sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0), ids = new Set(sorted.map(a => a.id)), warnings = [];
  const edges = sorted.flatMap(a => [...new Set(Array.isArray(a.links) ? a.links : [])].filter(id => {
    if (typeof id !== 'string' || !ids.has(id) || id === a.id) { warnings.push('Ignored invalid reference from ' + a.id + ': ' + String(id)); return false; } return true;
  }).sort().map(id => ({ from: a.id, to: id })));
  const adjacent = new Map(sorted.map(a => [a.id, new Set()]));
  edges.forEach(e => { adjacent.get(e.from).add(e.to); adjacent.get(e.to).add(e.from); });
  const seen = new Set(); let largestComponent = 0;
  for (const a of sorted) { if (seen.has(a.id)) continue; const queue = [a.id]; seen.add(a.id); let size = 0;
    while (queue.length) { const id = queue.shift(); size++; for (const next of adjacent.get(id)) if (!seen.has(next)) { seen.add(next); queue.push(next); } } largestComponent = Math.max(largestComponent, size);
  }
  const nodes = sorted.map((a, i) => ({ id: a.id, title: a.title, maturity: ['seed', 'growing', 'evergreen'].includes(a.maturity) ? a.maturity : 'seed', citations: edges.filter(e => e.to === a.id).length, x: 150 + (i % 3) * 300, y: 60 + Math.floor(i / 3) * 150, r: 14 + Math.min(8, edges.filter(e => e.to === a.id).length) * 2 }));
  const data = { version: 1, sourceHash: createHash('sha256').update(source).digest('hex'), eligible: largestComponent >= 3, height: Math.max(170, Math.ceil(nodes.length / 3) * 150), nodes, edges };
  const lines = edges.map(e => { const a = nodes.find(n => n.id === e.from), b = nodes.find(n => n.id === e.to); return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#d7c7a5" stroke-width="2"/>`; }).join('');
  const circles = nodes.map(n => `<a href="../../article.html?id=${escape(encodeURIComponent(n.id))}" tabindex="0"><title>${escape(n.title)}</title><rect class="hit" x="${n.x - 105}" y="${n.y - 35}" width="210" height="96" rx="6" fill="transparent"/><circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${{seed:'#e0bd76',growing:'#c38c2c',evergreen:'#8e600e'}[n.maturity]}"/><text x="${n.x}" y="${n.y + 47}" text-anchor="middle" fill="#302718" font-family="sans-serif" font-size="14">${escape(Array.from(n.title).slice(0, 13).join('') + (Array.from(n.title).length > 13 ? '…' : ''))}</text></a>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${data.height}" role="group" aria-label="园子里的路"><title>园子里的路</title><style>a:focus{outline:none}a:focus .hit,a:hover .hit{stroke:#8e600e;stroke-width:2}</style>${lines}${circles}</svg>\n`;
  return { data, svg, warnings };
}
try {
  if (!inside(input) || !inside(output) || !relative(root, output).replaceAll('\\', '/').startsWith('.tmp/')) throw Error('Input must be inside this project; drafts must stay under .tmp/.');
  const { value, source } = await load(input, 'SITE_ARTICLES'), result = build(value, source);
  let old = {}; try { old = (await load(resolve(root, 'assets/garden-data.js'), 'SITE_GARDEN_GRAPH')).value || {}; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (args.includes('--approve')) {
    if (input !== resolve(root, 'assets/articles-data.js')) throw Error('Test input cannot be approved.');
    const reviewedAt = option('--reviewed'), today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    if (!date(reviewedAt) || reviewedAt > today) throw Error('Approval requires a real --reviewed=YYYY-MM-DD date, not a future date.');
    const draft = JSON.parse(await readFile(resolve(output, 'garden-data.json'), 'utf8')), svg = await readFile(resolve(output, 'garden-graph.svg'), 'utf8');
    if (JSON.stringify(draft) !== JSON.stringify(result.data) || svg !== result.svg) throw Error('Draft differs from current articles. Generate and review again; approved files were not changed.');
    await writeFile(resolve(root, 'assets/images/garden-graph.svg'), result.svg);
    await writeFile(resolve(root, 'assets/garden-data.js'), '// Explicitly reviewed static graph; do not edit generated positions.\nwindow.SITE_GARDEN_GRAPH = ' + JSON.stringify({ ...result.data, reviewedAt }, null, 2) + ';\n');
    console.log(JSON.stringify({ approved: true, reviewedAt, nodes: result.data.nodes.length, edges: result.data.edges.length, eligible: result.data.eligible }));
  } else {
    await mkdir(output, { recursive: true });
    await writeFile(resolve(output, 'garden-data.json'), JSON.stringify(result.data)); await writeFile(resolve(output, 'garden-graph.svg'), result.svg);
    const summary = { draft: relative(root, output).replaceAll('\\', '/'), published: false, nodes: { before: old.nodes?.length || 0, after: result.data.nodes.length, change: result.data.nodes.length - (old.nodes?.length || 0) }, edges: { before: old.edges?.length || 0, after: result.data.edges.length, change: result.data.edges.length - (old.edges?.length || 0) }, eligible: result.data.eligible, warnings: result.warnings };
    await writeFile(resolve(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n'); console.log(JSON.stringify(summary));
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
