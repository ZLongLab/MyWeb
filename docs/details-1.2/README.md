# 1.2「点缀版」交付记录

日期：2026-10-26。实际基线：1.1.2 / `dae9fd969edfcd5add8ec1e3602a8c5dc9a8b478` / `garden-1.1.2`。本版恢复标记：`details-1.2.0`。

保留13页、十间房、6篇种子与6节点／4条有向边的正式关系图。文章、作品、个人资料、院子在读、工具数据、时间线、统计与GitHub快照均未修改；只增加工作台版本记录。不自动填写邮箱，不更改内容数据结构，不部署网站。

## 18项落地情况

| 项目 | 结果 |
| --- | --- |
| 1 空状态线描 | 院子空花盆、邻居半开门、硬件挂钩、本地便签空白纸；内联56px SVG，1.5px描边、房间色、静态且对读屏隐藏 |
| 2 / 14 季节角标 | 20px新芽／日轮／叶片／六角雪点，跟随既有季节选择和纸夜变量；6秒微摆，冬季上下2px |
| 3 首页分隔纹 | 仅玄关三处色带顶部使用细线加10px房子，不改其他页分隔 |
| 4 首字下沉 | 仅文章详情第一段首字，衬线3.2em与陶土色 |
| 5 工具小签 | 工具行28px首字母、青瓷色浅底；装饰不进入工具名称的读屏文本 |
| 6 滚动条 | Chromium实际宽10px、透明轨道、圆角滑块，hover松针色；Firefox配置标准scrollbar-color兜底 |
| 7 页脚平面图 | hover及键盘聚焦时名称右移3px、序号按房间配色、箭头浮现 |
| 8 便签折角 | 玄关近况便签18px静态CSS折角与细折痕，沿用现有变量 |
| 9 阅读进度 | 原生CSS scroll-timeline驱动2px琥珀线，无JS进度监听；不支持时隐藏 |
| 10 浮动回顶 | 全站共用44px按钮，超过一屏出现；隐藏后移出Tab顺序，键盘操作回到正文焦点 |
| 11 复制确认 | 色卡与可用时的复制邮箱共用一个polite状态区；0.25秒进出、停留1.6秒，不取焦点，不重复播报复制结果 |
| 12 列表轻扫 | 工具、资源与关于时间线用房间色6%覆盖层；以transform扫入、标题右移4px，避免background-size动画 |
| 13 成熟度微动 | 仅growing嫩芽hover纵向1.15倍，0.25秒；seed和evergreen静止 |
| 15 热力图 | 格子hover放大1.25倍、颜色不变；样式化等宽周日期小签，保留原title兜底 |
| 16 焦点环 | focus-visible从2px到4px偏移，0.15秒；夜色页脚使用可见描边 |
| 17 门牌彩蛋 | 页头Logo三连击停留当前房间，开门致谢3秒，随后合拢；离页清空计数与定时器 |
| 18 深夜问候 | 上海时间00:00至04:59在玄关显示指定一句话，05:00起隐藏；复用现有时钟，不请求外部服务 |

按站主明确选择，所有页面的Logo普通指针点击等待约300毫秒判断下一次点击：单击／双击在最后一下后返回首页，三连击留在当前页。键盘Enter与Ctrl/Cmd等修饰键点击不延迟。file://同样可用。三连击结束后，鼠标停留也不会把门继续撑开。

短过渡均不超过0.5秒；6秒季节摆动、3秒开门停留和1.6秒提示停留是清单明确指定的例外。列表扫光采用transform覆盖层；焦点环按清单明确要求改变outline-offset。减少动态效果时关闭新动画／过渡及平滑滚动，阅读进度隐藏，角标、文字和复制结果直接可见。

## 实际验证

- [56项交互检查](artifacts/features.json)：四类插画、工具小签、三档成熟度临时DOM夹具、四季形状、分隔与折角、页脚反馈、周日期、首字、原生阅读进度、回顶、复制成功／失败／焦点／单一状态区、弹窗内提示、普通命令反馈、焦点环，以及HTTP和file下Logo单／双／三击与跨页复位。深夜问候分别用上海02:00、05:00、14:00验证。
- [页面矩阵](artifacts/matrix.json)：13页 × 纸／夜 × 春／秋 × 320／390／640／768／1440，共260组布局，无横向溢出、可见操作区域不足44px、残留入场隐藏或脚本错误。另检查全13页 × 八种外观的正文对比，共104组；13页file模式无manifest／SW／HTTP请求。385项汇总检查通过。
- [28项兼容与离线检查](artifacts/compat.json)：八种外观的真实10px滚动条、各项减少动态效果状态、file复制不可用时的手动提示、关系图键盘跳转与返回主题视图；真实注册SW后断网重开玄关、文章与关系图均可用。
- 浏览器为本机Chrome，实际版本见兼容记录。复制测试使用隔离浏览器的模拟剪贴板；可选邮箱命令仅在测试上下文临时提供示例邮箱，源数据仍为空。确认单一live region与焦点行为不等于NVDA／VoiceOver实测。
- 已目检[纸色玄关](artifacts/autumn-paper.png)、[夜色玄关](artifacts/autumn-night.png)、[四类留位](artifacts/empty-sketches.png)、[首字下沉](artifacts/drop-cap-paper.png)、[复制确认](artifacts/copy-toast.png)与[八种滚动条](artifacts/scrollbars-eight-themes.png)。Firefox实际渲染、物理手机、读屏软件与系统PWA安装未实测。

修正了检查中发现的门扇旧hover规则优先级问题；弹窗提示移入dialog顶层，避免被模态遮挡和屏蔽。关闭弹窗后会清空并归位提示，页面往返也清理临时状态。

## 资源与维护

新增运行资源仅 `assets/details.css` 与 `assets/details.js`，13页统一引入。details.css位于motion.css之前，使原有减少动态效果规则最后生效；details.js在内容、房间与主题初始化后加载。

server.mjs与sw.js白名单逐项一致（预览额外提供sw.js）：离线缓存 **66 → 68项**，预览白名单 **67 → 69项**，缓存版本1.2.0。全部新SVG内联，不增加图片请求；docs、临时检查脚本与浏览器数据均不进入预览／缓存。

本轮没有安装依赖、引入框架、新增页面或启用开放版入口。源代码备份与网站公网托管仍是两件独立的事。

实现时核对的官方参考：[animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline)、[滚动条样式与标准属性优先级](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::-webkit-scrollbar)、[status状态区](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)。
