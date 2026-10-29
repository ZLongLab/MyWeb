(function (root) {
  'use strict';
  var fieldKeys = ['subject', 'scene', 'action', 'look', 'camera', 'duration', 'aspect', 'extra'];
  function empty() { return { version: 1, favorites: [], drafts: [] }; }
  function platform(id) {
    var found = root.VIDEO_PLATFORMS.find(function (item) { return item.id === id; });
    if (!found) throw Error('平台不正确。');
    return found;
  }
  function supportsPlatform(template, id) {
    var target = platform(id), dialect = template.dialect || 'both';
    return (template.platform === '通用' || template.platform === target.templates) && (dialect === 'both' || dialect === target.dialect);
  }
  function inline(text) { return String(text || '').trim().replace(/\s*\n\s*/g, '；'); }
  function bilingual(text) {
    var entries = (root.VIDEO_LEXICON || []).filter(function (group) { return ['movement', 'shot', 'angle'].includes(group.id); }).flatMap(function (group) {
      return group.entries.map(function (entry) { return { term: entry.term, english: entry.reference }; });
    }).concat(root.VIDEO_DIALECT_CAMERA_ALIASES);
    var terms = Array.from(new Set(entries.map(function (entry) { return entry.term; }))).sort(function (a, b) { return b.length - a.length; });
    var pattern = terms.map(function (term) { return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|');
    return inline(text).replace(new RegExp('(' + pattern + ')([（(][^）)]*[）)])?', 'g'), function (match, term, existing) {
      return existing ? match : term + '（' + entries.find(function (entry) { return entry.term === term; }).english + '）';
    });
  }
  function sequence(fields) {
    var extra = String(fields.extra || '');
    var shots = extra.split('\n').filter(function (line) { return /^S\d+\s*[｜|:：]/i.test(line.trim()); });
    var seconds = String(fields.duration || '').match(/(\d+(?:\.\d+)?)\s*秒/);
    var duration = seconds && Number(seconds[1]) > 0 ? Number(seconds[1]) : null;
    function anchor(index, total, id) {
      var explicit = extra.match(new RegExp(id + '\\s+(\\d+(?:\\.\\d+)?)\\s*[–—~-]\\s*(\\d+(?:\\.\\d+)?)\\s*秒', 'i'));
      if (explicit) return explicit[1] + '–' + explicit[2] + ' 秒';
      if (duration) return Number((duration * index / total).toFixed(2)) + '–' + Number((duration * (index + 1) / total).toFixed(2)) + ' 秒';
      return index === 0 ? '0 秒起，结束秒数待定' : '起止秒数待定';
    }
    if (shots.length) return shots.map(function (line, index) {
      var id = line.trim().match(/^S\d+/i)[0];
      return id + '｜' + anchor(index, shots.length, id) + '（剪辑安排）｜' + line.replace(/^\s*S\d+\s*[｜|:：]\s*/i, '');
    }).join('\n');
    return 'S01｜' + anchor(0, 1, 'S01') + '（剪辑安排）｜' + [fields.subject, fields.scene, fields.action].map(inline).filter(Boolean).join('；');
  }
  function compose(template, fields, mode, platformId) {
    var target = platform(platformId || (template.platform === '通用' ? 'generic' : template.platform) || 'seedance');
    var profile = root.VIDEO_DIALECTS[target.dialect];
    var lead = mode === 'brief' ? profile.briefLead.replace('{platform}', target.label) : '';
    if (profile.order) {
      var clauses = profile.order.map(function (key) { return inline(fields[key]); }).filter(Boolean);
      var visualExtra = String(fields.extra || '').split(/后期|精确卡点/)[0].split('\n').filter(function (line) { return !/^\s*S\d+\s*[｜|:：]/i.test(line); }).join('\n');
      var notes = visualExtra.split(/[；。\n]/).map(function (text) { return text.trim(); }).filter(Boolean);
      var constraints = notes.filter(function (text) { return new RegExp(profile.constraintPattern).test(text) && !/^S\d+\s*[｜|:：]/i.test(text); });
      var ending = notes.find(function (text) { return new RegExp(profile.endingPattern).test(text) && !constraints.includes(text) && !/^S\d+\s*[｜|:：]/i.test(text); });
      if (ending) clauses.splice(Math.min(2, clauses.length), 0, ending);
      clauses.push(...constraints.slice(0, profile.constraintLimit));
      var intent = [fields.duration, fields.aspect].map(inline).filter(Boolean).join('，');
      if (intent) clauses.push('创作意图为' + intent);
      return [lead, clauses.join(profile.separator) + '。', mode === 'brief' ? '只交付文字；不编造参数或参考附件，不要声称已生成或验证视频。' : ''].filter(Boolean).join(' ');
    }
    var renderers = {
      scene: function (section) { return section.fields.map(function (key) { return inline(fields[key]); }).filter(Boolean).join('；') || '场景与人物待补充，不额外设定。'; },
      sequence: function () { return sequence(fields); },
      camera: function (section) { return bilingual(fields[section.field]) || '摄影机行为待补充，不预设运镜。'; },
      field: function (section) { return inline(fields[section.field]) || section.fallback; },
      extra: function () { return [String(fields.extra || '').trim(), profile.timingNote].filter(Boolean).join('\n'); }
    };
    return [lead, '为' + target.label + '整理「' + template.title + '」镜头方案：' + [fields.subject, fields.action].map(inline).filter(Boolean).join('；') + '。'].filter(Boolean).concat(profile.sections.map(function (section) {
      return section.title + '：\n' + renderers[section.renderer](section);
    }), mode === 'brief' ? ['请只交付可用文字，说明必要假设；不要声称已生成或验证视频。'] : []).join('\n\n');
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
      var result = { id: draft.id, template: draft.template, title: draft.title, fields: fields, output: draft.output, mode: draft.mode, updated: draft.updated };
      // Preserve the exact shape of old drafts. Default only when opened, not on import.
      if (Object.prototype.hasOwnProperty.call(draft, 'platform')) { platform(draft.platform); result.platform = draft.platform; }
      return result;
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
  root.VIDEO_CORE = { fields: fieldKeys, empty: empty, compose: compose, validate: validate, merge: merge, supportsPlatform: supportsPlatform };
})(typeof window !== 'undefined' ? window : globalThis);
