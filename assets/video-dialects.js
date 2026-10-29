// Local writing presets, not claims about model capabilities or API parameters.
window.VIDEO_PLATFORMS = [
  { id: 'seedance', label: 'Seedance', option: 'Seedance（简派）', dialect: 'simple', templates: 'seedance' },
  { id: 'kling', label: '可灵（kling）', option: '可灵（繁派）', dialect: 'rich', templates: 'kling' },
  { id: 'sora', label: 'Sora', option: 'Sora（繁派）', dialect: 'rich', templates: 'sora' },
  { id: 'runway', label: 'Runway', option: 'Runway（繁派）', dialect: 'rich', templates: 'runway' },
  { id: 'generic', label: '通用（未绑定具体平台）', option: '通用（繁派）', dialect: 'rich', templates: '通用' }
];
window.VIDEO_DIALECTS = {
  simple: {
    rules: [
      '主体 → 动作 → 场景 → 镜头 → 风格，一段成文，不输出分段标题。',
      '保留填写的主体、动作、场景、镜头、风格；补充内容只提取结尾与首条关键约束，不展开分镜或后期。',
      '子句从简，合并换行；时长与画幅只作创作意图。'
    ],
    order: ['subject', 'action', 'scene', 'camera', 'look'],
    separator: '；',
    constraintLimit: 1,
    constraintPattern: '不要|不展示|不增加|不改变|不新增|不插入|不追求|不让|禁止|避免|保持|一致|始终|只有|不变|只表现|每镜',
    endingPattern: '结尾|结束|最后|落点',
    briefLead: '请为 Seedance 完善以下自然语言提示词，保留主体、事件与结尾，仍用一段简洁文字，不新增故事事实。'
  },
  rich: {
    rules: [
      '先写总纲句，再依次输出场景与妆造、分镜序列、镜头语言、光影氛围、约束与后期；各段空行分隔。',
      '分镜沿用填写的 S 编号与时间轴；无分镜时只安排一个镜头，无时长时仅标 0 秒起、结束待定，不虚构剧情。',
      '运镜采用中文（English）对照；未知描述原样保留，不推断未填写的摄影动作。',
      '保留补充内容与后期事项；秒数是剪辑安排，不是平台参数或精确执行承诺。'
    ],
    sections: [
      { title: '场景与妆造', renderer: 'scene', fields: ['subject', 'scene', 'aspect'] },
      { title: '分镜序列', renderer: 'sequence' },
      { title: '镜头语言', renderer: 'camera', field: 'camera' },
      { title: '光影氛围', renderer: 'field', field: 'look', fallback: '光线与风格待补充，不额外设定。' },
      { title: '约束与后期', renderer: 'extra' }
    ],
    briefLead: '请为 {platform} 完善以下自然语言分镜方案，保留主体、事件与结尾，每镜可独立复制，不新增故事事实。',
    timingNote: '秒数仅为剪辑安排，精确卡点、字幕、声音与合成留到后期；当前入口的参数、参考图与音频能力尚未核实。'
  }
};
window.VIDEO_DIALECT_CAMERA_ALIASES = [
  { term: '缓慢推近', english: 'Slow push-in' },
  { term: '推近', english: 'Push-in' },
  { term: '拉远', english: 'Pull-out' },
  { term: '侧面跟拍', english: 'Side tracking shot' },
  { term: '跟拍', english: 'Tracking shot' },
  { term: '环绕', english: 'Orbit shot' },
  { term: '横移', english: 'Truck shot' },
  { term: '固定中景', english: 'Locked-off medium shot' },
  { term: '固定近景', english: 'Locked-off close-up' },
  { term: '固定', english: 'Locked-off shot' }
];
