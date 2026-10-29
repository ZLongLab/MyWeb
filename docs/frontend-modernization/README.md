# 前端工程升级 · 2026-10-29

源码基线：`607a14eb4fc49b5ed14e14e6c5a21211197ffd7e`，工作分支：`codex/frontend-modernization`。本站内容版本保持 1.9.0；本次只升级工程能力与加载方式，保留 JavaScript、CSS、16 个原有主站地址和 `/MyWeb/` 部署路径。

## 技术选择与接入边界

- React／React DOM 19.3.1、Vite 8.3.5 已是检查时的稳定版本，继续使用。
- 新增官方 `@vitejs/plugin-react` 6.1.2、`@rolldown/plugin-babel` 0.2.4、React Compiler 1.0.0。使用官方稳定 Babel 编译方案，`@babel/core` 锁定 7.29.7；未启用仍属实验性的原生 Oxc 编译器选项。
- 编译器使用 annotation 模式。仅 `ProjectCard`、`ProjectCollection`、`ToolShortcut`、`SiteMark` 四个由 React 完整管理的组件添加 `"use memo"`，并纳入 Fast Refresh。测试检查实际编译后的 memo 缓存代码，还会真实修改／还原卡片标签，确认页面不重新加载、筛选状态不丢失。
- App、Navbar、其他页面及原生控制器继续使用原有生命周期和整页更新。其内部仍有原生 DOM 操作，不扩大热更新边界，也不借本次升级重写已正常工作的交互。
- 图片灵感室与视频灵感室的专用目录和纯逻辑从公共 `src/data/site.js` 移到各自控制器的动态加载分块。首页不再初始化两套专用全局数据；进入对应页面后内容仍分别是 20 个示例与 8 个模板。
- 新 React 代码通过 `src/data/site.js` 导出读取项目／文章数据，原控制器的兼容全局保留。数据源、浏览器存储键名、导入导出格式均未修改。
- 新增 Oxlint 1.90.0，检查 React Hooks 与 JavaScript correctness；迁移保留的 `src/controllers/` 暂不纳入 lint，由功能回归覆盖。未引入新的 UI 库、路由库、后端、数据库、登录或统计服务。

依据：[React Compiler 安装](https://react.dev/learn/react-compiler/installation)、[渐进接入](https://react.dev/learn/react-compiler/incremental-adoption)、[官方 Vite React 插件](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)、[Oxlint 配置](https://oxc.rs/docs/guide/usage/linter/config.html)。

## 测量与发布范围

同一台本机、隔离 Chrome、相同纸色／秋季与 1440×1000 视口，关闭 Service Worker 以区分页面渲染与离线预缓存。只统计实际被首页请求的 JavaScript，文件内容按解码后字节计算；gzip 为本地逐文件估算，不代表 GitHub CDN 实际传输量。完整原始清单见 `home-before.json`、`home-after.json`。

| 指标 | 升级前 | 升级后 |
| --- | ---: | ---: |
| 首页渲染请求 JS 字节 | 403,156 | 376,970 |
| 本地 gzip 估算字节 | 139,273 | 126,384 |
| 首页 JS 分块数量 | 19 | 20 |
| 主站发布文件（含 SW 与 .nojekyll） | 120 | 121 |
| 主站离线缓存清单 | 113 | 114 |
| 独立优化器文件 | 45 | 45 |

首页 JS 解码体积减少 26,186 字节，约 6.5%；gzip 估算减少约 9.3%。不是加载时间、帧率或全站首访流量的测量。原有离线策略仍会后台预缓存其他页面，分块增加 1 项用于保持离线可用；缓存版本由构建内容哈希自动更新。feed／sitemap／robots 继续不进 SW 缓存。

CSS、页面内容、静态资源、OG 与发现文件均不修改。GitHub 公开贡献仍为已批准的 53 次，没有重新抓取或批准。优化器仍使用固定源码 `fe72bb1f6e6ff970658b67b75dc630ff1adcfc55`，未预置模型密钥。

## 验证与部署

`npm run verify` 依次执行 lint、图片／视频核心检查、完整 Pages 构建与 17 项浏览器回归。浏览器覆盖 16 页两档视口、导航与深链接、主题与搜索、详情、收藏／草稿／便签、存储异常、组件清理、离线缓存、新增按需加载与热更新检查。另检查旧版离线缓存更新与存储保留。依赖审计为 0 个已知漏洞；这不代表对所有代码作安全证明。

GitHub Actions 加入 lint 与 Chromium 浏览器检查，通过后才上传和部署 Pages。主站运行依赖仍只有 React 与 React DOM；编译器、开发插件和代码检查工具只用于开发／构建。启动、构建命令保持 `npm run dev`、`npm run build`、`npm run preview`；完整发布使用 `npm run build:pages`。

本地检查与上线复核的结果另存本目录的 JSON 文件；截图只留本机 `.tmp/`。线上结果以 Actions 成功与发布后的实际复核为准。
