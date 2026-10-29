(function (root) {
  'use strict';
  var fieldKeys = ['subject', 'scene', 'action', 'look', 'camera', 'duration', 'aspect', 'extra'];
  function empty() { return { version: 1, favorites: [], drafts: [] }; }
  function compose(template, fields, mode) {
    var profile = root.VIDEO_PLATFORM_PROFILES[template.platform || 'seedance'];
    var rows = ['【' + template.title + ' · 提示词草稿】', '适用平台：' + profile.label];
    [['主体', 'subject'], ['场景', 'scene'], ['主要动作', 'action'], ['摄影机行为', 'camera'], ['画风与光线', 'look'], ['预计时长（创作目标）', 'duration'], ['构图意图', 'aspect'], [template.extraLabel, 'extra']].forEach(function (pair) {
      var value = String(fields[pair[1]] || '').trim();
      if (value) rows.push(pair[0] + '：' + value);
    });
    rows.push('', '画面组织：', template.structure.join('\n'), '', '说明：以上为文字草稿，尚未经过实际视频生成验证。时长与构图是创作目标，具体设置以所用平台为准。');
    if (mode === 'brief') rows = ['请依据以下创作要求，完善一份中文视频制作提示词。保留已有主体、事件与结尾，不擅自新增故事事实。', '一个镜头一个主要任务；如需多镜头，请先列分镜，再给出每镜独立可复制的提示词。不要使用“同上”代替角色与场景描述。', profile.brief, '', rows.slice(0, -2).join('\n'), '', '参考方法：', template.tips.join('\n'), '', '本次优先避免：', template.pitfalls.join('\n'), '', '请只交付可用的文字方案，明确必要假设和待核实能力；不要声称已生成或验证视频。'];
    return rows.join('\n');
  }
  function validate(value, ids) {
    if (!value || value.version !== 1 || !Array.isArray(value.favorites) || !Array.isArray(value.drafts)) throw Error('备份或本地资料格式不正确。');
    if (value.favorites.length > ids.length || value.drafts.length > 50) throw Error('最多保存 50 份草稿。');
    if (value.favorites.some(function (id, i, all) { return !ids.includes(id) || all.indexOf(id) !== i; })) throw Error('收藏包含重复或未知模板。');
    var seen = new Set();
    var drafts = value.drafts.map(function (draft) {
      if (!draft || typeof draft.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(draft.id) || seen.has(draft.id)) throw Error('草稿编号缺失或重复。');
      seen.add(draft.id);
      if (!ids.includes(draft.template) || !['draft', 'brief'].includes(draft.mode)) throw Error('草稿模板或输出类型不正确。');
      if (typeof draft.title !== 'string' || !draft.title.trim() || draft.title.length > 100 || typeof draft.output !== 'string' || draft.output.length > 20000) throw Error('草稿标题或正文超出限制。');
      if (typeof draft.updated !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(draft.updated) || !Number.isFinite(Date.parse(draft.updated))) throw Error('草稿日期不正确。');
      if (!draft.fields || typeof draft.fields !== 'object' || Array.isArray(draft.fields)) throw Error('草稿填写内容不正确。');
      var fields = {};
      fieldKeys.forEach(function (key) {
        if (typeof draft.fields[key] !== 'string' || draft.fields[key].length > 1000) throw Error('草稿字段缺失或超过 1000 字符。');
        fields[key] = draft.fields[key];
      });
      if (!['', '横屏 16:9', '竖屏 9:16', '方形 1:1'].includes(fields.aspect)) throw Error('构图意图格式不正确。');
      return { id: draft.id, template: draft.template, title: draft.title, fields: fields, output: draft.output, mode: draft.mode, updated: draft.updated };
    });
    return { version: 1, favorites: value.favorites.slice(), drafts: drafts };
  }
  function merge(current, imported, ids) {
    current = validate(current, ids); imported = validate(imported, ids);
    var drafts = current.drafts.slice();
    imported.drafts.forEach(function (draft) {
      var existing = drafts.find(function (item) { return item.id === draft.id; });
      if (existing && JSON.stringify(existing) !== JSON.stringify(draft)) throw Error('备份中有同编号但内容不同的草稿；本次未导入，请先导出当前资料并核对。');
      if (!existing) drafts.push(draft);
    });
    return validate({ version: 1, favorites: Array.from(new Set(current.favorites.concat(imported.favorites))), drafts: drafts }, ids);
  }
  root.VIDEO_CORE = { fields: fieldKeys, empty: empty, compose: compose, validate: validate, merge: merge };
})(typeof window !== 'undefined' ? window : globalThis);
