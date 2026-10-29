# 视频灵感室内容扩充 · 1.11.0

基线：main `6c302f9f6406ff1a248a0a8baa89334e1e5cb13c`（内容版本 1.10.0）；工作分支 `codex/video-studio-content`。取用日期 **2026-10-29**，所有来源固定到提交快照，不自动同步。

## 范围与站主确认

以模板、词库、示例和来源内容为主。检查发现旧版本没有独立的运镜／景别／光线词库，只有自由输入框；“给 AI 完善”固定写 Seedance。站主在本轮明确选择了“允许最小接线，完成可选词库与平台区分”。据此仅在原字段内加入三个原生候选词选择器、让平台说明读取模板元数据，并修正来源链接；三栏布局、原筛选按钮、存储键和版本 1 格式保持。

原表单“横屏 16:9”在 JSX 中是裸文本，缺少 `<option>`，会让旧草稿的该值无法还原。本次补回原有允许值的选项节点，没有增加新的画幅值或修改 schema。样式文件、优化器、图片工坊与后端范围均不变。

## 来源与许可证

逐仓先读取 LICENSE（无该文件则检查根目录与 README），再读取内容。完整固定提交、许可范围及取用方式见 `source-snapshots.json`，页面来源区与 `public/THIRD-PARTY-LICENSES.txt` 使用同一份 `assets/video-content-sources.js` 登记。

| 来源 | 固定提交 | 许可证范围 | 本次采用方式 |
| --- | --- | --- | --- |
| [LearnPrompt / awesome-seedance · goodcase.ai](https://github.com/LearnPrompt/awesome-seedance/tree/ecd568ffa0edf687254dad213a99a8aee7388067) | `ecd568f` | LICENSE 为代码 MIT；README 明确策展、组织、模板提炼等 CC BY 4.0；原始提示词／媒体归各创作者 | 取分类、可复用结构和题材方向；不以代码 MIT 覆盖案例权属；示例均由本站原创 |
| [marsoyang1 / awesome-seedance-prompts](https://github.com/marsoyang1/awesome-seedance-prompts/tree/9fa64c4b788d2a8d924984f7d2c3ad9be3ed2098) | `9fa64c4` | 未提供明确许可证，LICENSE 地址返回错误，根目录只有 README 与 source | 只借时间轴／镜头／画面描述等字段结构；不改写或采用原剧情、台词、提示词、媒体 |
| [Yuyyxz / kling-prompt-engineering](https://github.com/Yuyyxz/kling-prompt-engineering/tree/11a67070991f757c017e84a9ece6c809371aa1fa) | `11a6707` | MIT，Copyright 2026 YY | 参考第 19 章摄影词典与第 03 章文生视频组织方法，重新编写释义、插入短语及两条可灵示例 |
| [rich5000 / seedance-prompt-guide](https://github.com/rich5000/seedance-prompt-guide/tree/1dbdd80db24e934963920e09c51e20653eee0125) | `1dbdd80` | MIT，Copyright 2026 rich5000 | 按角色 → 动作 → 镜头 → 氛围／声音校对；不采用参数表、素材编号或未经核实的能力宣称 |
| [VideoPrompt / VideoPrompts.tools](https://videoprompts.tools/) · [模板库快照](https://github.com/yangchangjiang/videoprompts/tree/cb47d134c1a8e0695587a6c8efbaaaca2dbb0917/templates) | `cb47d13` | 模板目录 CC BY 4.0；Python 包 MIT；站点 Worker 仅供参考 | 只参考平台、场景、运镜、光线、风格维度；未用模板正文、Python／Worker 代码、模型或媒体 |

页面 `#video-sources` 列全五个来源、许可边界、改写／原创说明和快照日期；说明书添加同范围登记，并链接统一第三方许可文件。保留 MIT 文本及 CC BY 署名与许可链接。没有下载或迁入来源的视频、GIF、图片，没有整段采用其案例提示词。

## 模板逐项对照

既有八个 id、标题、额外字段标签与提示、主体／场景／动作／画风／摄影机示例原文保留。只增加平台元数据、补齐时长／画幅示例，在 `extra` 末尾补声音或剪辑后期事项；旧用户保存的字段和输出不作迁移或重写。

| 模板 id | 标题／平台 | 出处与本站处理 |
| --- | --- | --- |
| `cinematic` | 电影短片／seedance | 既有 LearnPrompt 叙事结构；保留旧书店事件与微笑结尾，用 rich5000 公式校对顺序，补后期纸张与环境声音 |
| `anime` | 动漫风格／seedance | 既有风格锁定结构；少年、围巾、银杏叶故事不变，补后期风声与脚步建议 |
| `stop-motion` | 定格动画／seedance | 既有定格节奏结构；毛毡刺猬与苹果动作不变，补后期轻触拟音 |
| `product` | 产品展示／seedance | 既有产品静物结构；马克杯与晨光示例不变，补安静底噪 |
| `travel` | 旅行记录／seedance | 既有城市漫步结构；旅行者与蓝门示例不变，补后期街道环境声 |
| `music` | 音乐 MV／seedance | 既有音乐影像结构；键盘手与小剧场示例不变，强调实际录音、字幕、卡点后期处理 |
| `pet` | 宠物短片／seedance | 既有动物数量和外观约束；猫与薄荷示例不变，不加动物对白 |
| `storyboard` | 分镜设计／seedance | 既有逐镜任务结构；装帧工序示例不变，补后期拟音与切镜说明 |
| `story-sequence` | 分镜叙事／seedance | marso 的时间轴字段结构＋LearnPrompt 时间轴组织；修伞师的放伞、擦伞柄、挂伞三镜均为本站原创，每镜重复完整身份、空间、光线和结束状态 |
| `product-ad` | 产品广告／seedance | LearnPrompt 商业分镜＋VideoPrompt 字段维度；墨绿保温杯全貌、材质、收尾三镜原创，文字与声音交后期 |
| `one-take` | 一镜到底／通用 | LearnPrompt 连续路径思路＋公式校对；花店店员搬花盆到窗边的单镜头原创，不采用上游案例剧情 |
| `kling-daily` | 可灵 · 日常动作／kling | Yuyyxz 文生视频与摄影词典；窗边女子抬头的简单动作原创，无跨平台素材语法 |
| `kling-product` | 可灵 · 材质展示／kling | Yuyyxz 材质／运镜术语＋VideoPrompt 字段；静止玻璃瓶与小幅弧线观看原创 |
| `process-detail` | 手作过程／通用 | LearnPrompt 过程与不变量结构；木片磨边单道工序原创，写清双手和工具的接触关系 |
| `nature-observation` | 自然观察／通用 | VideoPrompt 字段结构＋Yuyyxz 微距、光线术语；芋叶与一滴水的变化原创，结束状态明确 |

新增模板继续放在原“叙事／展示”筛选桶里，没有新增筛选 UI。平台分别为 seedance、kling、通用；模板描述、词条和生成文字均有标记。可灵的“给 AI 完善”不会带 Seedance 指令，通用版不绑定平台。全部只使用自然语言，未核实的参考输入、音频、时长与精确卡点不伪装成参数；没有生成或验证实际视频。

## 词库与计数

| 内容 | 原 main | 1.11.0 |
| --- | ---: | ---: |
| 模板 | 8 | 15 |
| 独立运镜选项 | 0 | 16 |
| 独立景别选项 | 0 | 8 |
| 独立角度选项 | 0 | 8 |
| 独立光线选项 | 0 | 17 |
| 独立色彩选项 | 0 | 8 |
| 词条总数 | 0 | 57 |
| 来源说明 | 1 个来源 | 5 个固定快照来源 |

真实旧基线没有三组可选词库，不能计算“约两倍”，本次没有虚构旧数量。经站主确认新增三个候选词入口：运镜 16、景别／角度 16、光线／色彩 25。各项附一句原创中文释义、可插入自然语言、通用平台标记和来源 id。

选取来自第 19 章的运镜、支撑、景别、角度、光线、色彩类目；该快照第 19 章实际有 95 个表格条目（含跨类重复），没有照搬所谓“100+”数目。校对了 Tilt 与 Pedestal：前者是机位不变的垂直摇摄，后者是摄影机整体升降；不沿用可能混淆的中文归类。景别与角度分别登记，不把角度冒充额外景别。

## 兼容性与验收

- 存储键仍为 `myweb_video_studio_v1`；导出 app 仍为 `myweb-video-studio`；schema 与封装版本均为 1。
- 字段仍是 `subject / scene / action / look / camera / duration / aspect / extra`。输出文字顺序调整为动作 → 摄影机 → 画风光线，字段名和存储顺序不改。
- `validate`、`merge`、数量／字数限制、收藏与草稿读写、手动编辑保护和既有筛选逻辑不改。模板 id 只增加七个，旧八个 id 原样保留。
- 修改前由旧版真实页面导出按钮生成隔离测试备份 `tests/fixtures/video-studio-1.10-export.json`，覆盖八个旧模板各一份草稿（两种输出模式）与八个收藏。样本由合成测试资料生成，没有读取用户个人数据。新版实际导入、重载、逐份打开、逐字段核对、导出和重复导入，均保持原正文与内容。
- 三个候选词选择器仅向原有 `camera`／`look` 字段追加自然语言，超过 1000 字拒绝追加；手写输出不会被自动覆盖。没有保存词条对象、平台元数据或新字段。
- `check-video-core` 模板唯一性断言 8 → 15，补充 57 词条、平台分离、公式输出顺序与真实旧备份校验。既有浏览器测试中的 8 模板计数同步为 15，其他断言保留。

`npm run check` 与 `npm run verify` 全绿：图片／视频核心检查、Oxlint、完整 Pages 构建与 **33 项浏览器检查**全部通过。新增五项覆盖旧版八份草稿／八个收藏、15 模板示例、平台分离、候选词追加／长度保护／手动输出保护，以及 1440 纸／夜。纸／夜截图均已实际目检，原三栏与筛选保持，新模板、候选词和完整来源区可读，无横向溢出、脚本错误、外部运行请求或来源视频／GIF 请求。

结构化结果见 `browser-results.json`、`acceptance.json`、`content-inventory.json`、`legacy-export-evidence.json`。旧备份导入后逐份打开、逐字段核对，再导出时与原 `data` 深度相等；重复导入不增加草稿。`validate` 与 `merge` 的源码尾段与基线一致。来源正文与新增示例按连续 32 字符抽查，没有发现长段原文重用；这只是辅助检查，许可判断仍以逐项来源核对为准。

全部 24 份原样式源文件、图片工坊模块、优化器固定源码与工作流保持不变，没有新增依赖；feed／sitemap／robots、GitHub 贡献快照也未改。没有新增或迁入任何图片、视频、GIF 或 WASM。截图只留本机 `.tmp/video-studio-content/`。

内容版本 1.11.0，缓存版本 `1.11.0-react-0c54a9e0b48a`。主站发布文件仍为 134，预缓存 123，独立优化器 45；总发布 179，数量均与基线一致。新增数据由 Vite 合入视频页懒加载分块，不作为额外独立运行文件发布。

正式部署及线上复核结果在发布后追加。
