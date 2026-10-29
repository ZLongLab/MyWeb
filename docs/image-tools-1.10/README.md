# 图片工坊 1.10.0

基线为 main `ae59afc4002b2a8858c22af04522001daf1de98c`，工作分支 `codex/image-tools-1-10`。新增 React 图片工具，不改变原页面设计，不修改独立优化器，不接后端或外部运行服务。

## 实现范围

- `image-tools.html`、`src/pages/ImageToolsPage.jsx`，以及设置、队列两个组件。新页面内部全部由 React 管理，没有原生控制器填充其内部节点，因此将这三个组件加入 Compiler 范围。设置／队列两个组件支持 Fast Refresh；页面本体持有 Worker 与 Blob URL，编辑本体时整页更新以完整清理资源。公共控制器继续管理页头、页脚与搜索等既有区域。
- `src/features/image-tools/processor.js` 按第一次转换创建一个 module Worker；`image-worker.js` 只允许一个任务，逐张解码、缩放和编码。页面状态与滚动保留在主线程。
- WebP 默认、质量默认 80，输出支持 WebP／JPEG／AVIF／PNG。尺寸档为最大宽度，保持比例且小图不放大。PNG 使用 Canvas，无 PNG 编码依赖。
- 文件与 Blob 只存本页内存，输出以 Blob URL 提供下载；清空、重新转换、离开页面时回收 URL 并按需终止 Worker。JPEG 透明区域白底，动画只处理首帧，输出不保留附加元数据，单张限制 3200 万像素。
- 工作台 ToolShortcut、作品数据与工具地址映射、命令面板搜索索引、说明书使用条目和版本史均接通。内容版本与构建缓存版本升到 1.10.0。

## 依赖与许可证

| 包 | 固定版本 | npm 包内许可证 |
| --- | --- | --- |
| @jsquash/webp | 1.5.0 | Apache-2.0 |
| @jsquash/jpeg | 1.6.0 | Apache-2.0 |
| @jsquash/avif | 2.1.1 | Apache-2.0 |
| @jsquash/resize | 2.1.1 | Apache-2.0 |

实际解包核对 `package.json` 与 `LICENSE`，记录见 `dependency-licenses.json`。在 `public/THIRD-PARTY-LICENSES.txt` 追加四包登记及 Apache 全文，并保留 libwebp BSD、MozJPEG／IJG／libjpeg-turbo、缩放 MIT、libavif 与 libaom 的相关许可／专利文本。未改动优化器自身许可文件。

AVIF 直接使用该包 `codec/enc/avif_enc.js` 单线程工厂，不使用会自动选择多线程变体的通用入口。WebP 使用普通单线程编码器并设置 `thread_level: 0`，JPEG 使用 MozJPEG，缩放只用 Lanczos3 的单线程二进制，不引入 hqx／magic-kernel。各组件在 Worker 内缓存初始化 Promise，成功初始化后供同页后续任务复用；网络失败可重试。

## WASM、发现与离线

WASM 用 npm 模块 `?url` 导入，由 Vite 输出带内容哈希的站内地址；Worker 采用 `new Worker(new URL(..., import.meta.url), { type: 'module' })`，构建格式为 ES。页面打开不创建 Worker，也不请求 WASM。编码器和缩放入口均为 Worker 内动态 import。

`vite.config.js` 的 `siteFiles` 原有扩展名白名单只收 HTML／JS／CSS／SVG／WebP／PNG／manifest，天然不收 `.wasm`，本次保留该规则并添加注释。壳与 JS／CSS自动缓存，二进制不进预缓存。页面与说明书均写明首次转换需要联网，不承诺离线转换。

新页沿用既有 OG／Twitter 模板与站内已有 WebP 分享图，地址包含 `/MyWeb/`。发现生成器加入独立图片工坊地址并重新生成 sitemap；仅发布 sitemap，feed 不作变更，不提交搜索引擎。

## 验收记录

`npm run verify` 全绿：Oxlint、图片／视频既有纯逻辑检查、完整 Pages 构建与 **28 项浏览器检查**全部通过，其中新增 11 项覆盖图片工坊。作品总数从 7 增至 8，旧回归的固定数量断言改为读取真实作品数据。依赖审计为 0 个已知 npm 漏洞。

- 真实 PNG（2,526,287 字节）转换为 WebP（190,334 字节），输出可由浏览器解码，下载事件触发且文件头为 RIFF／WEBP。仅请求一个站内 WebP WASM，无外部请求、无上传请求。见 `conversion.json`。
- WebP／JPEG／AVIF／PNG 均实际转换和解码；640 档输出为 640×480，1920 档不会放大 1024×768 输入。JPEG 透明角落变为白色。重复 WebP／JPEG／AVIF 任务仍只请求四个唯一 WASM（含缩放），共一个 Worker，`crossOriginIsolated=false` 下正常完成。见 `formats.json`。
- 1280／1440／1920 × 纸／夜六档均逐批转换五张测试图，最多一张处于处理中，已完成行在后续处理时逐行出现。处理期间页面可滚动超过 1200px，20ms 主线程计时器仍持续运行；无横向溢出、无脚本错误或外部请求。六档截图已实际目检，控件与队列可读、排布正常，截图只留本机 `.tmp/image-tools-visual/`。见 `desktop-queue.json`。
- 缓存完成后真实切断网络，图片工坊页面可重新打开，显示首次转换需联网；离线点击转换不会启动 Worker。真实 Cache Storage 中没有任何 `.wasm` 键。
- 工作台入口、作品链接、命令面板结果均打开图片工坊，拖放真实 PNG 可进入队列；无效图片失败后仍继续处理后续有效图片，全部下载逐个触发并可清空列表。
- 其他主站页面、旧便签／草稿／收藏与主题、深链接、图片查看、组件清理和离线模块仍通过既有回归。沿用既有窄窗口回归，没有新增手机专项或真机检测。

### 发布与缓存计数

| 项目 | 1.9.0 工程基线 | 1.10.0 |
| --- | ---: | ---: |
| 主站 HTML 页面 | 16 | 17 |
| 主站运行文件（含 SW、.nojekyll） | 121 | 134 |
| 主站预缓存条目 | 114 | 123 |
| WASM 运行文件／预缓存 | 0／0 | 4／0 |
| 独立优化器文件 | 45 | 45 |
| 发布总文件 | 166 | 179 |

新增预缓存 9 项：页面 1、CSS 1、页面／Worker／懒加载编码器等 JS 共 7。另有四个 WASM 只作为发布文件，约 4.05MB（未压缩），不进入 SW 清单。四个文件及大小、SHA-256 和清单核对见 `build-evidence.json`。缓存版本为 `1.10.0-react-90002afb7955`，来自内容哈希。

核对原有 16 个 HTML 入口和 20 份原样式源文件均未变化；旧的七条作品与版本史条目保留，只新增入口／作品／说明书工具条目与版本记录。feed、robots、已批准的贡献快照、优化器源码固定版本及部署流程未修改。新页分享图沿用已有 RecallAI WebP，不生成图片。发现草稿与现有 feed 仅有换行差异，故未覆盖 feed。

### 首页与图片灵感室的按需加载对照

在同一本机 Chrome、相同纸色／秋季与 1440×1000 视口、禁用 SW 的条件下，记录页面实际请求的 JS 解码后字节。gzip 只是本地估算，不作为 CDN 实际流量或速度指标。

| 页面 | 原 JS 字节 | 新 JS 字节 | 增量 | JS 请求数 |
| --- | ---: | ---: | ---: | --- |
| 首页 | 376,970 | 379,179 | +2,209（0.586%） | 20 → 20 |
| 图片灵感室 | 377,816 | 380,025 | +2,209（0.585%） | 17 → 17 |

增量来自共享作品、版本记录、搜索入口和路由登记。两个页面都没有加载图片工坊页面分块、Worker、四个编解码／缩放 JS 或任何 WASM。图片工坊本身打开及选图后也没有 WASM 请求，第一次转换才请求选定编码器；原尺寸 PNG 不请求 WASM。完整清单见 `bundle-before.json`、`bundle-after.json`、`bundle-comparison.json`。

### 正式部署与线上复核

2026-10-29 发布提交 `5952f7f4c96317fac7cb88531c82cac63369996d`。[Actions 40866710429](https://github.com/ZLongLab/MyWeb/actions/runs/40866710429) 的构建、Chromium 浏览器回归与 GitHub Pages 部署全部成功，正式地址为 [图片工坊](https://zlonglab.github.io/MyWeb/image-tools.html)。

线上完成 337 项逐项核对，包含全部 17 页、123 个预缓存文件与本机构建比对、四个 WASM 的 SHA-256、许可证与发现文件返回 200、优化器空配置与既有本地交互。正式页面打开和选图均不加载 WASM；实际完成 WebP／JPEG／AVIF／PNG 转换，输出均可解码且尺寸正确，WebP 比测试原 PNG 更小并实际触发下载。一个 Worker 请求四个唯一站内 WASM，`crossOriginIsolated=false` 下正常处理；脚本错误、失败资源、新增外部运行请求均为 0。详见 `live-results.json`。

首页作品数读取 `assets/site-snapshot.js` 中原有的已核对静态统计，仍为 7；新增工坊后的作品目录实际为 8 项。本次按“不改现有页面内容”的范围保留该文件和首页显示，没有运行快照生成／抓取／批准命令。GitHub 贡献范围和 53 次总数保持原样；首页统计与目录之间的差异在此明确记录。
