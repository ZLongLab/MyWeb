// 在这里维护作品。每个 id 需要唯一，并保持稳定，便于收藏和站内搜索定位。
// detail 中用 \n\n 分隔段落；sourceUrl 仅填写已经确认可公开访问的真实项目地址。
// featured 控制首页精选；image 是首页和作品详情共用的本地界面示例。
window.SITE_PROJECTS = [
  {
    id: 'image-prompts', title: '图片灵感室 · 图片提示词起点', category: '网页工具', status: '已上线 · 20 个起点', featured: false,
    summary: '按人物、产品、海报、场景和插画找灵感，复制图片提示词，收藏喜欢的构图。',
    tags: ['图片提示词', '原创示意', '本地收藏'], keywords: ['图片灵感室', '生图', '摄影', '水彩', '产品图', '海报', 'Nano Banana'],
    sourceUrl: 'https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts',
    detail: '20 个图片提示词起点与本站原创构图示意。提供分类、搜索、本地收藏和收藏备份。浏览与复制不调用 AI，实际生成需使用自己的模型服务。\n\n18 条提示词由本站编写，2 条参考改写自 YouMind OpenLab 的收录项目，保留原作者、来源与 CC BY 4.0 说明。配图不代表模型生成结果，也未验证具体模型效果。'
  },
  {
    id: 'prompt-optimizer', title: '提示词优化器 · Prompt Optimizer', category: '网页工具', status: '自托管 · v2.12.0', featured: false,
    summary: '接入自己的模型，优化提示词、比较结果，管理模板、变量与收藏。',
    tags: ['开源部署', '提示词优化', '自配模型'], keywords: ['Prompt Optimizer', '优化器', '系统提示词', '用户提示词', '模型管理', '对比测试'],
    sourceUrl: 'https://github.com/linshenkx/prompt-optimizer',
    detail: '基于 linshenkx/prompt-optimizer v2.12.0 的独立网页部署，保留原作者归属与 AGPL-3.0-only 许可。\n\n提供提示词优化、结果测试、模板、历史与收藏管理。公开版本没有预置 API 密钥；实际优化需要在模型管理中配置自己的服务，输入会发送至所选模型服务商。'
  },
  {
    id: 'video-prompts', title: '视频灵感室 · AI 提示词工具', category: '网页工具', status: '已上线 · 8 个模板', featured: false,
    summary: '选一个拍摄方向，填写自己的故事，整理可复制的提示词，收藏模板并保存草稿。',
    tags: ['AI 视频', '提示词', '本地草稿'],
    keywords: ['视频灵感室', 'Seedance', '电影', '动漫', 'MV', '分镜', '宠物', '定格动画'],
    detail: '小站里的视频创作工具：提供电影短片、动漫、定格动画、产品展示、旅行记录、音乐 MV、宠物与分镜 8 个方向。按模板整理文字，不调用 AI 或生成视频。\n\n支持本地收藏、可编辑草稿及 JSON 导入导出。方法参考 LearnPrompt/awesome-seedance，保留署名；中文示例由本站重新编写。'
  },
  {
    id: 'recallai',
    title: 'RecallAI',
    category: '本地工具',
    summary: '把散落的文件、文档和图片文字，变成可以在本机检索的资料库。',
    tags: ['Electron', 'React', 'TypeScript', 'SQLite FTS5', '离线 OCR'],
    keywords: ['本地检索', 'OCR 识别', '资料整理'],
    status: '本地开发 · v0.25.0',
    featured: true,
    image: {
      src: 'assets/images/recallai-preview-960.webp', smallSrc: 'assets/images/recallai-preview-640.webp', width: 960, height: 608,
      caption: 'RecallAI 应用界面示例（v0.23）；当前开发版本见上方项目状态。'
    },
    detail: 'RecallAI 是一个面向 Windows 的本地资料检索工具。可以用文件名、文档正文或截图里的文字找资料，再用收藏、标签、备注和专题资料夹继续整理。\n\n检索、文字提取和 OCR 在本机完成，无需账号或 AI API。当前项目状态为本地开发 v0.25.0；下方分别说明使用方式、实现取舍和仍需注意的边界。',
    sections: [
      {
        heading: '从什么问题出发',
        paragraphs: ['课程资料、文档和截图分散在不同目录时，只记得内容里的一个词，也可能很难找到对应文件。RecallAI 把这些内容线索放进同一个本地索引，让资料可以按内容被重新找到。', '找到以后还需要继续整理。收藏、标签、备注和专题记录的是资料之间的关系，同一份资料可以属于多个专题，归类时不必反复复制文件。']
      },
      {
        heading: '实际怎么用',
        ordered: true,
        list: ['先选择整理方式：仅索引文件或文件夹，继续从原位置读取；复制收纳则创建独立副本并保留来源原件。', '选择资料后等待扫描与文字提取。文字文档读取原生内容，支持的图片与扫描页使用本地 OCR；界面会展示进度和失败项。', '输入文件名、正文关键词或图片文字查找结果，打开原件或收纳副本，并按需要加入收藏、标签、备注和专题。', '资料发生变化后，原位置索引可重新扫描；同一来源再次收纳会先核对差异，确认后补入新增内容或另存修改版本。']
      },
      {
        heading: '实现与取舍',
        paragraphs: ['界面使用 Electron、React 与 TypeScript，本地索引使用 SQLite FTS5。文档提取与 Tesseract.js 中英文 OCR 负责把不同资料转成可检索的文字，扫描和识别由后台任务处理。', '原位置索引适合继续沿用已有目录；复制收纳适合保留一份独立资料库。这两种方式并存，也意味着需要明确提示打开的是原件还是副本，以及来源变化后如何更新。', '当前检索以关键词和明确的筛选条件为基础。它能找出匹配文字，但不会替用户生成文档答案；重要内容仍然回到原文阅读。']
      },
      {
        heading: '目前进展：旧索引转为收纳副本',
        paragraphs: ['v0.25.0 在“设置与资料源”中加入“转为复制收纳”：把指定来源已经索引的文件复制进资料库，保留原件，以及原来的收藏、标签、备注和专题关系。', '转换前会核对文件状态；来源缺失、内容变化或目标冲突时会给出提示，避免把变化悄悄覆盖过去。下面是隔离示例资料完成转换后的设置页面。'],
        image: { src: 'assets/images/recallai-adoption-preview-960.webp', smallSrc: 'assets/images/recallai-adoption-preview-640.webp', width: 960, height: 608, caption: 'RecallAI v0.25.0：旧索引转为复制收纳后的状态，使用隔离示例资料。' }
      },
      {
        heading: '使用边界',
        list: ['OCR 受图片清晰度、版式和字形影响，识别文字可能有误；近似匹配也需要核对原文。', '复制收纳保留的是独立副本，原件后续修改不会自动同步；再次收纳时需要核对并确认增量。', '索引备份不包含实际资料文件和收纳任务记录，完整备份需要同时保存这些内容。收纳副本不能替代独立备份。', '本站提供项目介绍与界面示例，当前没有在线演示或 RecallAI 安装包下载入口。']
      }
    ],
    articleId: 'recallai-local-search'
  },
  {
    id: 'document-assistant',
    title: 'DocumentAssistant',
    category: '本地工具',
    summary: '为课程资料、实验报告和文献提供分类归档，也把截图、标注和录屏放在顺手的位置。',
    tags: ['Python', 'PySide6', 'SQLite', '文档管理'],
    keywords: ['文档归档', '截图标注', '本地整理'],
    status: '源码 v0.23.4',
    featured: true,
    image: {
      src: 'assets/images/documentassistant-preview-960.webp', smallSrc: 'assets/images/documentassistant-preview-640.webp', width: 960, height: 600,
      caption: 'DocumentAssistant 文档分类与归档界面示例。'
    },
    sceneImage: { src: 'assets/images/documentassistant-dark-preview-960.webp', smallSrc: 'assets/images/documentassistant-dark-preview-640.webp', width: 960, height: 594, caption: 'DocumentAssistant 深色界面示例：临时示例资料，非当前默认主题。' },
    detail: '一个 Windows 本地文档管理与截图工具。根据文档内容给出规则分类建议，确认后复制归档并保留来源文件；可检索文件名、正文、标签与备注，支持文档库备份和归档恢复。分类与检索无需 AI API。\n\n截图工具包含原位标注、滚动长截图，以及可选电脑声音的区域录屏。本地整理的源码版本为 0.23.4。',
    sourceUrl: 'https://github.com/ZLongLab/DocumentAssistant',
    articleId: 'documentassistant-confirm-before-archive',
    sections: [
      {
        heading: '整理流程：建议、检查，再复制归档',
        paragraphs: ['选择文档库，添加文件或扫描文件夹，查看正文与规则分类建议，再调整分类、课程、项目和标签，确认后复制归档。来源文件保留；重复内容会提示，同名文件会自动编号。', '归档前核对扫描时的内容哈希，发现文件变化时要求重新读取，避免把旧正文和分类建议套用到已经修改的文件。']
      },
      {
        heading: '归档以后：检索与日常操作',
        paragraphs: ['在文档库检索文件名、正文、标签与备注，查看阅读状态与支持的 PDF 页面预览，再打开需要的文件。Ctrl+F 快速进入搜索，F5 刷新结果及文件状态。', '截图、标注与录屏作为独立入口使用，具体能力和适用范围见源码仓库说明。']
      },
      {
        heading: '版本与恢复',
        paragraphs: ['本机文档记录的源码版本为 v0.23.4，下载包仍为 v0.23.3，源码改动与安装包功能可能不同。本站截图使用示例资料，不代表每个已发布版本的默认界面。', '文档库提供备份与恢复，执行前应检查备份范围和目标位置。保留来源文件、复制归档和独立备份分别承担不同用途。']
      }
    ]
  },
  {
    id: 'folia-android',
    title: 'Folia · Android 适配',
    category: '开源适配',
    summary: '基于 Folia 开源音乐播放器，为 Android 使用场景整理打包和运行适配。',
    tags: ['开源适配', 'Capacitor', 'React', 'TypeScript'],
    status: 'Android 适配 · v0.7.19',
    detail: '基于 chthollyphile/folia-major 开源项目进行的 Android 适配。原项目提供音乐播放、歌词与多端界面，本站展示的是基于现有项目的适配与工程集成工作。\n\n适配使用 Capacitor，包含面向 Android 的构建和同步流程。保留原项目作者归属与 AGPL-3.0 许可；具体音乐服务的可用性仍取决于相应服务、网络与账号条件。',
    sourceUrl: 'https://github.com/ZLongLab/folia-major'
  },
  {
    id: 'personal-site',
    title: '有间小站 · 个人网站',
    category: '网站',
    summary: '把已经做过的东西放在一起，也为新的文章、想法和交流留出位置。',
    tags: ['HTML', 'CSS', 'JavaScript', '响应式设计'],
    status: '持续完善',
    detail: '从“想拥有一个自己的网站”开始，先把首页、作品和关于我搭起来，再加入文章列表与阅读页，让已经开始的项目和途中的想法都有一个位置。\n\n采用无需编译的静态页面，内容保存在本地文件中，支持手机与桌面浏览。目前仍在本地开发，个人介绍与作品内容会继续补充。'
  }
];
