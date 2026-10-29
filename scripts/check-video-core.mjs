import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context = { window: {} };
vm.createContext(context);
for (const file of ['assets/video-templates.js', 'assets/video-lexicon.js', 'assets/video-content-sources.js', 'assets/video-prompts-core.js']) vm.runInContext(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'), context);
const { VIDEO_TEMPLATES: templates, VIDEO_CORE: core } = context.window;
const ids = templates.map(t => t.id);
assert.equal(new Set(ids).size, 15);
assert.equal(ids.slice(0, 8).join(','), 'cinematic,anime,stop-motion,product,travel,music,pet,storyboard');
assert.equal(context.window.VIDEO_CONTENT_SOURCES.length, 5);
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
  for (const key of core.fields) assert.ok(typeof t.example[key] === 'string' && t.example[key].length > 0 && t.example[key].length <= 1000, `${t.id}: ${key}`);
  assert.ok(t.sourceRefs.length && t.sourceRefs.every(id => context.window.VIDEO_CONTENT_SOURCES.some(source => source.id === id)));
  const values = Object.fromEntries(core.fields.map(k => [k, t.example[k] || '']));
  const text = core.compose(t, values, 'draft'), brief = core.compose(t, values, 'brief');
  assert.ok(text.includes(values.subject));
  assert.ok(brief.includes('不要声称已生成或验证视频'));
  assert.ok(text.indexOf('主要动作：') < text.indexOf('摄影机行为：') && text.indexOf('摄影机行为：') < text.indexOf('画风与光线：'));
  if (t.platform === 'kling') { assert.ok(brief.includes('可灵（kling）')); assert.ok(!/Seedance/i.test(brief)); }
  if (t.platform === 'seedance') { assert.ok(brief.includes('Seedance')); assert.ok(!/kling|可灵/.test(brief)); }
  if (t.platform === '通用') assert.ok(brief.includes('未绑定具体平台'));
}
for (const group of context.window.VIDEO_LEXICON) for (const entry of group.entries) {
  assert.ok(entry.platform === '通用' && entry.meaning && entry.value && entry.reference && entry.source === 'kling-terms');
}
const backup = JSON.parse(fs.readFileSync(new URL('../tests/fixtures/video-studio-1.10-export.json', import.meta.url), 'utf8'));
assert.equal(JSON.stringify(core.validate(backup.data, ids)), JSON.stringify(backup.data));
assert.equal(core.merge(core.empty(), backup.data, ids).drafts.length, 8);
console.log('PASS: 15 templates; 57 terms; platform separation; real 1.10 backup; unchanged validation, merge conflict protection, limits and literal text.');
