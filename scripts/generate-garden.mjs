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
function shortLabel(title) {
  let label = title.split(/[：:。.!！？?]/u)[0].trim();
  if (/^[A-Za-z][A-Za-z0-9 _.-]*$/.test(label)) return label;
  if (Array.from(label).length > 10) label = label.split(/[，,]/u)[0].trim();
  if (Array.from(label).length > 10) label = label.replace('一个', '');
  return Array.from(label).slice(0, 10).join('');
}
function nodeShape(node) {
  const { x, y, r, maturity } = node;
  const ring = `<circle class="garden-node-ring" cx="${x}" cy="${y}" r="${r}" fill="${maturity === 'evergreen' ? 'currentColor' : 'none'}"/>`;
  if (maturity === 'evergreen') return ring;
  if (maturity === 'growing') return ring + `<path class="garden-node-half" d="M${x} ${y - r}a${r} ${r} 0 0 1 0 ${r * 2}Z"/>`;
  return ring + `<circle class="garden-node-seed" cx="${x}" cy="${y}" r="2"/>`;
}
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
  const isolated = sorted.filter(a => adjacent.get(a.id).size === 0);
  const connected = sorted.filter(a => adjacent.get(a.id).size > 0);
  const groups = [isolated, connected];
  const nodes = groups.flatMap((group, index) => group.map((a, i) => {
    const slots = index === 0 ? [[135, 120], [250, 190], [385, 120]] : isolated.length ? [[555, 60], [760, 120], [610, 190]] : [[190, 60], [705, 120], [430, 190]];
    const citations = edges.filter(e => e.to === a.id).length, [x, y] = slots[i % 3];
    return { id: a.id, title: a.title, label: shortLabel(a.title), maturity: ['seed', 'growing', 'evergreen'].includes(a.maturity) ? a.maturity : 'seed', citations, x, y: y + Math.floor(i / 3) * 200, r: 10 + Math.min(3, citations), isolated: index === 0 };
  }));
  const data = { version: 2, sourceHash: createHash('sha256').update(source).digest('hex'), eligible: largestComponent >= 3, height: 250 + Math.max(0, Math.ceil(Math.max(isolated.length, connected.length) / 3) - 1) * 200, nodes, edges };
  const zones = Array.from({ length: Math.ceil(isolated.length / 3) }, (_, row) => `<g class="garden-waiting-zone" aria-hidden="true"><ellipse cx="250" cy="${145 + row * 200}" rx="220" ry="95"/><text x="48" y="${42 + row * 200}">${isolated.every(a => !a.maturity || a.maturity === 'seed') ? '还没连上小径的种子' : '还没连上小径的记录'}</text></g>`).join('');
  const lines = edges.map(e => { const a = nodes.find(n => n.id === e.from), b = nodes.find(n => n.id === e.to); const cx = (a.x + b.x) / 2 + (b.y - a.y) * .075, cy = (a.y + b.y) / 2 - (b.x - a.x) * .075; return `<path class="garden-graph-edge" data-from="${escape(e.from)}" data-to="${escape(e.to)}" d="M${a.x} ${a.y}Q${cx} ${cy} ${b.x} ${b.y}" aria-hidden="true"/>`; }).join('');
  const circles = nodes.map(n => `<a class="garden-graph-node" data-article-id="${escape(n.id)}" data-maturity="${n.maturity}" href="../../article.html?id=${escape(encodeURIComponent(n.id))}" tabindex="0" aria-label="${escape(n.title)}"><title>${escape(n.title)}</title><rect class="garden-hit" x="${n.x - 100}" y="${n.y - 30}" width="200" height="64" rx="6"/>${nodeShape(n)}<text class="garden-node-label" x="${n.x}" y="${n.y + 27}" text-anchor="middle">${escape(n.label)}</text></a>`).join('');
  const style = `.garden-canvas{--garden-ink:#93620a;--garden-label:#302718}.garden-graph-edge{fill:none;stroke:var(--garden-ink);stroke-opacity:.45;stroke-width:1.8}.garden-graph-node{color:var(--garden-ink)}.garden-node-ring{stroke:currentColor;stroke-width:1.8}.garden-node-half,.garden-node-seed{fill:currentColor}.garden-node-label{fill:var(--garden-label);font:15px sans-serif}.garden-hit{fill:transparent;stroke:transparent}.garden-canvas a:focus{outline:none}.garden-canvas a:focus .garden-hit,.garden-canvas a:hover .garden-hit{stroke:var(--garden-ink);stroke-width:2}.garden-waiting-zone ellipse{fill:none;stroke:var(--garden-ink);stroke-opacity:.18;stroke-dasharray:3 6}.garden-waiting-zone text{fill:var(--garden-ink);font:12px sans-serif}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="garden-canvas" viewBox="0 0 900 ${data.height}" role="group" aria-label="园子里的路"><title>园子里的路</title><desc>实线为人工维护的文章引用；虚线只围住暂无引用的记录，不表示它们互相引用。种子为空心点，生长中为半填，常青为实心。</desc><style>${style}</style>${zones}${lines}${circles}</svg>\n`;
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
    await writeFile(resolve(root, 'public/assets/images/garden-graph.svg'), result.svg);
    await writeFile(resolve(root, 'assets/garden-data.js'), '// Explicitly reviewed static graph; do not edit generated positions.\nwindow.SITE_GARDEN_GRAPH = ' + JSON.stringify({ ...result.data, reviewedAt, svg: result.svg }, null, 2) + ';\n');
    console.log(JSON.stringify({ approved: true, reviewedAt, nodes: result.data.nodes.length, edges: result.data.edges.length, eligible: result.data.eligible }));
  } else {
    await mkdir(output, { recursive: true });
    await writeFile(resolve(output, 'garden-data.json'), JSON.stringify(result.data)); await writeFile(resolve(output, 'garden-graph.svg'), result.svg);
    const summary = { draft: relative(root, output).replaceAll('\\', '/'), published: false, nodes: { before: old.nodes?.length || 0, after: result.data.nodes.length, change: result.data.nodes.length - (old.nodes?.length || 0) }, edges: { before: old.edges?.length || 0, after: result.data.edges.length, change: result.data.edges.length - (old.edges?.length || 0) }, layout: { version: result.data.version, height: { before: old.height, after: result.data.height }, movedNodes: result.data.nodes.filter(n => { const previous = old.nodes?.find(a => a.id === n.id); return !previous || previous.x !== n.x || previous.y !== n.y; }).length, isolatedNodes: result.data.nodes.filter(n => n.isolated).length }, eligible: result.data.eligible, warnings: result.warnings };
    await writeFile(resolve(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n'); console.log(JSON.stringify(summary));
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
