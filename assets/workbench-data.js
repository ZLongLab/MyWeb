// 工作台只记录已在本站项目中确认的内容；updated 是人工核对日期，不随浏览时间变化。
window.SITE_WORKBENCH = {
  updated: '2026-10-26',
  focus: [
    { projectId: 'recallai', label: '本地资料检索', description: '整理关键词检索、离线 OCR，以及原位置索引与复制收纳之间的使用边界。' },
    { projectId: 'document-assistant', label: '文档整理', description: '把规则分类、确认归档和备份恢复的取舍写清楚，保留源码与下载版本的区别。' },
    { projectId: 'folia-android', label: '开源适配', description: '记录基于 Folia 的 Android 适配与工程集成，保留原作者归属和开源许可。' }
  ],
  tools: [
    { title: 'Electron · React · TypeScript', purpose: '桌面界面', description: '用于 RecallAI 的桌面界面、交互和应用逻辑。', projectId: 'recallai' },
    { title: 'SQLite FTS5 · 本地 OCR', purpose: '内容检索', description: '把文档和图片里的文字转成可查询的本地资料索引。', projectId: 'recallai' },
    { title: 'Python · PySide6 · SQLite', purpose: '文档整理', description: '用于 DocumentAssistant 的本地界面、文档记录与分类归档流程。', projectId: 'document-assistant' },
    { title: 'Capacitor · React · TypeScript', purpose: '移动端适配', description: '用于 Folia 的 Android 适配、构建和界面集成。', projectId: 'folia-android' }
  ],
  updates: [
    { version: '0.14.0', date: '2026-10-26', title: '让阅读与切页更从容', changes: ['加入纸色／夜色选择、首屏与滚动浮现，以及 Logo 门扇的小交互；减少动态效果时直接展示内容。', '支持浏览器原生跨页过渡，补上本地离线缓存与可用时的安装入口，保留既有页面分布。'] },
    { version: '0.13.3', date: '2026-10-25', title: '重新整理首页空间', changes: ['收紧首屏留白，缩小标题，近况便签与介绍顶部对齐。', '作品区调整图文比例与间距，平板宽度下改成单列，保留既有配色和轻边框导航。'] },
    { version: '0.13.2', date: '2026-10-25', title: '导航加一点细边框', changes: ['导航项使用细边框和浅底色，当前页面略深，搜索入口带轻微暖色。', '收回上一轮较重的首页按钮改动，恢复原有绿色主按钮和轻量排版。'] },
    { version: '0.13.1', date: '2026-10-25', title: '让点击入口更醒目', changes: ['首页主操作使用暖陶红，作品补上明确的绿色详情入口。', '加强全部内容、工作台和联系按钮，截图放大与阅读详情分开标识。'] },
    { version: '0.13.0', date: '2026-10-25', title: '给小站补一张工作台', changes: ['增加带日期的项目近况、技术用途清单、小站更新和本站说明。', '首页、关于页、全站页脚与搜索连到同一份工作台内容。'] },
    { version: '0.12.0', date: '2026-10-25', title: '让作品更容易看清和读完', changes: ['截图可放大、滚动和关闭，作品详情增加小节目录。', '新增 DocumentAssistant 开发记录，区分 ZL AI LAB 网站和 GitHub 账号。'] },
    { version: '0.11.0', date: '2026-10-25', title: '从页面走向真实项目', changes: ['补上 ZL 的署名与计算机学生身份。', '完善 RecallAI 项目说明、界面示例与开发记录。'] }
  ]
};
