# 实现与验证顺序

1. 定义主题键 myweb_theme_v1、paper/night 值、同步预置、SVG 门扇类名和资源文件名。
2. 三个不重叠模块并行实现；主代理保持页面结构、加入同步主题与本地资源引用。
3. 资源白名单对齐 manifest、两个 PNG、SW 和所有新样式/脚本。
4. 检查两种主题的 8 个页面、5 档宽度；计算关键文字对比度和有效点击区域。
5. 验证减少动态效果、存储失败、file://、键盘与原功能；校验没有外部请求。
6. 验证 SW 安装、网络优先、离线详情/搜索和严格缓存范围，不触发实际系统安装。
7. 保存截图、记录已验证与未验证边界；通过后提交公开仓库并添加 0.14.0 恢复标记。

官方实现参考：

- [跨文档 View Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition)：浏览器渐进增强，原生导航不依赖它。
- [Service Worker register](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)：只在受支持的安全 HTTP(S) 上下文注册。
- [PWA 安装条件](https://web.dev/articles/install-criteria)：浏览器决定何时提供安装入口，不能伪造系统安装成功。
