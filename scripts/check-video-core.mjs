import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context = { window: {} };
vm.createContext(context);
for (const file of ['assets/video-templates.js', 'assets/video-dialects.js', 'assets/video-lexicon.js', 'assets/video-content-sources.js', 'assets/video-prompts-core.js']) vm.runInContext(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'), context);
const { VIDEO_TEMPLATES: templates, VIDEO_CORE: core } = context.window;
const ids = templates.map(t => t.id);
assert.equal(new Set(ids).size, 15);
assert.equal(ids.slice(0, 8).join(','), 'cinematic,anime,stop-motion,product,travel,music,pet,storyboard');
assert.equal(context.window.VIDEO_CONTENT_SOURCES.length, 6);
assert.equal(context.window.VIDEO_LEXICON.reduce((sum, group) => sum + group.entries.length, 0), 57);
const fields = Object.fromEntries(core.fields.map(k => [k, templates[0].example[k] || '']));
const draft = { id: 'test-1', template: ids[0], title: '测试草稿', fields, mode: 'draft', output: '<img src=x onerror=alert(1)>', updated: '2026-10-28T08:00:00.000Z' };
const state = { version: 1, favorites: [ids[0]], drafts: [draft] };
assert.equal(core.validate(state, ids).drafts[0].output, draft.output);
assert.equal(core.merge(state, state, ids).drafts.length, 1);
assert.throws(() => core.merge(state, { ...state, drafts: [{ ...draft, output: 'conflicting edits' }] }, ids), /同编号/);
assert.equal(state.drafts[0].output, draft.output);
assert.throws(() => core.validate({ ...state, favorites: ['unknown'] }, ids), /未知/);
assert.throws(() => core.validate({ ...state, drafts: [draft, draft] }, ids), /重复/);
assert.throws(() => core.validate({ ...state, drafts: Array.from({ length: 51 }, (_, i) => ({ ...draft, id: 'test-' + i })) }, ids), /50/);
assert.throws(() => core.validate({ ...state, drafts: [{ ...draft, fields: { ...fields, subject: 'x'.repeat(1001) } }] }, ids), /1000/);
assert.throws(() => core.validate({ ...state, drafts: [{ ...draft, output: 'x'.repeat(20001) }] }, ids), /超出/);
assert.throws(() => core.validate({ ...state, drafts: [{ ...draft, fields: { ...fields, aspect: 'javascript:alert(1)' } }] }, ids), /构图/);
for (const t of templates) {
  assert.ok(['seedance', 'kling', '通用'].includes(t.platform));
  assert.ok(['simple', 'rich', 'both'].includes(t.dialect));
  for (const key of core.fields) assert.ok(typeof t.example[key] === 'string' && t.example[key].length > 0 && t.example[key].length <= 1000, `${t.id}: ${key}`);
  assert.ok(t.sourceRefs.length && t.sourceRefs.every(id => context.window.VIDEO_CONTENT_SOURCES.some(source => source.id === id)));
  const values = Object.fromEntries(core.fields.map(k => [k, t.example[k] || '']));
  const text = core.compose(t, values, 'draft'), brief = core.compose(t, values, 'brief');
  assert.ok(text.includes(values.subject));
  assert.ok(brief.includes('不要声称已生成或验证视频'));
  if (t.platform === 'seedance') assert.ok(!text.includes('\n') && !text.includes('分镜序列：'));
  else assert.ok(text.includes('分镜序列：') && text.includes('0–'));
  if (t.platform === 'kling') { assert.ok(brief.includes('可灵（kling）')); assert.ok(!/Seedance/i.test(brief)); }
  if (t.platform === 'seedance') { assert.ok(brief.includes('Seedance')); assert.ok(!/kling|可灵/.test(brief)); }
  if (t.platform === '通用') assert.ok(brief.includes('未绑定具体平台'));
}
assert.ok(templates.some(t => t.dialect === 'simple') && templates.some(t => t.dialect === 'rich'));
const comparison = { ...fields, camera: '缓慢推近', extra: '结尾停在微笑。不展示卡片文字；不增加其他人物；保持外套一致。后期添加纸张声。' };
const simple = core.compose(templates[0], comparison, 'draft', 'seedance');
const rich = core.compose(templates[0], comparison, 'draft', 'kling');
assert.ok(!simple.includes('\n') && !/(?:场景与妆造|分镜序列|镜头语言|光影氛围|约束与后期)：/.test(simple));
for (const [before, after] of [['subject', 'action'], ['action', 'scene'], ['scene', 'camera'], ['camera', 'look']]) assert.ok(simple.indexOf(comparison[before]) < simple.indexOf(comparison[after]));
assert.ok(simple.includes('不展示卡片文字') && !simple.includes('不增加其他人物') && !simple.includes('保持外套一致') && !simple.includes('后期添加'));
for (const heading of ['场景与妆造', '分镜序列', '镜头语言', '光影氛围', '约束与后期']) assert.ok(rich.includes('\n\n' + heading + '：\n'));
assert.ok(rich.includes('S01｜0–10 秒') && rich.includes('缓慢推近（Push-in / Dolly-in）'));
assert.ok(rich.includes(comparison.extra));
assert.ok(core.compose(templates[0], { ...comparison, camera: '缓慢推近（Slow push-in）' }, 'draft', 'kling').includes('缓慢推近（Slow push-in）\n\n'));
assert.ok(core.compose(templates[0], { ...comparison, duration: '' }, 'draft', 'sora').includes('0 秒起，结束秒数待定'));
const storyboard = templates.find(t => t.id === 'story-sequence');
assert.ok(core.compose(storyboard, storyboard.example, 'draft', 'generic').includes('S03｜6–9 秒'));
for (const target of context.window.VIDEO_PLATFORMS) {
  assert.equal(templates.filter(t => core.supportsPlatform(t, target.id)).length, { seedance: 13, kling: 5, sora: 3, runway: 3, generic: 3 }[target.id]);
  assert.ok(core.supportsPlatform({ platform: '通用' }, target.id));
}
for (const group of context.window.VIDEO_LEXICON) for (const entry of group.entries) {
  assert.ok(entry.platform === '通用' && entry.meaning && entry.value && entry.reference && entry.source === 'kling-terms');
}
const backup = JSON.parse(fs.readFileSync(new URL('../tests/fixtures/video-studio-1.10-export.json', import.meta.url), 'utf8'));
assert.equal(JSON.stringify(core.validate(backup.data, ids)), JSON.stringify(backup.data));
assert.equal(core.merge(core.empty(), backup.data, ids).drafts.length, 8);
const oldContext = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('../tests/fixtures/video-studio-1.11-core.txt', import.meta.url), 'utf8'), oldContext);
const modern = { ...state, drafts: [{ ...draft, platform: 'sora' }] };
assert.equal(core.validate(modern, ids).drafts[0].platform, 'sora');
const oldRead = oldContext.window.VIDEO_CORE.validate(modern, ids);
assert.deepEqual(JSON.parse(JSON.stringify(oldRead)), JSON.parse(JSON.stringify(state)));
assert.deepEqual(JSON.parse(JSON.stringify(core.validate(oldRead, ids))), JSON.parse(JSON.stringify(state)));
assert.throws(() => core.validate({ ...modern, drafts: [{ ...draft, platform: 'unknown' }] }, ids), /平台/);
assert.throws(() => core.merge(modern, { ...modern, drafts: [{ ...draft, platform: 'kling' }] }, ids), /同编号/);
assert.equal(modern.drafts[0].platform, 'sora');
console.log('PASS: simple single paragraph / one constraint and rich anchored sections / bilingual camera assertions executed on identical fields.');
console.log('PASS: 15 unchanged template ids; 57 terms; 5 platform filters; legacy missing dialect defaults both; 1.10 import verbatim; new → 1.11 → new additive compatibility; atomic rejection.');
