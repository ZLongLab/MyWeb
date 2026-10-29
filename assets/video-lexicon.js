// Adapted terminology: Yuyyxz/kling-prompt-engineering, MIT, snapshot 11a6707.
// Definitions and natural-language insertions rewritten for MyWeb. No compatibility
// check marks or model-specific parameter promises are imported from upstream.
window.VIDEO_LEXICON = [
  { id: 'movement', title: '运镜', target: 'camera', entries: [
    { term: '缓慢推近', reference: 'Push-in / Dolly-in', meaning: '摄影机向主体靠近，让细节逐渐占据画面。', value: '摄影机缓慢向主体推近，到细节清楚时停稳', platform: '通用', source: 'kling-terms' },
    { term: '缓慢拉远', reference: 'Pull-back / Dolly-out', meaning: '摄影机后退，把主体周围的空间逐渐带入。', value: '摄影机缓慢后退，逐渐交代主体周围的环境', platform: '通用', source: 'kling-terms' },
    { term: '水平摇摄', reference: 'Pan', meaning: '机位不挪动，只向左或向右转动观看方向。', value: '机位保持不动，摄影机沿水平方向缓慢摇摄', platform: '通用', source: 'kling-terms' },
    { term: '垂直摇摄', reference: 'Tilt', meaning: '机位高度不变，只把镜头朝向由下转上或由上转下。', value: '机位高度保持不变，镜头由下向上缓慢转动', platform: '通用', source: 'kling-terms' },
    { term: '侧面跟拍', reference: 'Tracking / Lateral Track', meaning: '摄影机与行进主体平行移动，维持相近的距离。', value: '摄影机从侧面平行跟随主体，保持稳定距离', platform: '通用', source: 'kling-terms' },
    { term: '小幅环绕', reference: 'Orbit / Arc', meaning: '摄影机沿主体外侧的弧线移动，展示相邻侧面。', value: '摄影机沿主体外侧做一段缓慢的小幅弧线移动', platform: '通用', source: 'kling-terms' },
    { term: '摇臂运动', reference: 'Crane', meaning: '摄影机在连续升高或降低时逐渐揭示空间层次。', value: '摄影机以平稳的摇臂运动缓缓升高，逐渐露出周围空间', platform: '通用', source: 'kling-terms' },
    { term: '轻微手持', reference: 'Handheld', meaning: '保留小幅自然晃动，让观察接近日常记录。', value: '使用轻微手持感，主体和主要动作始终清楚', platform: '通用', source: 'kling-terms' },
    { term: '稳定器跟随', reference: 'Steadicam', meaning: '以连续、平顺的移动跟随人物穿过明确路径。', value: '摄影机以平稳连续的移动跟随主体，不突然改变方向', platform: '通用', source: 'kling-terms' },
    { term: '焦点转移', reference: 'Rack Focus', meaning: '机位不动，把清晰位置从一个物体转移到另一个。', value: '摄影机位置不变，焦点从近处物体缓慢转到后方主体', platform: '通用', source: 'kling-terms' },
    { term: '小幅变焦', reference: 'Zoom', meaning: '机位不前进，通过焦距变化改变画面中的主体尺度。', value: '机位保持不变，做一段克制的小幅变焦', platform: '通用', source: 'kling-terms' },
    { term: '快速摇摄', reference: 'Whip Pan', meaning: '视线快速转向另一处，适合把切点留给后期。', value: '镜头做一次短促的水平快速摇摄，停在明确目标上', platform: '通用', source: 'kling-terms' },
    { term: '垂直升降', reference: 'Pedestal', meaning: '摄影机整体升高或降低，镜头朝向可保持不变。', value: '摄影机整体缓慢升高，观看方向保持稳定', platform: '通用', source: 'kling-terms' },
    { term: '固定机位', reference: 'Tripod (Locked-off)', meaning: '摄影机位置与朝向都不改变，由主体动作推动画面。', value: '固定机位，摄影机位置与朝向全程保持不变', platform: '通用', source: 'kling-terms' },
    { term: '滑轨横移', reference: 'Slider', meaning: '摄影机沿短直线平移，用前后景差异显示空间。', value: '摄影机沿短滑轨缓慢横移，保留前后景的空间层次', platform: '通用', source: 'kling-terms' },
    { term: '平稳航拍', reference: 'Drone / UAV', meaning: '从空中沿简单路径观察地点和地形关系。', value: '摄影机以平稳航拍视角沿一条清楚的路径前进', platform: '通用', source: 'kling-terms' }
  ] },
  { id: 'shot', title: '景别', target: 'camera', entries: [
    { term: '极远景', reference: 'Extreme Wide Shot (EWS)', meaning: '环境占据大部分画面，主体只作为尺度参照。', value: '极远景，先建立主体与大范围环境的关系', platform: '通用', source: 'kling-terms' },
    { term: '全景／远景', reference: 'Wide Shot (WS)', meaning: '让主体全身及附近环境同时进入画面。', value: '全景，让主体的完整外形与附近环境一起入画', platform: '通用', source: 'kling-terms' },
    { term: '中远景', reference: 'Medium Wide Shot (MWS)', meaning: '保留较多身体动作与脚下或周边空间。', value: '中远景，完整保留主要肢体动作和周围空间', platform: '通用', source: 'kling-terms' },
    { term: '中景', reference: 'Medium Shot (MS)', meaning: '兼顾主体的动作和所处环境，适合交代过程。', value: '中景，让主体动作与场景关系都清楚可见', platform: '通用', source: 'kling-terms' },
    { term: '中近景', reference: 'Medium Close-Up (MCU)', meaning: '偏重上半身与表情，同时留少量背景信息。', value: '中近景，重点观察上半身动作与表情', platform: '通用', source: 'kling-terms' },
    { term: '近景', reference: 'Close-Up (CU)', meaning: '减少周围环境，把注意力放在面部或物体局部。', value: '近景，突出主体表情或物体的一处关键细节', platform: '通用', source: 'kling-terms' },
    { term: '极近景', reference: 'Extreme Close-Up (ECU)', meaning: '只保留眼神、手指等很小区域，强调细微变化。', value: '极近景，只观察一个明确的细小区域和变化', platform: '通用', source: 'kling-terms' },
    { term: '微距', reference: 'Macro', meaning: '靠近微小物体或表面纹理，显示日常难见的细节。', value: '微距视角，清楚呈现表面纹理与微小变化', platform: '通用', source: 'kling-terms' }
  ] },
  { id: 'angle', title: '角度', target: 'camera', entries: [
    { term: '平视', reference: 'Eye Level', meaning: '观看高度接近主体主要动作或眼睛所在的位置。', value: '平视机位，镜头高度接近主体主要动作的位置', platform: '通用', source: 'kling-terms' },
    { term: '低角度', reference: 'Low Angle', meaning: '从较低位置向上观察，强化主体的高度。', value: '从略低的位置向上观察主体', platform: '通用', source: 'kling-terms' },
    { term: '高角度', reference: 'High Angle', meaning: '从较高位置向下看，便于交代桌面或地面关系。', value: '从略高的位置向下观察，交代主体与周围物体的关系', platform: '通用', source: 'kling-terms' },
    { term: '鸟瞰', reference: "Bird's Eye View", meaning: '从上方向下观看，把场景组织为平面关系。', value: '鸟瞰视角，从上方交代场景的空间分布', platform: '通用', source: 'kling-terms' },
    { term: '轻微倾斜', reference: 'Dutch Angle / Tilted', meaning: '让地平线小幅倾斜，以表达不稳定的观看感受。', value: '画面保持轻微倾斜，主体动作仍清楚可辨', platform: '通用', source: 'kling-terms' },
    { term: '过肩视角', reference: 'Over-the-Shoulder (OTS)', meaning: '以前景肩部建立观看者与远处对象的关系。', value: '过肩视角，以前景人物的肩部衬托远处的观看对象', platform: '通用', source: 'kling-terms' },
    { term: '主观视角', reference: 'Point of View (POV)', meaning: '从角色所在的位置观察，让观众跟随其视线。', value: '主观视角，沿角色当前的视线观察场景', platform: '通用', source: 'kling-terms' },
    { term: '虫眼视角', reference: "Worm's Eye View", meaning: '从贴近地面的低位置观察上方物体。', value: '贴近地面的极低机位，向上观察主体', platform: '通用', source: 'kling-terms' }
  ] },
  { id: 'lighting', title: '光线', target: 'look', entries: [
    { term: '自然光', reference: 'Natural Light', meaning: '以日光作为主要照明，保留环境中的明暗变化。', value: '自然光照明，保留环境本身的明暗层次', platform: '通用', source: 'kling-terms' },
    { term: '黄金时段', reference: 'Golden Hour', meaning: '以低角度暖日光形成柔和轮廓与较长阴影。', value: '低角度的暖色日光，阴影柔和而修长', platform: '通用', source: 'kling-terms' },
    { term: '蓝调时刻', reference: 'Blue Hour', meaning: '利用日落前后的冷色环境光形成安静气氛。', value: '蓝色暮光包围场景，整体明暗过渡柔和', platform: '通用', source: 'kling-terms' },
    { term: '阴天漫射', reference: 'Overcast / Diffused', meaning: '均匀的天空光减轻硬阴影，适合安静的日常画面。', value: '阴天漫射光，明暗均匀，没有生硬的阴影边缘', platform: '通用', source: 'kling-terms' },
    { term: '逆光', reference: 'Backlight', meaning: '主光位于主体后方，让外轮廓更明显。', value: '光线从主体后方进入，保留轮廓和必要的正面细节', platform: '通用', source: 'kling-terms' },
    { term: '侧光', reference: 'Side Light', meaning: '从一侧照亮主体，用明暗交界显示体积与纹理。', value: '侧面光线照亮主体，以明暗交界显示体积', platform: '通用', source: 'kling-terms' },
    { term: '轮廓光', reference: 'Rim Light', meaning: '在主体边缘形成窄亮边，让其与背景分开。', value: '主体边缘有一圈克制的轮廓光，与背景分开', platform: '通用', source: 'kling-terms' },
    { term: '体积光', reference: 'Volumetric Light', meaning: '光束穿过薄雾或微尘，让照射路径可见。', value: '薄雾中的光束可见，亮度保持克制', platform: '通用', source: 'kling-terms' },
    { term: '霓虹灯光', reference: 'Neon', meaning: '利用画面内的彩色灯源形成局部色光。', value: '场景内彩色灯源形成局部霓虹色光', platform: '通用', source: 'kling-terms' },
    { term: '强明暗对比', reference: 'Chiaroscuro', meaning: '让亮部和暗部清楚分区，以突出观看重点。', value: '用明确的亮暗分区突出主体，暗部仍保留必要细节', platform: '通用', source: 'kling-terms' },
    { term: '场景内光源', reference: 'Practical Light', meaning: '让可见的台灯、窗户或灯具说明光从哪里来。', value: '主要照明来自场景内可见的灯具或窗户', platform: '通用', source: 'kling-terms' },
    { term: '高调照明', reference: 'High Key', meaning: '整体较明亮，阴影较轻，适合干净的展示画面。', value: '高调照明，画面明亮，阴影轻而柔和', platform: '通用', source: 'kling-terms' },
    { term: '低调照明', reference: 'Low Key', meaning: '以较多暗部衬托少量亮部，保留清楚的主体。', value: '低调照明，以暗背景衬托主体上的少量亮部', platform: '通用', source: 'kling-terms' },
    { term: '硬光', reference: 'Hard Light', meaning: '形成边缘明确的投影，适合突出几何形状。', value: '硬光形成边缘清楚的投影，突出物体形状', platform: '通用', source: 'kling-terms' },
    { term: '柔光', reference: 'Soft Light', meaning: '明暗过渡平缓，减轻表面纹理的尖锐感。', value: '柔光照明，明暗交界与阴影边缘平缓', platform: '通用', source: 'kling-terms' },
    { term: '镜面高光', reference: 'Specular', meaning: '在玻璃、金属或水面上保留小而明确的反光。', value: '物体表面保留克制的镜面高光，细节不过曝', platform: '通用', source: 'kling-terms' },
    { term: '环境光', reference: 'Ambient', meaning: '以周围空间的整体亮度建立自然的基础照明。', value: '均匀的环境光建立基础亮度，主体与背景层次清楚', platform: '通用', source: 'kling-terms' }
  ] },
  { id: 'color', title: '色彩', target: 'look', entries: [
    { term: '暖色调', reference: 'Warm Tone', meaning: '以偏黄、橙的色彩组织画面，维持统一的温暖倾向。', value: '统一的暖色调，肤色与物体本色保持自然', platform: '通用', source: 'kling-terms' },
    { term: '冷色调', reference: 'Cool Tone', meaning: '以偏蓝、青的色彩组织安静或疏离的画面。', value: '统一的冷色调，主体仍与背景清楚分离', platform: '通用', source: 'kling-terms' },
    { term: '低饱和', reference: 'Desaturated', meaning: '收敛色彩强度，让质感和动作成为重点。', value: '低饱和色彩，以材质和动作作为观看重点', platform: '通用', source: 'kling-terms' },
    { term: '高饱和', reference: 'High Saturation', meaning: '保留鲜明的色彩差异，突出明确的视觉中心。', value: '鲜明的高饱和色彩，视觉中心保持单一', platform: '通用', source: 'kling-terms' },
    { term: '青橙对比', reference: 'Teal and Orange', meaning: '用冷暖两组颜色拉开主体和环境的层次。', value: '青色环境与温暖主体形成克制的冷暖对比', platform: '通用', source: 'kling-terms' },
    { term: '黑白', reference: 'Monochrome / B&W', meaning: '去掉色相差异，以明暗和纹理组织画面。', value: '黑白影像，以明暗层次和表面纹理组织画面', platform: '通用', source: 'kling-terms' },
    { term: '胶片颗粒', reference: 'Film Grain', meaning: '加入轻微颗粒观感，仍让主体细节清楚。', value: '细腻的胶片颗粒观感，不遮住主体细节', platform: '通用', source: 'kling-terms' },
    { term: '交叉冲洗色感', reference: 'Cross-Process', meaning: '以有意的色偏表现实验影像，控制偏色范围。', value: '克制的实验性色偏，保留主体可辨识的颜色关系', platform: '通用', source: 'kling-terms' }
  ] }
];
