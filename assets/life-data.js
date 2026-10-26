// 泛称在读已由站主确认；其余个人内容继续留空。
// 条目示例字段：title、creator、note、progress（0–100，可省略）。
// 照片字段：src（assets/images/内的本地路径）、caption、width、height。
// 增加照片后须同步 server.mjs 与 sw.js 的白名单，再更新快照。
window.SITE_LIFE = {
  updated: '2026-10-26',
  reading: [{ title: '医学图像分割方向的论文', note: '持续研读中。围绕医学图像分割整理方法与思路，把实验的来龙去脉讲清楚。' }],
  listening: [],
  watching: [],
  photos: []
};
