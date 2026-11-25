// 20 bespoke original editorial composition illustrations.
// Deliberately schematic/illustrative diagrams, never presented as AI model outputs.
import fs from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const window = {};
runInNewContext(await fs.readFile(new URL('assets/image-inspiration-data.js', root), 'utf8'), { window });

function wrapSvg(title, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="350" viewBox="0 0 500 350" fill="none">
<title>${title} · 本站构图示意</title>
<defs>
${defs}
</defs>
${body}
</svg>\n`;
}

const SCENES = {
  // 1. 窗边的自然肖像：法式柔光窗格、斜射日光带、柔和左侧坐姿剪影与绿植留白
  'window-portrait': () => wrapSvg(
    '窗边的自然肖像',
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f6f2e8"/><stop offset="55%" stop-color="#ede9dc"/><stop offset="100%" stop-color="#dfe6dc"/></linearGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0.8"><stop offset="0%" stop-color="#fffdf6" stop-opacity="0.72"/><stop offset="100%" stop-color="#fffdf6" stop-opacity="0"/></linearGradient>
    <linearGradient id="coat" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="#f9f6ee"/><stop offset="100%" stop-color="#d8d1c2"/></linearGradient>
    <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4e5d52"/><stop offset="100%" stop-color="#2d3b32"/></linearGradient>
    <radialGradient id="skin" cx="35%" cy="35%" r="70%"><stop offset="0%" stop-color="#efd4bc"/><stop offset="100%" stop-color="#cfa98b"/></radialGradient>`,
    `<rect width="500" height="350" fill="url(#bg)"/>
    <rect x="0" y="0" width="128" height="350" fill="#d5dfd3" opacity="0.55"/>
    <rect x="20" y="24" width="92" height="218" rx="4" fill="#fffdf8" stroke="#c7b89c" stroke-width="2.5"/>
    <path d="M66 24v218M20 96h92M20 168h92" stroke="#c7b89c" stroke-width="2"/>
    <polygon points="112,28 360,118 360,350 112,242" fill="url(#beam)"/>
    <rect x="128" y="264" width="372" height="86" fill="#e5decb" opacity="0.55"/>
    <path d="M398 274c-4-44 6-82 24-114m-18 68c-22-4-34-16-24-28 11-10 26 2 24 28m6-26c22-8 34-24 22-34-12-8-24 10-22 34m-10 46c20-2 32-12 24-24-8-10-22 4-24 24" stroke="#62806a" stroke-width="2.2" fill="#89a890" fill-opacity="0.32" stroke-linecap="round"/>
    <rect x="382" y="252" width="34" height="54" rx="10" fill="#ffffff" fill-opacity="0.55" stroke="#9eb3a2" stroke-width="1.5"/>
    <ellipse cx="222" cy="336" rx="106" ry="18" fill="#3a4c40" opacity="0.1"/>
    <path d="M138 350c4-68 38-104 88-104s84 36 88 104Z" fill="url(#coat)" stroke="#c7bfb0" stroke-width="1.4"/>
    <path d="M210 218c-2 22-8 34-16 42l32 14 26-16c-8-10-12-22-12-40Z" fill="url(#skin)"/>
    <path d="M204 248l22 26 24-24" fill="none" stroke="#c7bfb0" stroke-width="2"/>
    <ellipse cx="226" cy="170" rx="40" ry="48" fill="url(#skin)"/>
    <path d="M185 168c-6-52 24-76 56-68 28 7 42 32 34 74-6-22-14-36-28-40-18-5-36 4-46 18-4 6-8 14-10 28-4-4-5-8-6-12Z" fill="url(#hair)"/>
    <circle cx="192" cy="176" r="14" fill="url(#hair)"/>
    <path d="M174 282h20m-14 0v68" stroke="#b69d7c" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
    <line x1="322" y1="68" x2="454" y2="68" stroke="#6d8272" stroke-opacity="0.18" stroke-dasharray="4 6"/>`
  ),

  // 2. 蓝调时刻的侧影：靛蓝暮色天台、远处暖色窗灯散景、金色边缘轮廓光侧影
  'blue-hour': () => wrapSvg(
    '蓝调时刻的侧影',
    `<linearGradient id="sky" x1="0" y1="0" x2="0.2" y2="1"><stop offset="0%" stop-color="#17273b"/><stop offset="55%" stop-color="#28425e"/><stop offset="100%" stop-color="#53687e"/></linearGradient>
    <radialGradient id="duskGlow" cx="76%" cy="54%" r="48%"><stop offset="0%" stop-color="#f2b86d" stop-opacity="0.42"/><stop offset="55%" stop-color="#d69156" stop-opacity="0.12"/><stop offset="100%" stop-color="#28425e" stop-opacity="0"/></radialGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffd89e"/><stop offset="100%" stop-color="#e39a54" stop-opacity="0.3"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#sky)"/>
    <rect width="500" height="350" fill="url(#duskGlow)"/>
    <path d="M0 248h52v-32h34v18h40v-44h48v58h178v-28h46v-36h44v24h58v142H0Z" fill="#1a293a" opacity="0.65"/>
    <circle cx="88" cy="204" r="12" fill="#f7c87e" opacity="0.22"/><circle cx="88" cy="204" r="3.5" fill="#ffe1a8" opacity="0.85"/>
    <circle cx="144" cy="218" r="9" fill="#f7c87e" opacity="0.2"/><circle cx="144" cy="218" r="2.5" fill="#ffe1a8" opacity="0.8"/>
    <circle cx="386" cy="192" r="15" fill="#f7c87e" opacity="0.25"/><circle cx="386" cy="192" r="4" fill="#ffe4b5" opacity="0.9"/>
    <circle cx="430" cy="216" r="11" fill="#f7c87e" opacity="0.22"/><circle cx="430" cy="216" r="3" fill="#ffe1a8" opacity="0.85"/>
    <circle cx="458" cy="176" r="8" fill="#8bc2eb" opacity="0.24"/>
    <line x1="0" y1="286" x2="500" y2="286" stroke="#85a2bd" stroke-opacity="0.32" stroke-width="2"/>
    <path d="M168 350c6-64 34-106 86-114 48-7 86 24 94 114Z" fill="#121c29"/>
    <path d="M236 112c30 0 48 22 48 48 0 11-2 17 6 24 4 3 1 8-4 9-1 9-1 14-5 19-6 7-15 8-22 10v24h-40v-32c-20-12-30-32-28-56 2-28 20-46 45-46Z" fill="#14202e"/>
    <path d="M242 112c27 2 43 22 42 47 0 10-2 17 6 24 4 3 1 8-4 9-1 9-2 14-6 19-5 6-12 7-18 9" stroke="url(#rim)" stroke-width="3" stroke-linecap="round"/>
    <path d="M274 234c38 8 64 42 72 116" stroke="#f5c685" stroke-opacity="0.55" stroke-width="2.5" stroke-linecap="round"/>`
  ),

  // 3. 留白的杂志肖像：暖灰编辑棚拍、大幅留白、左侧优雅三分之二剪影与杂志裁切参考线
  'studio-portrait': () => wrapSvg(
    '留白的杂志肖像',
    `<linearGradient id="studio" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#efeae2"/><stop offset="60%" stop-color="#e4ddd2"/><stop offset="100%" stop-color="#d8d0c3"/></linearGradient>
    <radialGradient id="softbox" cx="28%" cy="32%" r="60%"><stop offset="0%" stop-color="#fffdf9" stop-opacity="0.72"/><stop offset="100%" stop-color="#fffdf9" stop-opacity="0"/></radialGradient>
    <linearGradient id="blazer" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#5d5349"/><stop offset="100%" stop-color="#3c352f"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#studio)"/>
    <rect width="500" height="350" fill="url(#softbox)"/>
    <path d="M28 28h16M28 28v16M472 28h-16M472 28v16M28 322h16M28 322v-16M472 322h-16M472 322v-16" stroke="#8a7e70" stroke-opacity="0.45" stroke-width="1.2"/>
    <line x1="296" y1="44" x2="296" y2="306" stroke="#8a7e70" stroke-opacity="0.18" stroke-dasharray="3 5"/>
    <path d="M98 350l14-122c6-34 32-52 64-52s58 18 64 52l14 122Z" fill="url(#blazer)"/>
    <path d="M150 178l26 62 26-62" fill="#f7f2ea"/>
    <path d="M158 156h36v26c0 12-36 12-36 0Z" fill="#dfbe9f"/>
    <ellipse cx="176" cy="126" rx="31" ry="39" fill="#e6c8ac"/>
    <path d="M144 122c0-36 18-52 38-50 22 2 32 22 28 54-8-22-22-28-44-24-12 2-18 10-22 20Z" fill="#3a332d"/>
    <rect x="330" y="96" width="112" height="5" rx="2.5" fill="#7d7265" opacity="0.35"/>
    <rect x="330" y="114" width="84" height="4" rx="2" fill="#7d7265" opacity="0.22"/>
    <rect x="330" y="236" width="104" height="3" rx="1.5" fill="#7d7265" opacity="0.22"/>
    <rect x="330" y="248" width="74" height="3" rx="1.5" fill="#7d7265" opacity="0.16"/>
    <circle cx="342" cy="278" r="7" fill="#5d5349" opacity="0.75"/>
    <circle cx="362" cy="278" r="7" fill="#e6c8ac"/>
    <circle cx="382" cy="278" r="7" fill="#f7f2ea" stroke="#c6bdb0"/>`
  ),

  // 4. 一张黑白人物照：暗房银盐质感、伦勃朗侧光半面明暗层次与极简细框
  'monochrome': () => wrapSvg(
    '一张黑白人物照',
    `<linearGradient id="bwBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2e3133"/><stop offset="55%" stop-color="#45494c"/><stop offset="100%" stop-color="#1e2022"/></linearGradient>
    <linearGradient id="keyLight" x1="0" y1="0.2" x2="1" y2="0.8"><stop offset="0%" stop-color="#f2f3f2"/><stop offset="48%" stop-color="#b5b9bc"/><stop offset="56%" stop-color="#585c60"/><stop offset="100%" stop-color="#2a2d30"/></linearGradient>
    <radialGradient id="halo" cx="34%" cy="38%" r="55%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.24"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient>`,
    `<rect width="500" height="350" fill="url(#bwBg)"/>
    <rect width="500" height="350" fill="url(#halo)"/>
    <rect x="24" y="20" width="452" height="310" rx="2" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1.2"/>
    <path d="M138 330c8-64 46-96 112-96s104 32 112 96Z" fill="#181a1c"/>
    <path d="M138 330c8-64 46-96 112-96v96Z" fill="#2c3033"/>
    <rect x="226" y="198" width="48" height="44" rx="14" fill="url(#keyLight)"/>
    <ellipse cx="250" cy="144" rx="50" ry="62" fill="url(#keyLight)"/>
    <path d="M198 142c-2-50 22-72 56-68 30 4 48 26 44 68-8-26-22-36-46-36-26 0-42 12-54 36Z" fill="#1a1c1e"/>
    <path d="M250 82c26 2 48 28 48 62 0 34-20 62-48 62Z" fill="#121416" opacity="0.34"/>
    <line x1="68" y1="296" x2="142" y2="296" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1"/>
    <circle cx="424" cy="54" r="14" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1"/>`
  ),

  // 5. 琥珀瓶的光：温润洞石台面、亚麻布、半透明琥珀玻璃瓶与金色焦散光影
  'amber-bottle': () => wrapSvg(
    '琥珀瓶的光',
    `<linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f5efe4"/><stop offset="100%" stop-color="#e4d9c8"/></linearGradient>
    <linearGradient id="stone" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0%" stop-color="#dfd3bf"/><stop offset="100%" stop-color="#c9ba9f"/></linearGradient>
    <linearGradient id="amber" x1="0" y1="0" x2="1" y2="0.9"><stop offset="0%" stop-color="#e8a454"/><stop offset="45%" stop-color="#b96723"/><stop offset="100%" stop-color="#6b3410"/></linearGradient>
    <linearGradient id="caustic" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#eb9e42" stop-opacity="0.48"/><stop offset="100%" stop-color="#eb9e42" stop-opacity="0"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#wall)"/>
    <polygon points="0,236 500,214 500,350 0,350" fill="url(#stone)"/>
    <path d="M32 288c42-22 108-26 168-10 20 5 30 22 18 34-54 16-132 16-196-2Z" fill="#f3ecdf" stroke="#d1c4ad" stroke-width="1.2"/>
    <path d="M52 294c48-14 106-16 146-4" stroke="#d8cbb4" stroke-width="1.4" fill="none"/>
    <ellipse cx="216" cy="278" rx="108" ry="18" fill="url(#caustic)"/>
    <ellipse cx="308" cy="278" rx="64" ry="13" fill="#4f2d14" opacity="0.22"/>
    <rect x="282" y="72" width="54" height="32" rx="5" fill="#2d231c"/>
    <rect x="288" y="102" width="42" height="16" fill="#7c4218"/>
    <path d="M262 146c0-18 14-30 26-30h42c12 0 26 12 26 30v120c0 12-10 20-22 20h-50c-12 0-22-8-22-20Z" fill="url(#amber)" stroke="#5b2c0d" stroke-opacity="0.35"/>
    <rect x="275" y="142" width="12" height="122" rx="6" fill="#fff7e6" opacity="0.38"/>
    <rect x="336" y="152" width="6" height="96" rx="3" fill="#ffcf87" opacity="0.28"/>
    <rect x="274" y="172" width="70" height="58" rx="3" fill="#f6efe2" opacity="0.24" stroke="#fff4de" stroke-opacity="0.35"/>`
  ),

  // 6. 一杯茶的静物：青瓷釉面茶杯、温润木桌、散落茶叶与袅袅热气
  'tea-table': () => wrapSvg(
    '一杯茶的静物',
    `<linearGradient id="teaWall" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f3f4ee"/><stop offset="100%" stop-color="#dfe6de"/></linearGradient>
    <linearGradient id="oak" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0%" stop-color="#dfc7a8"/><stop offset="100%" stop-color="#c3a480"/></linearGradient>
    <linearGradient id="celadon" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#9cc0b0"/><stop offset="55%" stop-color="#628a79"/><stop offset="100%" stop-color="#3c5d4f"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#teaWall)"/>
    <polygon points="0,236 500,224 500,350 0,350" fill="url(#oak)"/>
    <line x1="0" y1="264" x2="500" y2="256" stroke="#b2916c" stroke-opacity="0.28" stroke-width="1.4"/>
    <ellipse cx="250" cy="276" rx="112" ry="20" fill="#3a4c42" opacity="0.16"/>
    <ellipse cx="246" cy="264" rx="92" ry="18" fill="#d4e2d9" stroke="#8aa899" stroke-width="1.2"/>
    <path d="M174 166h142v58c0 52-142 52-142 0Z" fill="url(#celadon)"/>
    <path d="M316 178c48-6 46 62-2 52" stroke="#537969" stroke-width="13" stroke-linecap="round"/>
    <path d="M318 179c40-4 38 52-2 46" stroke="#8bb09f" stroke-width="3" stroke-linecap="round" opacity="0.55"/>
    <ellipse cx="245" cy="166" rx="71" ry="16" fill="#bfd7cb"/>
    <ellipse cx="245" cy="167" rx="58" ry="11" fill="#c9a55e"/>
    <path d="M194 188c0 28 8 46 18 56" stroke="#eef7f2" stroke-width="5" stroke-linecap="round" opacity="0.34"/>
    <path d="M224 134c-12-22 18-26 4-50M252 128c-10-20 18-28 6-52M276 138c-8-18 14-20 4-40" stroke="#759484" stroke-width="2.2" stroke-linecap="round" opacity="0.42"/>
    <ellipse cx="122" cy="284" rx="10" ry="4" transform="rotate(-18 122 284)" fill="#466556"/>
    <ellipse cx="144" cy="294" rx="7" ry="3" transform="rotate(24 144 294)" fill="#587b69"/>
    <ellipse cx="366" cy="282" rx="9" ry="3.5" transform="rotate(-26 366 282)" fill="#466556"/>`
  ),

  // 7. 耳机的结构练习：3/4 视角哑光深蓝耳机、几何展示台、金属接缝与暖橙点缀
  'headphones': () => wrapSvg(
    '耳机的结构练习',
    `<linearGradient id="techBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#edf2f6"/><stop offset="100%" stop-color="#d5e0e9"/></linearGradient>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#354f69"/><stop offset="100%" stop-color="#1e3144"/></linearGradient>
    <linearGradient id="plinth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#dce4ec"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#techBg)"/>
    <polygon points="104,264 396,264 432,318 68,318" fill="url(#plinth)" stroke="#c5d2de"/>
    <rect x="68" y="318" width="364" height="32" fill="#cbd7e2"/>
    <ellipse cx="250" cy="282" rx="116" ry="16" fill="#1e3144" opacity="0.16"/>
    <path d="M168 188v-28c0-52 38-92 84-92s84 40 84 92v28" stroke="url(#band)" stroke-width="24" stroke-linecap="round"/>
    <path d="M174 166c0-48 34-84 78-84s78 36 78 84" stroke="#6e8ba6" stroke-width="3" opacity="0.45"/>
    <line x1="168" y1="184" x2="168" y2="206" stroke="#9ab0c4" stroke-width="6" stroke-linecap="round"/>
    <line x1="336" y1="184" x2="336" y2="206" stroke="#9ab0c4" stroke-width="6" stroke-linecap="round"/>
    <rect x="142" y="186" width="46" height="88" rx="22" fill="#23374b"/>
    <rect x="176" y="194" width="18" height="72" rx="9" fill="#3a536c"/>
    <rect x="316" y="186" width="46" height="88" rx="22" fill="#23374b"/>
    <rect x="310" y="194" width="18" height="72" rx="9" fill="#3a536c"/>
    <circle cx="160" cy="230" r="11" stroke="#e48b53" stroke-width="3"/>
    <circle cx="344" cy="230" r="11" stroke="#e48b53" stroke-width="3"/>
    <path d="M150 202v52m204-52v52" stroke="#ffffff" stroke-opacity="0.22" stroke-width="3" stroke-linecap="round"/>`
  ),

  // 8. 磨砂瓶与植物影：浅鼠尾草纸底、透明磨砂方瓶与柔和植物叶片投影
  'frosted-flacon': () => wrapSvg(
    '磨砂瓶与植物影',
    `<linearGradient id="sageBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#edf3ec"/><stop offset="100%" stop-color="#d6e3d5"/></linearGradient>
    <linearGradient id="frostGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.88"/><stop offset="50%" stop-color="#eef4ee" stop-opacity="0.62"/><stop offset="100%" stop-color="#c3d3c3" stop-opacity="0.72"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#sageBg)"/>
    <g fill="#4c6b54" opacity="0.14">
      <path d="M460 0c-54 62-96 112-130 184 52-24 98-58 148-114Z"/>
      <ellipse cx="382" cy="86" rx="52" ry="18" transform="rotate(-32 382 86)"/>
      <ellipse cx="426" cy="148" rx="48" ry="16" transform="rotate(-18 426 148)"/>
      <ellipse cx="332" cy="144" rx="44" ry="14" transform="rotate(-46 332 144)"/>
      <ellipse cx="106" cy="240" rx="56" ry="18" transform="rotate(20 106 240)"/>
    </g>
    <rect x="0" y="256" width="500" height="94" fill="#cad9ca" opacity="0.6"/>
    <ellipse cx="250" cy="284" rx="88" ry="14" fill="#3a5440" opacity="0.15"/>
    <rect x="216" y="78" width="68" height="34" rx="4" fill="#eef3ee" stroke="#9eb3a0" stroke-width="1.4"/>
    <rect x="234" y="112" width="32" height="14" fill="#b4c5b5"/>
    <rect x="180" y="126" width="140" height="156" rx="10" fill="url(#frostGlass)" stroke="#ffffff" stroke-width="2"/>
    <rect x="192" y="138" width="116" height="132" rx="6" fill="#dbe6dc" opacity="0.32" stroke="#9ab09c" stroke-opacity="0.35"/>
    <rect x="194" y="144" width="14" height="118" rx="7" fill="#ffffff" opacity="0.65"/>
    <line x1="250" y1="126" x2="250" y2="262" stroke="#8aa18c" stroke-opacity="0.3" stroke-width="1.5"/>`
  ),

  // 9. 人物引言卡的版式：温暖深棕宽幅编辑卡、左 1/3 柔和剪影肖像 + 右 2/3 引言排版留白
  'quote-card': () => wrapSvg(
    '人物引言卡的版式',
    `<linearGradient id="espresso" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3c2f27"/><stop offset="100%" stop-color="#261d17"/></linearGradient>
    <radialGradient id="goldWarm" cx="26%" cy="46%" r="48%"><stop offset="0%" stop-color="#e5c28b" stop-opacity="0.28"/><stop offset="100%" stop-color="#261d17" stop-opacity="0"/></radialGradient>`,
    `<rect width="500" height="350" fill="#efe9df"/>
    <rect x="26" y="34" width="448" height="282" rx="12" fill="url(#espresso)"/>
    <rect x="26" y="34" width="448" height="282" rx="12" fill="url(#goldWarm)"/>
    <rect x="38" y="46" width="424" height="258" rx="8" stroke="#e4c58e" stroke-opacity="0.25" stroke-width="1"/>
    <circle cx="128" cy="144" r="36" fill="#dfb984" opacity="0.9"/>
    <path d="M62 296c8-64 34-94 66-94s58 30 66 94Z" fill="#705845"/>
    <line x1="214" y1="74" x2="214" y2="276" stroke="#e4c58e" stroke-opacity="0.2" stroke-width="1"/>
    <text x="242" y="128" fill="#e4c58e" font-family="Georgia,serif" font-size="60" opacity="0.72">“</text>
    <rect x="246" y="140" width="184" height="8" rx="4" fill="#f5ead6" opacity="0.84"/>
    <rect x="246" y="162" width="164" height="8" rx="4" fill="#f5ead6" opacity="0.74"/>
    <rect x="246" y="184" width="142" height="8" rx="4" fill="#f5ead6" opacity="0.62"/>
    <line x1="246" y1="228" x2="282" y2="228" stroke="#e4c58e" stroke-width="2" opacity="0.8"/>
    <rect x="294" y="224" width="76" height="7" rx="3.5" fill="#e4c58e" opacity="0.58"/>`
  ),

  // 10. 一张植物展览海报：暖白纸纹纵向海报、优雅银杏枝叶与顶部展览排版留白
  'botanical-poster': () => wrapSvg(
    '一张植物展览海报',
    `<linearGradient id="posterPaper" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fbf8f0"/><stop offset="100%" stop-color="#f0eadb"/></linearGradient>
    <linearGradient id="ginkgo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e3c068"/><stop offset="100%" stop-color="#9ca563"/></linearGradient>`,
    `<rect width="500" height="350" fill="#e6e1d5"/>
    <rect x="122" y="18" width="256" height="314" rx="4" fill="url(#posterPaper)" stroke="#d2cab8" stroke-width="1.2"/>
    <rect x="136" y="32" width="228" height="286" stroke="#859066" stroke-opacity="0.25" stroke-width="1"/>
    <rect x="164" y="54" width="112" height="7" rx="3.5" fill="#4e5c45" opacity="0.65"/>
    <rect x="164" y="70" width="72" height="4" rx="2" fill="#4e5c45" opacity="0.34"/>
    <path d="M196 310c14-56 42-104 94-150" stroke="#626e4e" stroke-width="3" stroke-linecap="round"/>
    <path d="M236 226c-38-18-56-48-34-70 22 14 38 36 34 70Z" fill="url(#ginkgo)" opacity="0.92"/>
    <path d="M262 194c-6-42 12-66 42-56-6 26-18 46-42 56Z" fill="#d9b45c" opacity="0.88"/>
    <path d="M286 164c28-26 54-20 52 10-20 12-38 8-52-10Z" fill="#a6ae6a" opacity="0.88"/>
    <path d="M222 256c36-6 58 8 54 34-24 2-44-10-54-34Z" fill="#899862" opacity="0.82"/>
    <circle cx="332" cy="64" r="10" stroke="#c9a552" stroke-width="1.4" opacity="0.6"/>`
  ),

  // 11. 纸张里的音乐节奏：手工拼贴美学、陶土橙黑胶圆盘、墨蓝波浪纸片与层叠阴影
  'music-poster': () => wrapSvg(
    '纸张里的音乐节奏',
    `<linearGradient id="cotton" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f8f2e7"/><stop offset="100%" stop-color="#ebe1cf"/></linearGradient>`,
    `<rect width="500" height="350" fill="#e5dfd2"/>
    <rect x="116" y="18" width="268" height="314" rx="4" fill="url(#cotton)" stroke="#d3c8b6"/>
    <circle cx="256" cy="176" r="78" fill="#c96b45" opacity="0.92"/>
    <circle cx="256" cy="176" r="24" fill="#f7f1e5"/>
    <path d="M148 214c48-56 108-64 166-22 30 22 46 14 62-4l-14 48c-36 24-76 26-126-4-32-20-62-12-90 12Z" fill="#294661" opacity="0.88"/>
    <path d="M168 122c34-18 74-18 112 6 24 16 54 14 82-6" stroke="#294661" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
    <circle cx="192" cy="112" r="16" fill="#e4b862" opacity="0.9"/>
    <rect x="150" y="48" width="96" height="6" rx="3" fill="#294661" opacity="0.65"/>
    <rect x="150" y="294" width="140" height="5" rx="2.5" fill="#294661" opacity="0.45"/>`
  ),

  // 12. 分块的产品信息卡：鼠尾草绿 Bento 8 模块网格 + 居中磨砂保温杯主视觉
  'bento-product': () => wrapSvg(
    '分块的产品信息卡',
    `<linearGradient id="bentoBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f2f6f2"/><stop offset="100%" stop-color="#e3ece5"/></linearGradient>
    <linearGradient id="tumbler" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#5d826e"/><stop offset="50%" stop-color="#7ba08c"/><stop offset="100%" stop-color="#3f604e"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#bentoBg)"/>
    <rect x="28" y="28" width="196" height="294" rx="16" fill="#ffffff" fill-opacity="0.85" stroke="#c8d8cd"/>
    <rect x="92" y="88" width="68" height="18" rx="6" fill="#32483c"/>
    <rect x="82" y="106" width="88" height="162" rx="18" fill="url(#tumbler)"/>
    <rect x="96" y="122" width="12" height="128" rx="6" fill="#ffffff" opacity="0.28"/>
    <rect x="238" y="28" width="110" height="90" rx="14" fill="#ffffff" fill-opacity="0.85" stroke="#c8d8cd"/>
    <circle cx="293" cy="66" r="18" fill="#e6f2eb" stroke="#628a74" stroke-width="2"/>
    <rect x="266" y="96" width="54" height="5" rx="2.5" fill="#88a393" opacity="0.6"/>
    <rect x="362" y="28" width="110" height="90" rx="14" fill="#e8f1eb" stroke="#c8d8cd"/>
    <path d="M386 78c14-24 28-24 42 0s28 24 38-4" stroke="#476e5a" stroke-width="3" stroke-linecap="round"/>
    <rect x="238" y="132" width="110" height="90" rx="14" fill="#f7f2e8" stroke="#dcd3c1"/>
    <circle cx="272" cy="176" r="10" fill="#5d826e"/><circle cx="294" cy="176" r="10" fill="#d9c6a5"/><circle cx="316" cy="176" r="10" fill="#32483c"/>
    <rect x="362" y="132" width="110" height="90" rx="14" fill="#ffffff" fill-opacity="0.85" stroke="#c8d8cd"/>
    <rect x="384" y="160" width="66" height="7" rx="3.5" fill="#4c6f5c" opacity="0.65"/>
    <rect x="384" y="178" width="46" height="5" rx="2.5" fill="#88a393" opacity="0.5"/>
    <rect x="238" y="236" width="234" height="86" rx="14" fill="#ffffff" fill-opacity="0.85" stroke="#c8d8cd"/>
    <rect x="260" y="264" width="112" height="7" rx="3.5" fill="#3c5e4c" opacity="0.72"/>
    <rect x="260" y="282" width="174" height="5" rx="2.5" fill="#88a393" opacity="0.45"/>`
  ),

  // 13. 快打烊的旧书店：暖琥珀台灯照亮木桌旧书、透视书架与冷调暮蓝窗户
  'old-bookshop': () => wrapSvg(
    '快打烊的旧书店',
    `<linearGradient id="shopBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2b211a"/><stop offset="100%" stop-color="#1d1816"/></linearGradient>
    <linearGradient id="twilight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2c4966"/><stop offset="100%" stop-color="#5d7f9c"/></linearGradient>
    <radialGradient id="lampGlow" cx="62%" cy="58%" r="44%"><stop offset="0%" stop-color="#ffd585" stop-opacity="0.68"/><stop offset="55%" stop-color="#e39a46" stop-opacity="0.22"/><stop offset="100%" stop-color="#2b211a" stop-opacity="0"/></radialGradient>`,
    `<rect width="500" height="350" fill="url(#shopBg)"/>
    <rect x="26" y="24" width="172" height="236" rx="3" fill="#3d2c21" stroke="#574030"/>
    <path d="M36 86h152M36 144h152M36 202h152" stroke="#6d5039" stroke-width="5"/>
    ${Array.from({ length: 24 }, (_, n) => `<rect x="${40 + (n % 8) * 18}" y="${42 + Math.floor(n / 8) * 58}" width="${11 + (n % 3) * 2}" height="${36 + (n % 4) * 2}" rx="1.5" fill="${['#8e593c', '#54705d', '#b89464', '#6d5044'][n % 4]}"/>`).join('')}
    <rect x="336" y="28" width="136" height="176" rx="4" fill="url(#twilight)" stroke="#4c382a" stroke-width="5"/>
    <path d="M404 28v176M336 116h136" stroke="#4c382a" stroke-width="4"/>
    <rect width="500" height="350" fill="url(#lampGlow)"/>
    <polygon points="118,268 416,252 464,350 86,350" fill="#6b4a32"/>
    <rect x="164" y="242" width="84" height="16" rx="2" fill="#8b4f3a"/>
    <rect x="174" y="228" width="70" height="14" rx="2" fill="#d9c6a3"/>
    <path d="M306 254v-68" stroke="#c89e5c" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="306" cy="256" rx="24" ry="7" fill="#a87f42"/>
    <path d="M268 188h76l-16-36h-44Z" fill="#e6b868" stroke="#9e7437" stroke-width="2"/>`
  ),

  // 14. 湖边的安静小屋：雾蓝清晨远山、如镜湖面、右侧低矮暖光木屋与水面倒影
  'lakeside-cabin': () => wrapSvg(
    '湖边的安静小屋',
    `<linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c9dae4"/><stop offset="55%" stop-color="#e4ecea"/><stop offset="100%" stop-color="#f2e9dc"/></linearGradient>
    <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9cb5c2"/><stop offset="100%" stop-color="#6e8d9c"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#dawnSky)"/>
    <path d="M0 184l86-68 74 58 98-86 94 74 82-46 66 52v60H0Z" fill="#9fb5bf" opacity="0.55"/>
    <path d="M0 202l116-54 88 46 112-62 96 52 88-34v76H0Z" fill="#6c8982" opacity="0.72"/>
    <rect x="0" y="220" width="500" height="130" fill="url(#lake)"/>
    <rect x="0" y="212" width="500" height="18" fill="#f4f2eb" opacity="0.42"/>
    <polygon points="292,168 370,118 448,168" fill="#3a4c47"/>
    <rect x="308" y="166" width="124" height="58" fill="#8b694e"/>
    <rect x="348" y="182" width="44" height="30" rx="2" fill="#f7d38c"/>
    <line x1="370" y1="182" x2="370" y2="212" stroke="#6c4e38" stroke-width="2"/>
    <g opacity="0.28">
      <rect x="308" y="232" width="124" height="38" fill="#5e4735"/>
      <rect x="350" y="236" width="40" height="24" fill="#f7d38c"/>
      <line x1="64" y1="262" x2="210" y2="262" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="112" y1="286" x2="286" y2="286" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
    </g>`
  ),

  // 15. 雨后街角的倒影：深靛蓝雨夜、暖黄咖啡窗光、微湿路面纵向倒影与斜细雨丝
  'rainy-street': () => wrapSvg(
    '雨后街角的倒影',
    `<linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#162232"/><stop offset="100%" stop-color="#2c4157"/></linearGradient>
    <linearGradient id="wetRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#263442"/><stop offset="100%" stop-color="#151e28"/></linearGradient>
    <linearGradient id="winRef" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f5c06b" stop-opacity="0.65"/><stop offset="100%" stop-color="#f5c06b" stop-opacity="0"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#nightSky)"/>
    <polygon points="0,248 214,202 288,202 500,248 500,350 0,350" fill="url(#wetRoad)"/>
    <rect x="18" y="40" width="152" height="208" fill="#1b2633"/>
    <rect x="322" y="26" width="162" height="222" fill="#202b38"/>
    <rect x="48" y="102" width="58" height="84" rx="3" fill="#f2ba66"/>
    <rect x="352" y="88" width="84" height="104" rx="3" fill="#e9a954"/>
    <rect x="352" y="88" width="84" height="104" rx="3" stroke="#362720" stroke-width="3"/>
    <path d="M394 88v104M352 140h84" stroke="#362720" stroke-width="3"/>
    <rect x="48" y="254" width="58" height="86" fill="url(#winRef)"/>
    <rect x="352" y="254" width="84" height="92" fill="url(#winRef)"/>
    <line x1="250" y1="208" x2="250" y2="350" stroke="#7d95aa" stroke-opacity="0.28" stroke-dasharray="10 12" stroke-width="2"/>
    ${Array.from({ length: 18 }, (_, n) => `<line x1="${24 + n * 28}" y1="${(n % 3) * 18}" x2="${6 + n * 28}" y2="${180 + (n % 4) * 32}" stroke="#b8cfe0" stroke-opacity="0.18" stroke-width="1"/>`).join('')}`
  ),

  // 16. 午后的庭院一角：浅灰砖墙、暖木门、陶土绿植盆栽与午后斜阳树影
  'quiet-courtyard': () => wrapSvg(
    '午后的庭院一角',
    `<linearGradient id="plaster" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f2efe8"/><stop offset="100%" stop-color="#ddd8cc"/></linearGradient>
    <linearGradient id="woodDoor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b88e65"/><stop offset="100%" stop-color="#8b6340"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#plaster)"/>
    <polygon points="0,276 500,264 500,350 0,350" fill="#cfc9bc"/>
    <rect x="64" y="38" width="178" height="242" rx="4" fill="#68523d"/>
    <rect x="78" y="50" width="150" height="230" fill="url(#woodDoor)"/>
    <path d="M115 50v230M153 50v230M191 50v230" stroke="#724f31" stroke-opacity="0.32" stroke-width="2"/>
    <circle cx="206" cy="170" r="5.5" fill="#463222"/>
    <polygon points="242,40 480,140 480,268 242,276" fill="#fffaf0" opacity="0.28"/>
    <ellipse cx="364" cy="296" rx="58" ry="12" fill="#4a463d" opacity="0.18"/>
    <polygon points="326,232 402,232 390,294 338,294" fill="#c27c57"/>
    <rect x="320" y="224" width="88" height="12" rx="4" fill="#d08a64"/>
    <path d="M364 224V112" stroke="#48664e" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="332" cy="166" rx="34" ry="16" transform="rotate(-28 332 166)" fill="#5c8264"/>
    <ellipse cx="398" cy="154" rx="36" ry="16" transform="rotate(24 398 154)" fill="#6d9474"/>
    <ellipse cx="340" cy="122" rx="28" ry="13" transform="rotate(-18 340 122)" fill="#7da482"/>
    <ellipse cx="388" cy="192" rx="30" ry="14" transform="rotate(14 388 192)" fill="#4d7055"/>`
  ),

  // 17. 窗台上的水彩小猫：透明水彩晕染、暖橘白胸小猫、阳光窗台与小薄荷盆栽
  'watercolor-cat': () => wrapSvg(
    '窗台上的水彩小猫',
    `<linearGradient id="wcPaper" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fdfaf3"/><stop offset="100%" stop-color="#f2ece0"/></linearGradient>
    <radialGradient id="wcMint" cx="25%" cy="35%" r="55%"><stop offset="0%" stop-color="#b8dcc8" stop-opacity="0.52"/><stop offset="100%" stop-color="#b8dcc8" stop-opacity="0"/></radialGradient>
    <radialGradient id="wcOrange" cx="62%" cy="62%" r="42%"><stop offset="0%" stop-color="#f2b278" stop-opacity="0.45"/><stop offset="100%" stop-color="#f2b278" stop-opacity="0"/></radialGradient>`,
    `<rect width="500" height="350" fill="url(#wcPaper)"/>
    <rect width="500" height="350" fill="url(#wcMint)"/>
    <rect width="500" height="350" fill="url(#wcOrange)"/>
    <rect x="44" y="28" width="210" height="224" rx="6" fill="#e2efe8" fill-opacity="0.65" stroke="#a6baa9" stroke-width="2"/>
    <path d="M149 28v224M44 140h210" stroke="#a6baa9" stroke-width="2" opacity="0.6"/>
    <rect x="28" y="252" width="444" height="22" rx="6" fill="#e3d3bc" opacity="0.85"/>
    <polygon points="84,218 134,218 126,254 92,254" fill="#d18b62" opacity="0.85"/>
    <circle cx="96" cy="204" r="14" fill="#7cae88" opacity="0.72"/>
    <circle cx="114" cy="196" r="16" fill="#92c29d" opacity="0.78"/>
    <circle cx="126" cy="208" r="12" fill="#6b9d78" opacity="0.72"/>
    <path d="M242 252c-16-48 8-96 58-92 48 4 64 50 42 92Z" fill="#e69e62" opacity="0.86"/>
    <ellipse cx="288" cy="222" rx="22" ry="28" fill="#fffaf2" opacity="0.92"/>
    <path d="M254 148l6-38 26 22h28l26-22 6 38c6 44-96 44-92 0Z" fill="#e9a56b" opacity="0.92"/>
    <path d="M332 246c36 10 56-16 42-38" stroke="#e39758" stroke-width="14" stroke-linecap="round" opacity="0.85"/>
    <path d="M276 154c4-3 8-3 12 0M310 154c4-3 8-3 12 0" stroke="#5c4230" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="299" cy="166" r="3" fill="#c9725b"/>`
  ),

  // 18. 黏土质感的小狐狸：定格手作陶土小狐狸、苔藓圆形底座与两朵小蘑菇
  'clay-fox': () => wrapSvg(
    '黏土质感的小狐狸',
    `<linearGradient id="clayBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#edf4ec"/><stop offset="100%" stop-color="#d7e6d7"/></linearGradient>
    <radialGradient id="foxCoat" cx="38%" cy="30%" r="72%"><stop offset="0%" stop-color="#ec9662"/><stop offset="100%" stop-color="#c46235"/></radialGradient>`,
    `<rect width="500" height="350" fill="url(#clayBg)"/>
    <ellipse cx="250" cy="288" rx="146" ry="30" fill="#6f9673"/>
    <ellipse cx="250" cy="282" rx="138" ry="24" fill="#88af89"/>
    <path d="M188 264c-54 10-76-40-50-68 18-18 44 10 58 34Z" fill="url(#foxCoat)"/>
    <path d="M142 204c-12 10-12 28 2 34 12-10 10-26-2-34Z" fill="#fbf5ea"/>
    <ellipse cx="254" cy="236" rx="46" ry="48" fill="url(#foxCoat)"/>
    <ellipse cx="254" cy="244" rx="22" ry="32" fill="#fbf5ea"/>
    <path d="M206 164l8-56 36 28h20l36-28 8 56c0 44-108 44-108 0Z" fill="url(#foxCoat)"/>
    <path d="M214 168l40 28 40-28c-12 24-26 32-40 32s-28-8-40-32Z" fill="#fbf5ea"/>
    <circle cx="236" cy="162" r="4.5" fill="#2d241f"/><circle cx="272" cy="162" r="4.5" fill="#2d241f"/>
    <circle cx="254" cy="176" r="5" fill="#2d241f"/>
    <rect x="336" y="254" width="12" height="24" rx="5" fill="#f7efe0"/>
    <path d="M322 258c0-18 40-18 40 0Z" fill="#d97558"/>
    <rect x="364" y="264" width="9" height="16" rx="4" fill="#f7efe0"/>
    <path d="M354 266c0-12 28-12 28 0Z" fill="#e39c68"/>`
  ),

  // 19. 层层纸片里的山：五层立体剪纸山峦、柔和纸层投影与蜿蜒河流
  'paper-mountains': () => wrapSvg(
    '层层纸片里的山',
    `<linearGradient id="paperSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f7f2e7"/><stop offset="100%" stop-color="#e9e2d2"/></linearGradient>
    <filter id="paperDrop" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="-4" stdDeviation="4" flood-color="#2a433e" flood-opacity="0.16"/></filter>`,
    `<rect width="500" height="350" fill="url(#paperSky)"/>
    <circle cx="372" cy="84" r="28" fill="#f0d59b" opacity="0.85"/>
    <path d="M0 172l88-62 92 54 114-78 96 68 110-58v254H0Z" fill="#c7d8d5" filter="url(#paperDrop)"/>
    <path d="M0 214l112-66 84 62 108-72 104 68 92-48v192H0Z" fill="#95b5b2" filter="url(#paperDrop)"/>
    <path d="M0 258l128-64 88 54 96-56 102 58 86-38v138H0Z" fill="#5e8783" filter="url(#paperDrop)"/>
    <path d="M0 296l150-46 96 42 114-44 140 42v60H0Z" fill="#3a5e5a" filter="url(#paperDrop)"/>
    <path d="M236 350c14-34 52-50 42-78-8-22-36-26-26-48 8-18 32-24 24-40 16 14 2 30-6 44-8 16 24 22 30 44 8 28-24 48-32 78Z" fill="#f5efe2"/>`
  ),

  // 20. 等距视角的小书桌：温暖等距插画、浅木桌面、打开的笔记本、台灯与绿植盆栽
  'isometric-desk': () => wrapSvg(
    '等距视角的小书桌',
    `<linearGradient id="isoBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f7f4ec"/><stop offset="100%" stop-color="#e8ece6"/></linearGradient>`,
    `<rect width="500" height="350" fill="url(#isoBg)"/>
    <polygon points="88,202 262,110 420,196 246,288" fill="#e5c59c" stroke="#c7a278" stroke-width="1.5"/>
    <polygon points="88,202 246,288 246,304 88,218" fill="#c9a276"/>
    <polygon points="246,288 420,196 420,212 246,304" fill="#ae865b"/>
    <line x1="112" y1="230" x2="112" y2="324" stroke="#8f6b46" stroke-width="10" stroke-linecap="round"/>
    <line x1="246" y1="302" x2="246" y2="342" stroke="#785838" stroke-width="10" stroke-linecap="round"/>
    <line x1="396" y1="224" x2="396" y2="318" stroke="#785838" stroke-width="10" stroke-linecap="round"/>
    <polygon points="184,186 254,148 318,184 248,222" fill="#fcfaf4" stroke="#d5cfc2"/>
    <line x1="219" y1="167" x2="283" y2="203" stroke="#d5cfc2" stroke-width="1.5"/>
    <path d="M206 184l34-18m-20 26l34-18" stroke="#9aa89d" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="294" cy="144" rx="18" ry="10" fill="#4e6e5c"/>
    <path d="M294 142v-48l-16-14" stroke="#4e6e5c" stroke-width="4" stroke-linecap="round"/>
    <polygon points="256,96 296,76 310,104 270,124" fill="#d9895b"/>
    <polygon points="348,176 376,162 396,174 368,188" fill="#c87953"/>
    <circle cx="368" cy="158" r="14" fill="#6d9979"/><circle cx="382" cy="150" r="12" fill="#88b594"/>
    <ellipse cx="164" cy="212" rx="13" ry="8" fill="#f7f4ec" stroke="#b9c6bc" stroke-width="1.5"/>`
  ),
};

await fs.mkdir(new URL('public/assets/images/inspiration/', root), { recursive: true });
for (const item of window.IMAGE_INSPIRATION) {
  const build = SCENES[item.id];
  if (!build) throw new Error('Missing custom scene for ' + item.id);
  await fs.writeFile(new URL(`public/assets/images/inspiration/${item.id}.svg`, root), build());
}
console.log(`Generated ${window.IMAGE_INSPIRATION.length} bespoke original editorial SVG illustrations.`);
