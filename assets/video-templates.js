// MyWeb original Chinese examples. Curation structures: LearnPrompt / goodcase.ai (CC BY 4.0).
// Additional provenance and license boundaries: assets/video-content-sources.js. No source prompts or media are mirrored.
window.VIDEO_TEMPLATES = [
  {
    "id": "cinematic",
    "dialect": "both",
    "source": "cinematic-narrative-short",
    "title": "电影短片",
    "family": "叙事",
    "en": "A SMALL STORY",
    "motif": "01",
    "tone": "moss",
    "description": "Seedance｜用一个可见的变化，讲清一小段故事。",
    "look": "写实电影质感，柔和自然光，克制的色彩",
    "example": {
      "subject": "一位穿浅灰外套的旧书店店主",
      "scene": "傍晚将要打烊的书店，暖光从台灯落在木桌上",
      "action": "整理旧书时，一张手写明信片从书页滑落；他拾起卡片，停下动作，轻轻笑了",
      "look": "写实电影质感，暖色台灯与窗外蓝色暮光",
      "camera": "从书桌中景缓慢推近到手中的明信片",
      "extra": "结尾停留在店主的微笑，不展示卡片上的文字\n后期声音建议：保留轻微环境底噪与纸张摩擦声，不增加对白。",
      "duration": "约 10 秒（剪辑目标）",
      "aspect": "横屏 16:9"
    },
    "extraLabel": "结尾与情绪变化",
    "extraHint": "最后画面停在哪里？人物的情绪发生了什么变化？",
    "tips": [
      "让转折发生在画面中，而不只写“感人”或“惊喜”。",
      "短镜头先完成一个主要动作；复杂剧情拆成几次生成。",
      "声音与配乐单列为后期建议；当前入口的音频与参考图能力尚未核实。"
    ],
    "pitfalls": [
      "一次塞入太多地点、人物和剧情转折。",
      "让模型生成大量需要精确阅读的文字。"
    ],
    "structure": [
      "先建立人物与场景，再呈现事件变化，最后落到一个明确的结束画面。",
      "前后保持人物衣着、关键道具与空间方向一致。"
    ],
    "platform": "seedance",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/cinematic-narrative-short.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula"
    ]
  },
  {
    "id": "anime",
    "dialect": "simple",
    "source": "anime-style-lock",
    "title": "动漫风格",
    "family": "动画",
    "en": "LINES IN MOTION",
    "motif": "02",
    "tone": "slate",
    "description": "Seedance｜把线条、色彩与人物风格说具体。",
    "look": "二维手绘动画，清晰线条，平涂色块，纸面纹理",
    "example": {
      "subject": "一位戴黄色围巾、背蓝色帆布包的短发少年",
      "scene": "初秋午后的河堤，小草随风轻轻摆动",
      "action": "少年沿河慢慢走着，停下来接住一片飘落的银杏叶，再抬头望向远处",
      "look": "二维手绘动画，细铅笔线条，低饱和水彩色块",
      "camera": "侧面中景跟随，在接住叶子时停住",
      "extra": "围巾、背包和发型保持一致，人物动作舒缓\n后期声音建议：用轻微风声与脚步声衬托停顿，不增加对白。",
      "duration": "约 10 秒（剪辑目标）",
      "aspect": "横屏 16:9"
    },
    "extraLabel": "画风与角色保持",
    "extraHint": "写清线条、上色、材质，以及不想变化的外观。",
    "tips": [
      "用线条粗细、上色方式和材质定义风格。",
      "写出角色可以重复识别的衣着与配件。",
      "声音与配乐单列为后期建议；当前入口的音频与参考图能力尚未核实。"
    ],
    "pitfalls": [
      "只写“动漫风”，没有可观察的风格特征。",
      "同时混合互相冲突的二维与三维表现。"
    ],
    "structure": [
      "先描述绘画方式与人物外观，再描述动作。",
      "同一段内维持线条、色板和人物比例一致。"
    ],
    "platform": "seedance",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/anime-style-lock.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula"
    ]
  },
  {
    "id": "stop-motion",
    "dialect": "simple",
    "source": "stop-motion-cadence",
    "title": "定格动画",
    "family": "动画",
    "en": "ONE FRAME AT A TIME",
    "motif": "03",
    "tone": "clay",
    "description": "Seedance｜保留手工材质与逐格移动的节奏。",
    "look": "手工定格质感，毛毡与纸板材质，可察觉的逐格步进",
    "example": {
      "subject": "一只穿绿色小围裙的毛毡刺猬",
      "scene": "纸板搭成的微型厨房，桌上有木碗和一颗红苹果",
      "action": "刺猬把苹果滚到碗边，用双手稳住，再小步绕到碗的另一侧",
      "look": "毛毡纤维与纸板切边清晰可见，温暖的手工定格动画",
      "camera": "固定机位，平视微缩桌面",
      "extra": "角色位置逐格小幅变化，保留停顿；不追求平滑的三维运动\n后期声音建议：少量物体轻触拟音，停顿处保留安静。",
      "duration": "约 10 秒（剪辑目标）",
      "aspect": "横屏 16:9"
    },
    "extraLabel": "材质与动作节奏",
    "extraHint": "哪些材质要看得见？哪里需要停顿？",
    "tips": [
      "说明手工材料及可见的表面细节。",
      "把逐格节奏写成视觉意图，不假设模型有专门的帧率控件。",
      "声音与配乐单列为后期建议；当前入口的音频与参考图能力尚未核实。"
    ],
    "pitfalls": [
      "仅添加“定格”一词，动作仍然过于丝滑。",
      "一个动作同时要求过多精细的物体接触。"
    ],
    "structure": [
      "固定微缩场景和手工材料，按顺序描述角色的短动作。",
      "保留逐格位移与短暂停顿的节奏。"
    ],
    "platform": "seedance",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/stop-motion-cadence.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula"
    ]
  },
  {
    "id": "product",
    "dialect": "both",
    "source": "product-commercial-shotlist",
    "title": "产品展示",
    "family": "展示",
    "en": "OBJECT & LIGHT",
    "motif": "04",
    "tone": "sand",
    "description": "Seedance｜让物体、光线和一个细节成为主角。",
    "look": "干净的商业静物摄影，柔和侧光，简洁背景",
    "example": {
      "subject": "一只没有品牌字样的米白色陶瓷马克杯",
      "scene": "浅色木桌，后方是模糊的亚麻窗帘",
      "action": "热气从杯口缓缓升起，一束晨光划过杯身，最后停留在把手和釉面的细节",
      "look": "自然光静物摄影，柔和阴影，温润陶瓷质感",
      "camera": "从杯身侧面缓慢靠近，杯子本身保持不动",
      "extra": "杯把、比例和釉色全程一致；结尾留出干净背景供后期加字\n后期声音建议：保留安静的房间底噪，不安排旁白。",
      "duration": "约 10 秒（剪辑目标）",
      "aspect": "横屏 16:9"
    },
    "extraLabel": "产品细节与收尾",
    "extraHint": "最重要的材质、形状、颜色是什么？结尾如何定格？",
    "tips": [
      "分别描述物体的形状、材质与颜色。",
      "把宣传文字留给后期；用镜头表现细节。",
      "声音与配乐单列为后期建议；当前入口的音频与参考图能力尚未核实。"
    ],
    "pitfalls": [
      "让产品在镜头间改变尺寸、结构或颜色。",
      "要求清晰复现包装上的细小文字。"
    ],
    "structure": [
      "先交代完整产品，再突出一个关键细节，收在稳定的展示画面。",
      "保持物体结构、颜色、比例与材质一致。"
    ],
    "platform": "seedance",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/product-commercial-shotlist.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula"
    ]
  },
  {
    "id": "travel",
    "dialect": "simple",
    "source": "travel-city-walk",
    "title": "旅行记录",
    "family": "叙事",
    "en": "A PLACE TO REMEMBER",
    "motif": "05",
    "tone": "moss",
    "description": "Seedance｜记录地点，也记录人在其中的感受。",
    "look": "自然旅行影像，真实光线，轻微手持感",
    "example": {
      "subject": "一位穿米色衬衫、提着布袋的旅行者",
      "scene": "清晨的海边小城，石板街道还带着雨后的水光",
      "action": "旅行者走过一扇蓝色木门，停下整理布袋，再望向街道尽头的海",
      "look": "低饱和旅行纪录片，自然晨光，轻微胶片颗粒",
      "camera": "背后中景缓慢跟拍，在人物停下时保持稳定",
      "extra": "一处地点、一次停留；不插入其他城市或季节的画面\n后期声音建议：轻微街道环境声与脚步声，节奏保持舒缓。",
      "duration": "约 10 秒（剪辑目标）",
      "aspect": "横屏 16:9"
    },
    "extraLabel": "地点与旅途节奏",
    "extraHint": "选几个真正需要出现的地方，并写清顺序。",
    "tips": [
      "用时间、天气和地面细节建立地点。",
      "一条短镜头先记录一件小事，再考虑跨地点蒙太奇。",
      "声音与配乐单列为后期建议；当前入口的音频与参考图能力尚未核实。"
    ],
    "pitfalls": [
      "只列出一串景点，没有观看顺序。",
      "镜头中途无缘由地改变天气或服装。"
    ],
    "structure": [
      "用环境建立地点，再通过人物的一次行动呈现旅途感受。",
      "人物外观、时间与天气保持连贯。"
    ],
    "platform": "seedance",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/travel-city-walk.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula"
    ]
  },
  {
    "id": "music",
    "dialect": "both",
    "source": "music-beat-sync-mv",
    "title": "音乐 MV",
    "family": "节奏",
    "en": "MOVE WITH THE SOUND",
    "motif": "06",
    "tone": "slate",
    "description": "Seedance｜先定情绪与节拍，再安排画面变化。",
    "look": "有节奏的音乐影像，统一色调，明确视觉中心",
    "example": {
      "subject": "一位穿深蓝舞台服、留短卷发的键盘手",
      "scene": "空旷的小剧场，侧面有一束暖白聚光灯",
      "action": "键盘手轻轻敲出几个音符，抬头看向空座位，灯光在最后一个动作后慢慢收暗",
      "look": "克制的独立音乐现场影像，深蓝与暖白配色",
      "camera": "固定中景，只在结束前缓慢靠近",
      "extra": "舒缓钢琴曲的情绪；精确卡点在剪辑阶段按实际音频处理\n后期按实际录音剪辑；精确卡点、字幕和音频衔接不作为模型参数。",
      "duration": "约 10 秒（剪辑目标）",
      "aspect": "横屏 16:9"
    },
    "extraLabel": "音乐与节奏",
    "extraHint": "写曲风、情绪、已知节拍或歌词段落；不知道BPM可以留空。",
    "tips": [
      "把画面变化与已知音乐段落对应。",
      "精确卡点以实际音频和后期剪辑为准。",
      "声音与配乐单列为后期建议；当前入口的音频与参考图能力尚未核实。"
    ],
    "pitfalls": [
      "没有音乐信息却要求每一拍精确同步。",
      "让背景表演抢走主要角色的视觉中心。"
    ],
    "structure": [
      "明确主要表演者与画面情绪，再安排少量动作节点。",
      "把精确节拍、字幕与音频衔接单独列为后期工作。"
    ],
    "platform": "seedance",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/music-beat-sync-mv.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula"
    ]
  },
  {
    "id": "pet",
    "dialect": "simple",
    "source": "pet-animal",
    "title": "宠物短片",
    "family": "日常",
    "en": "LITTLE EVERYDAY JOYS",
    "motif": "07",
    "tone": "clay",
    "description": "Seedance｜一个自然的小动作，就足够可爱。",
    "look": "自然光、柔和色彩，动作符合动物习性",
    "example": {
      "subject": "一只白胸口、橘色背毛的小猫",
      "scene": "雨后的窗台，玻璃上有水滴，旁边放着一盆薄荷",
      "action": "小猫轻轻嗅一片薄荷叶，耳朵转向窗外的声音，然后慢慢坐下",
      "look": "透明水彩动画，浅纸纹，柔软的橘绿配色",
      "camera": "固定近景，镜头与猫的眼睛高度相近",
      "extra": "始终只有一只猫；毛色分布和身体比例不变\n后期声音建议：用轻柔环境底噪衬托动作，不添加动物台词。",
      "duration": "约 10 秒（剪辑目标）",
      "aspect": "横屏 16:9"
    },
    "extraLabel": "动物特征与动作",
    "extraHint": "毛色、数量和体型要明确，选择一个自然的小动作。",
    "tips": [
      "明确动物数量与毛色分布。",
      "一个镜头只安排少量自然动作。",
      "声音与配乐单列为后期建议；当前入口的音频与参考图能力尚未核实。"
    ],
    "pitfalls": [
      "让普通动物同时完成复杂拟人表演。",
      "动物数量、四肢或花纹在画面中变化。"
    ],
    "structure": [
      "先建立动物的外观与位置，再表现一个小动作及它的反应。",
      "保持数量、毛色、身体比例与环境物体一致。"
    ],
    "platform": "seedance",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/pet-animal.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula"
    ]
  },
  {
    "id": "storyboard",
    "dialect": "both",
    "source": "storyboard-grid-to-video",
    "title": "分镜设计",
    "family": "分镜",
    "en": "BEFORE THE FIRST TAKE",
    "motif": "08",
    "tone": "sand",
    "description": "Seedance｜先排清镜头目的与顺序，再去生成。",
    "look": "清晰统一的分镜语言，镜头之间具有动作衔接",
    "example": {
      "subject": "一位穿白衬衫的手工装帧师",
      "scene": "安静的装帧工作室，同一张原木工作桌",
      "action": "把纸张叠齐、穿线、合上书脊，最后把完成的小书放到窗边",
      "look": "温暖纪录片质感，手部与纸张细节清楚",
      "camera": "全景交代桌面，近景记录手部，最后回到桌面中景",
      "extra": "三个镜头：叠纸；穿线；合书。每镜一个主要任务，前后沿用同一本书\n后期按叠纸、穿线、合书的顺序补拟音，镜头切换由剪辑完成。",
      "duration": "约 10 秒（剪辑目标）",
      "aspect": "横屏 16:9"
    },
    "extraLabel": "镜头顺序",
    "extraHint": "每行一个镜头：拍什么、怎么动、结束时停在哪里。",
    "tips": [
      "每个镜头写清目的、主要动作和结束状态。",
      "没有上传参考图时，用文字完整描述角色与场景。",
      "声音与配乐单列为后期建议；当前入口的音频与参考图能力尚未核实。"
    ],
    "pitfalls": [
      "直接把分镜图当成所有平台都支持的输入。",
      "用“同上”代替单个镜头所需的角色外观。"
    ],
    "structure": [
      "先列出镜头顺序，再分别描述每镜的画面、动作与结束状态。",
      "每个镜头独立可读，角色、道具和场景锚点保持一致。"
    ],
    "platform": "seedance",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/storyboard-grid-to-video.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula"
    ]
  },
  {
    "id": "story-sequence",
    "dialect": "both",
    "source": "timeline-shot-script",
    "sourceUrl": "https://github.com/marsoyang1/awesome-seedance-prompts/blob/9fa64c4b788d2a8d924984f7d2c3ad9be3ed2098/README.md",
    "sourceRefs": [
      "marso-storyboards",
      "learnprompt",
      "seedance-formula"
    ],
    "platform": "seedance",
    "title": "分镜叙事",
    "family": "叙事",
    "en": "THREE SHOTS / SEEDANCE",
    "motif": "09",
    "tone": "moss",
    "description": "Seedance｜先排时间轴，再把每一镜写成可单独复制的完整画面。",
    "look": "克制的写实短片，雨后冷环境光与室内暖灯",
    "example": {
      "subject": "一位穿靛蓝围裙、留短发的修伞师",
      "scene": "雨后的修伞铺，同一张木桌靠着左侧窗户，右侧墙上有一只空挂钩",
      "action": "修伞师把一把合拢的深绿色长柄伞放在木桌上，擦去伞柄水滴，再把伞挂到右侧挂钩上",
      "camera": "三个固定镜头：桌面中景、伞柄近景、挂钩中景；动作顺序保持连续",
      "look": "写实短片，左窗蓝色暮光与桌上暖灯同时存在，颜色克制",
      "duration": "约 9 秒（剪辑目标）",
      "aspect": "横屏 16:9",
      "extra": "时间轴是剪辑计划：S01 0–3秒放伞；S02 3–6秒擦伞柄；S03 6–9秒挂伞。\nS01｜穿靛蓝围裙、留短发的修伞师站在雨后修伞铺的木桌旁；左窗有蓝色暮光，桌上有暖灯。固定中景，他将合拢的深绿色长柄伞放到桌面，结束时手停在伞柄旁。\nS02｜穿靛蓝围裙、留短发的修伞师站在雨后修伞铺同一张木桌旁；左窗蓝色暮光与桌上暖灯照亮伞柄。固定近景，他用布擦去深绿色长柄伞伞柄上的水滴，结束时布离开伞柄。\nS03｜穿靛蓝围裙、留短发的修伞师位于雨后修伞铺木桌右侧；左窗仍有蓝色暮光，桌上暖灯照亮右墙。固定中景，他把合拢的深绿色长柄伞挂上右墙空挂钩，结束时双手离开、伞稳定悬挂。\n后期：按动作阶段硬切，补少量布料摩擦声；不加旁白。"
    },
    "extraLabel": "时间轴与逐镜描述",
    "extraHint": "时间仅为剪辑目标；每镜独立写全人物、场景、动作和结束状态。",
    "tips": [
      "先确认三个动作的前后状态，再分别生成每镜。",
      "时间轴用于控制故事容量，不是已验证的逐秒接口。",
      "逐镜提示词不得依赖上一条的角色记忆。"
    ],
    "pitfalls": [
      "把整段时间轴当成模型必然能精确执行的参数。",
      "换镜后省略角色衣着、灯光方向和道具状态。"
    ],
    "structure": [
      "按角色与道具、动作节点、摄影机、氛围的顺序组织内容。",
      "先列时间轴；每个 S 编号后的段落都能独立复制，镜间衔接留给后期。"
    ]
  },
  {
    "id": "product-ad",
    "dialect": "both",
    "source": "product-commercial-shotlist",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/product-commercial-shotlist.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula",
      "videoprompts-fields"
    ],
    "platform": "seedance",
    "title": "产品广告",
    "family": "展示",
    "en": "A QUIET AD / SEEDANCE",
    "motif": "10",
    "tone": "sand",
    "description": "Seedance｜先看清产品全貌，再选择一处材质细节，最后留下稳定收尾。",
    "look": "简洁的商业静物影像，柔和侧光，统一色板",
    "example": {
      "subject": "一只无品牌、深墨绿色的磨砂金属保温杯，杯盖与杯身同色",
      "scene": "浅灰桌面，左侧是一扇带薄纱的窗，后方为干净的浅灰墙",
      "action": "保温杯始终直立不动；先展示完整外形，再观察杯盖边缘与磨砂表面，最后回到产品全貌",
      "camera": "镜头一固定中景；镜头二微距缓慢横移；镜头三固定中景，右侧留出干净背景",
      "look": "柔和左侧窗光，墨绿与浅灰配色，金属反光克制而细腻",
      "duration": "约 9 秒（剪辑目标）",
      "aspect": "横屏 16:9",
      "extra": "S01｜无品牌的深墨绿磨砂金属保温杯直立在浅灰桌面，左侧薄纱窗光柔和，后方是浅灰墙。固定中景，完整呈现杯身、杯盖和底部，结束时产品位置不变。\nS02｜无品牌的深墨绿磨砂金属保温杯直立在浅灰桌面，左侧薄纱窗光照亮同色杯盖边缘。微距镜头沿杯盖边缘缓慢横移，观察磨砂表面，结束时停在清楚的材质细节。\nS03｜无品牌的深墨绿磨砂金属保温杯直立在浅灰桌面，左侧薄纱窗光保持一致，后方是浅灰墙。固定中景，杯子完整可见，右侧保留干净背景，结束时画面稳定。\n后期：品牌、文字、音乐与精确切点另行制作；不让模型生成包装小字。"
    },
    "extraLabel": "产品锚点与广告收尾",
    "extraHint": "写清不变的外形、材质与颜色；卖点文字和品牌标识放在后期。",
    "tips": [
      "三镜分别承担全貌、细节、收尾，一个镜头一个重点。",
      "在每镜重复杯盖、杯身颜色及窗光方向。",
      "原生音频与参考输入能力未核实，只交付自然语言镜头方案。"
    ],
    "pitfalls": [
      "把没有演示的功能写成已证实的产品卖点。",
      "让杯盖、比例或品牌文字在镜头间变化。"
    ],
    "structure": [
      "产品角色与位置 → 可见展示动作 → 镜头安排 → 统一光线与后期声音。",
      "三镜独立生成后再剪辑，结尾保留稳定画面用于后期排字。"
    ]
  },
  {
    "id": "one-take",
    "dialect": "both",
    "source": "pov-continuous-take",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/pov-continuous-take.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula"
    ],
    "platform": "通用",
    "title": "一镜到底",
    "family": "叙事",
    "en": "ONE CONTINUOUS PATH",
    "motif": "11",
    "tone": "slate",
    "description": "通用｜一处空间、一条可走的路径，让连续动作有明确落点。",
    "look": "自然记录感，平稳连续的摄影机运动，统一光线",
    "example": {
      "subject": "一位穿棕色围裙、束着低马尾的花店店员，手持一盆白色小花",
      "scene": "同一间小花店，左侧柜台到右侧窗边之间有一条通畅过道",
      "action": "店员从左侧柜台前沿过道缓缓走向右侧窗边，把白色花盆放稳后松开双手，停下来观察花朵",
      "camera": "一条连续的侧面跟拍；沿过道平行移动，在花盆放稳后停住，不插入切镜",
      "look": "窗边漫射自然光，棕色围裙与绿叶配色温和，人物与花盆清楚",
      "duration": "约 10 秒（剪辑目标）",
      "aspect": "横屏 16:9",
      "extra": "起点是左侧柜台，路径沿过道，落点是右侧窗边。始终只有一位穿棕色围裙、束低马尾的店员和一盆白色小花；先让花盆接触窗台并稳定，再松手。结尾停在花盆与店员的安静侧影。后期可补脚步和花盆轻触窗台的声音；不要求模型精确同步。"
    },
    "extraLabel": "连续路径与落点",
    "extraHint": "写起点、经过的位置、终点与结束状态，不把多处地点塞进同一条路径。",
    "tips": [
      "先检查摄影机和人物的通行空间。",
      "连续镜头只安排一个主要任务，不在中途切到特写。",
      "预计片长只用于控制动作容量，实际生成结果仍需检查。"
    ],
    "pitfalls": [
      "要求镜头穿墙、穿桌或突然跨到另一处地点。",
      "同时要求固定机位、环绕和长距离跟拍。"
    ],
    "structure": [
      "先固定人物、花盆和空间方向，再按起点、路径、落点描述行动。",
      "摄影机只承担连续跟随；结束时让主体与画面都稳定。"
    ]
  },
  {
    "id": "kling-daily",
    "dialect": "rich",
    "source": "kling-text-to-video",
    "sourceUrl": "https://github.com/Yuyyxz/kling-prompt-engineering/blob/11a67070991f757c017e84a9ece6c809371aa1fa/03-t2v-guide.md",
    "sourceRefs": [
      "kling-terms",
      "videoprompts-fields"
    ],
    "platform": "kling",
    "title": "可灵 · 日常动作",
    "family": "叙事",
    "en": "A SMALL MOMENT / KLING",
    "motif": "12",
    "tone": "moss",
    "description": "可灵（kling）｜用明确的主体与一个小动作组织文生视频描述。",
    "look": "克制写实影像，自然光，表情与衣着保持稳定",
    "example": {
      "subject": "一位穿浅绿色针织开衫、留齐耳短发的年轻女子",
      "scene": "雨后的木窗边，桌上放着一本没有可读文字的浅色笔记本",
      "action": "女子先低头看笔记本，随后缓缓抬头望向窗外，最后保持安静的侧脸",
      "camera": "固定中近景，平视人物侧脸，摄影机不移动",
      "look": "阴天漫射光从木窗进入，浅绿与木色保持低饱和，肤色自然",
      "duration": "约 8 秒（剪辑目标）",
      "aspect": "横屏 16:9",
      "extra": "仅使用可灵文生视频方向的普通文字。始终保持浅绿开衫、齐耳短发、木窗和浅色笔记本；动作只包含抬头与视线转移。结束时人物侧脸稳定。后期声音建议为安静室内底噪，不安排对白或口型同步。"
    },
    "extraLabel": "可灵写法与稳定锚点",
    "extraHint": "主体、动作、摄影机、光线依次写清；参数和参考图能力以当前入口为准。",
    "tips": [
      "可灵方向先用具体名词和可见动作建立画面。",
      "一条镜头采用固定机位与一次视线变化，先减少动作密度。",
      "没有实际参考图时完整描述人物外观，不使用图片编号。"
    ],
    "pitfalls": [
      "混入其他平台的专属素材语法。",
      "把当前入口未核实的时长、运镜预设或音频选项写成接口参数。"
    ],
    "structure": [
      "主体和场景 → 一次可见动作 → 明确机位 → 光线与后期声音。",
      "平台标注为可灵（kling）；全部使用自然语言，不假定当前账号开放某项功能。"
    ]
  },
  {
    "id": "kling-product",
    "dialect": "rich",
    "source": "kling-material-study",
    "sourceUrl": "https://github.com/Yuyyxz/kling-prompt-engineering/blob/11a67070991f757c017e84a9ece6c809371aa1fa/19-cinematography-dictionary.md",
    "sourceRefs": [
      "kling-terms",
      "videoprompts-fields"
    ],
    "platform": "kling",
    "title": "可灵 · 材质展示",
    "family": "展示",
    "en": "MATERIAL & SPACE / KLING",
    "motif": "13",
    "tone": "sand",
    "description": "可灵（kling）｜把玻璃、金属等材质写成可观察的光线与表面变化。",
    "look": "简洁静物摄影，轮廓分明，反光不过度",
    "example": {
      "subject": "一只透明方形玻璃瓶，配圆柱形银色瓶盖，没有标签或文字",
      "scene": "深灰色静物台，后方有一块漫射白色光面，四周布景保持简洁",
      "action": "玻璃瓶在整个镜头中保持静止；随着观看角度缓慢变化，瓶壁边缘与银色瓶盖的反光逐渐显现",
      "camera": "近景，摄影机在瓶子正面缓慢做一小段弧线移动，停在略偏右侧的角度",
      "look": "后方漫射光勾勒玻璃边缘，银色瓶盖保留柔和高光，背景保持深灰",
      "duration": "约 8 秒（剪辑目标）",
      "aspect": "横屏 16:9",
      "extra": "可灵文生视频文本方向，无实际参考附件。方形瓶身、圆柱形银色瓶盖和无标签外观全程一致；不改变瓶子结构，不新增手部或悬浮物。结尾保持稳定的略偏右侧视角。后期声音只建议少量环境底噪，不要求原生合成。"
    },
    "extraLabel": "可灵材质与结构保持",
    "extraHint": "先写物体固定结构，再写光线和一种摄影机运动。",
    "tips": [
      "把透明边缘、金属反射与背景明暗分开描述。",
      "主体不动时让摄影机承担唯一的运动。",
      "摄影术语表达观看意图，不视为已验证的专属控制参数。"
    ],
    "pitfalls": [
      "把环绕写成物体自行旋转，造成瓶盖与瓶身漂移。",
      "要求瓶身在同一镜头从玻璃变成金属。"
    ],
    "structure": [
      "固定物体角色与结构 → 明确静止状态 → 单一弧线运镜 → 光线和后期声音。",
      "保持可灵平台标注；不用未验证的参考图编号、参数或接口。"
    ]
  },
  {
    "id": "process-detail",
    "dialect": "both",
    "source": "process-transformation-montage",
    "sourceUrl": "https://github.com/LearnPrompt/awesome-seedance/blob/ecd568ffa0edf687254dad213a99a8aee7388067/docs/templates/zh/process-transformation-montage.md",
    "sourceRefs": [
      "learnprompt",
      "seedance-formula"
    ],
    "platform": "通用",
    "title": "手作过程",
    "family": "展示",
    "en": "ONE CAREFUL STEP",
    "motif": "14",
    "tone": "clay",
    "description": "通用｜只记录一道工序，用接触、移动与停手交代过程。",
    "look": "安静的手作纪录片，表面纹理清楚，动作节奏自然",
    "example": {
      "subject": "一双戴浅褐色帆布袖套的手，右手拿细砂纸，左手扶住一块浅色木片",
      "scene": "靠近窗边的同一张木工作台，桌上只有木片、砂纸与少量木屑",
      "action": "左手稳住木片，右手用砂纸沿木片的一条边缓慢磨过两次，最后双手停在木片两侧",
      "camera": "固定近景，略高角度，两只手、砂纸和木片边缘都留在画面内",
      "look": "柔和侧窗光，浅木色与帆布棕保持温和，木纹和砂纸接触点清楚",
      "duration": "约 8 秒（剪辑目标）",
      "aspect": "横屏 16:9",
      "extra": "只表现磨边这一道工序，不增加锯切、上漆或成品变形。木片的长宽与朝向保持不变，砂纸始终由右手持有，结束时停手并保留干净的边缘。后期按实际动作补轻微磨擦拟音，精确同步由剪辑完成。"
    },
    "extraLabel": "工序状态与接触关系",
    "extraHint": "谁固定物体、谁移动工具、何时接触和停手，都写成可见动作。",
    "tips": [
      "先写不变的材料形状，再写这一道工序的变化。",
      "检查手、工具与接触点是否都在画框内。",
      "声音作为后期拟音建议，不冒充当前平台已验证能力。"
    ],
    "pitfalls": [
      "一个镜头同时要求切割、打磨、上漆与组装。",
      "工具换手或物体尺寸在过程中无理由改变。"
    ],
    "structure": [
      "材料与操作角色 → 一个工序 → 能看清接触点的机位 → 材质与后期声音。",
      "保留开始、持续与结束状态，避免把过程写成无原因的形态变换。"
    ]
  },
  {
    "id": "nature-observation",
    "dialect": "both",
    "source": "original-nature-study",
    "sourceUrl": "https://github.com/yangchangjiang/videoprompts/tree/cb47d134c1a8e0695587a6c8efbaaaca2dbb0917/templates",
    "sourceRefs": [
      "videoprompts-fields",
      "kling-terms"
    ],
    "platform": "通用",
    "title": "自然观察",
    "family": "展示",
    "en": "WATCH A SMALL CHANGE",
    "motif": "15",
    "tone": "moss",
    "description": "通用｜用微距观察一处自然变化，让环境、运镜、光线与风格各有位置。",
    "look": "安静的自然观察影像，真实纹理，柔和光线",
    "example": {
      "subject": "一片深绿色芋叶，叶脉清楚，表面有一滴透明水珠",
      "scene": "雨后的院子，画面只包含这片芋叶与模糊的深绿植物背景",
      "action": "水珠沿一条叶脉缓慢向叶尖滑动，最后悬停在叶缘，没有落下",
      "camera": "固定微距机位，水珠移动的叶脉与叶缘都留在画面内",
      "look": "阴天柔光，深绿低饱和色彩，水珠有小而清楚的反光，叶面纹理自然",
      "duration": "约 8 秒（剪辑目标）",
      "aspect": "横屏 16:9",
      "extra": "主体始终是一片芋叶和一滴水珠，不增加昆虫、手或其他水珠；叶片形状与叶脉方向保持不变。结束在水珠悬停的稳定画面。后期保留轻柔环境底噪，不增加水珠落地声。"
    },
    "extraLabel": "观察范围与结束状态",
    "extraHint": "限定物体数量、细节范围和变化终点，不在结尾突然换到另一处环境。",
    "tips": [
      "平台、场景、运镜、光线与风格分别写清，不用大量形容词叠加。",
      "微距镜头先选择微小而单一的变化。",
      "把声音与精确结束时间作为后期事项。"
    ],
    "pitfalls": [
      "同时要求极浅景深与整片叶子所有位置完全清楚。",
      "让微小水珠承担跳跃、旋转等无原因的复杂运动。"
    ],
    "structure": [
      "主体与观察范围 → 一次自然变化 → 稳定微距机位 → 光线、色彩与后期声音。",
      "这是通用自然语言方案，具体入口的时长、参考输入与音频能力仍需核实。"
    ]
  }
];
window.VIDEO_PLATFORM_PROFILES = {
  "seedance": {
    "label": "Seedance",
    "brief": "目标是 Seedance 创作方向；当前入口的参数和参考图能力尚未核实，请只用普通自然语言，不编造专属参数、参考图编号或接口。没有实际附件时不要假装看过参考图；精确卡点、字幕、声音与合成单列为后期事项。"
  },
  "kling": {
    "label": "可灵（kling）",
    "brief": "目标是可灵（kling）文生视频方向；依次写清主体、可见动作、摄影机和光线氛围。当前入口的时长、参考图与音频能力尚未核实，只用普通自然语言，不编造参数、素材编号或接口。没有实际附件时不假装看过参考图；字幕、配乐与精确卡点单列为后期事项。"
  },
  "通用": {
    "label": "通用（未绑定平台）",
    "brief": "目标是通用视频创作方向，未绑定具体平台。只交付自然语言镜头方案，不借用任何平台的专属参数、参考图编号或接口。没有实际附件时不要假装看过参考图；精确卡点、声音、字幕与合成单列为后期事项。"
  }
};
