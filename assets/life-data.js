// 个人书影音与照片先留空；确认愿意展示的真实内容后再填写。
// 条目示例字段：title、creator、note、progress（0–100，可省略）。
// 照片字段：src（assets/images/内的本地路径）、caption、width、height。
// 增加照片后须同步 server.mjs 与 sw.js 的白名单，再更新快照。
window.SITE_LIFE = {
  updated: '2026-10-26',
  reading: [],
  listening: [],
  watching: [],
  photos: []
};
