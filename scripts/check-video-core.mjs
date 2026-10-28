import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context = { window: {} };
vm.createContext(context);
for (const file of ['assets/video-templates.js', 'assets/video-prompts-core.js']) vm.runInContext(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'), context);
const { VIDEO_TEMPLATES: templates, VIDEO_CORE: core } = context.window;
const ids = templates.map(t => t.id);
assert.equal(new Set(ids).size, 8);
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
  const values = Object.fromEntries(core.fields.map(k => [k, t.example[k] || '']));
  assert.ok(core.compose(t, values, 'draft').includes(values.subject));
  assert.ok(core.compose(t, values, 'brief').includes('不要声称已生成或验证视频'));
}
console.log('PASS: 8 templates; composition, import validation, deduplication, conflict protection, limits and literal-text preservation.');
