// 房间目录是一份全站共用的数据；详情页不另算一个房间。
window.SITE_HOUSE = {
  updated: '2026-10-26',
  started: '2026-10-24',
  timeZone: 'Asia/Shanghai',
  quote: '把想法做出来，也给生活留一点空白。',
  rooms: [
    { id: 'home', name: '玄关', title: '首页', description: '先坐一会儿，看看这间小站', href: 'index.html', color: 'global' },
    { id: 'now', name: '门牌', title: '最近在做', description: '正在做的事，与暂时放下的事', href: 'now.html', color: 'slate' },
    { id: 'projects', name: '客厅', title: '作品', description: '把日常的问题，慢慢做成工具', href: 'projects.html', color: 'clay' },
    { id: 'articles', name: '书房', title: '文章', description: '开发过程与还在生长的想法', href: 'articles.html', color: 'amber' },
    { id: 'workbench', name: '工作台', title: '项目进展', description: '项目、技术和维护清单', href: 'workbench.html', color: 'slate' },
    { id: 'uses', name: '工具墙', title: '在用什么', description: '已确认的工具与使用理由', href: 'uses.html', color: 'slate' },
    { id: 'life', name: '院子', title: '生活片段', description: '给书、音乐、电影和照片留位置', href: 'life.html', color: 'moss' },
    { id: 'links', name: '邻居', title: '链接与推荐', description: '设计参考，以及慢慢认识的小站', href: 'links.html', color: 'moss' },
    { id: 'guestbook', name: '留言墙', title: '本地灵感箱', description: '只保存在自己浏览器的随手便签', href: 'guestbook.html', color: 'clay' },
    { id: 'colophon', name: '说明书', title: '关于本站', description: '制作方式、颜色、原则与版本史', href: 'colophon.html', color: 'slate' }
  ],
  notDoing: ['暂不接入公共留言与账号系统。', '不放访问统计、广告或第三方追踪。', '不让页面实时请求 GitHub、天气或其他外部接口。'],
  tools: {
    hardware: [],
    software: [
      { title: 'Codex', reason: '用于这个小站的代码修改、页面检查和版本整理。', source: '本次开发环境' },
      { title: 'PowerShell', reason: '在 Windows 上启动本地预览、运行维护脚本。', source: '本机预览环境' },
      { title: 'Node.js', reason: '运行零依赖预览服务，生成文章统计与静态快照。', source: 'package.json / server.mjs' },
      { title: 'Chrome', reason: '检查本地页面、键盘操作、夜色和离线功能。', source: '本机浏览器验收' },
      { title: 'Git · GitHub', reason: '保存源码和可回退的版本，不代替浏览器便签备份。', source: '本站公开源码仓库' }
    ],
    defaults: [
      { title: '邮件', value: '' }, { title: '笔记', value: '' },
      { title: '浏览器', value: '' }, { title: '音乐', value: '' }
    ]
  },
  // 真实友链等站主补充后再列出，不把设计参考伪装成互访关系。
  friends: [],
  resources: [
    { title: 'Maggie Appleton', url: 'https://maggieappleton.com/', reason: '温暖自然的数字花园，是这次内容与配色方向的设计参考。' },
    { title: 'Brian Lovin', url: 'https://brianlovin.com/', reason: '参考作品陈列、页面秩序和真实内容之间的关系。' },
    { title: 'Now / nownownow', url: 'https://nownownow.com/about', reason: '了解如何用一页近况，说明此刻真正关注的事情。' },
    { title: 'IndieWeb · Colophon', url: 'https://indieweb.org/colophon', reason: '把网站怎样制作、数据留在哪里，写成能读懂的说明。' },
    { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/zh-CN/', reason: '查阅原生 HTML、CSS 和浏览器接口，不必先引入一个框架。' }
  ]
};
