# 有间小站 1.8.0 上线完善包

日期：2026-10-28。仓库：ZLongLab/MyWeb。唯一正式发现基准地址：`https://zlonglab.github.io/MyWeb/`。基线为1.7.2／`6974344ce1833c970c3f726b3a6edda215697ff5`。

## 范围与确认

本包只接入发现三件套及刷新GitHub脉搏快照。页面正文、全部原有CSS、CSS／JS／图片相对资源引用保持原样；不修改优化器子站。不增加统计、追踪、远程字体或运行期GitHub请求。没有做手机检测，没有提交sitemap，没有注册Search Console。本次按用户指定的GitHub Pages仓库和地址发布，不扩展到其他托管服务。

站主明确要求先展示草稿摘要并停止等待确认。已展示账号、日期、总数及逐日差异，站主随后回复「批准」。批准前没有运行批准命令，正式快照没有改变。批准后先核对草稿SHA-256仍为`b62a247dac8a0fbb0c4cddf2d3a8d0b6d03229b72f12cee1fe2a6bb351b7d77f`，再执行`npm run snapshot:approve -- --reviewed=2026-10-28`。批准阶段没有重新抓取草稿，也没有手改任何一天的数字。

## 三件套接入

1. 先运行既有生成器：`npm run discovery -- --site-url=https://zlonglab.github.io/MyWeb/`。检查`.tmp/discovery/feed.xml`、`sitemap.xml`、`og-metadata.json`后，运行`node scripts/enable-discovery.mjs`接入。既有生成器未修改。
2. 根目录15个HTML的head加入OG五项与Twitter五项，全部使用正式`/MyWeb/`地址。首页和其他页面类型为website，文章详情为article。图片统一复用玄关已经使用的`assets/images/recallai-preview-960.webp`，元信息中使用绝对URL；没有生成新图片。元标签不触发页面图片请求，页面资源引用不变。
3. 文章列表与文章详情head用相对`feed.xml`加入RSS自动发现。订阅入口放在既有`assets/house.js`生成的页脚链接组，复用原有44px最小点击尺寸、字体和悬停规则，没有新增CSS。
4. 根目录`feed.xml`和`sitemap.xml`直接复制生成器字节，不增删条目。feed为6篇文章；sitemap为23条URL。新增的`robots.txt`只有`User-agent: *`、`Allow: /`与指向正式sitemap的一行，没有Disallow。
5. 文章和作品详情仍是查询参数驱动的静态页面。复用`assets/content.js`里的元信息辅助函数，在已有详情渲染后同步OG／Twitter标题、描述和规范URL；只操作meta，不更改可见内容，也不请求网络。详情URL只保留已验证的文章／作品id，不携带筛选或搜索参数。

## 生成器优先的差异

用户要求产物与细则冲突时以生成器为准。本次保留以下差异，没有擅自重写生成器：

- 11个页面的生成器OG标题或描述与HTML原有title／description不同。例如首页OG为「玄关 · 有间小站」／「先坐一会儿，看看这间小站」，HTML原有title／description未改。完整逐页原文对照在[generator-differences.json](generator-differences.json)，检查过的原始OG数据在[og-metadata.json](og-metadata.json)。因此这11页按生成器校验，而不是声称OG与HTML逐字相同。
- 生成器没有裸`article.html`、裸`project.html`、`404.html`、`video-prompts.html`的OG条目。这4页按原有title和description补齐，不新编文案。文章、作品的12个带id条目沿用生成器对应数据，运行时与原有详情标题／摘要一致。
- sitemap只列11个已有房间入口及12个文章／作品查询地址；不含独立`video-prompts.html`、404或无id的详情壳。本次保留这23条原始结果，没有为扩大收录而添加路径。没有生成干净URL，地址继续使用站内已有的`.html`与查询参数形式。
- 生成器未生成robots，按用户明确要求补充允许抓取与Sitemap指向。
- GitHub Pages不按查询参数提供不同HTML响应。不执行JS的分享抓取器看到的是文章／作品通用壳的静态head；执行JS后的浏览器会得到对应详情的元信息。本包没有引入服务器、预渲染路由或URL迁移，因此不声称所有分享平台都能拿到查询详情的独立预览。

## 白名单与缓存

| 项目 | 1.7.2 | 1.8.0 |
| --- | ---: | ---: |
| 主站本地预览／发布白名单 | 81 | 84 |
| 主站SW预缓存项目 | 80 | 80 |
| 优化器独立静态文件 | 45 | 45 |
| build:pages运行文件合计 | 126 | 129 |
| 加上`.nojekyll`后的构建文件 | 127 | 130 |

`server.mjs`为feed、sitemap、robots提供精确路径和MIME；`scripts/build-pages.mjs`只增加这三个明确文件名的发布许可，不扩大为任意XML／TXT。版本号与SW缓存名称同步为1.8.0。三者都不放进SW缓存：sitemap／robots是面向线上发现的文件，RSS也优先提供最新文章列表；不承担离线阅读库职责，避免缓存清单膨胀。主站SW也没有把优化器加入预缓存。

README当前版本、工作台更新记录及说明书版本史均同步。说明书与工作台继续读取同一份`assets/workbench-data.js`，没有复制第二份版本记录。

## 快照新旧对照

| 字段 | 旧批准快照 | 本次批准快照 |
| --- | --- | --- |
| 账号 | ZLongLab | ZLongLab |
| 起始日期 | 2026-05-03 | 2026-05-03 |
| 截止日期 | 2026-10-26 | 2026-10-28 |
| 覆盖天数／周数 | 177天／26周 | 179天／26周 |
| 总贡献数 | 32 | 53 |
| 人工核对日期 | 2026-10-26 | 2026-10-28 |

增量21次全部来自真实公开草稿：10月26日从1更新为7（+6），新加入10月27日7次、10月28日8次，其余重叠日期的次数不变。原始来源为`https://github.com/users/ZLongLab/contributions?from=2026-05-03&to=2026-10-28`，草稿抓取时间为`2026-10-28T07:56:51.927Z`。这里不推断历史日期变化的原因。

批准脚本生成`assets/site-snapshot.js`及`assets/images/github-activity.svg`。正式github对象与批准草稿逐字段相同，SVG覆盖全部179天。首页显示53次、日期范围及179个日格；工作台在原有核对提示中补充同一范围与总数，没有增加板块。当前日期下`is-stale`为false。基线在10月28日也未超过14天，因此没有把原先正常的状态描述成「原本已过期」；另用11月11日的隔离测试时钟验证旧核对日期触发过期、新核对日期仍在14天内，刷新日期确实能解除对应提醒。

## 验收与边界

- 本机Chrome桌面1440×1000，15页×本机预览／file两种模式，共30次页面回归，349项断言通过。没有手机视口或真机检测。
- 所有15页body源内容与1.7.2完全一致；移除新增元信息块后，原head和相对资源引用一致；所有原CSS文本一致。共同的页头、主容器位置与宽度、一级标题几何及字体／颜色均与基线一致。新增订阅链接、版本记录和已批准的快照数据属于本包明确要求的差异，不声称全页截图像素完全相同。
- 30次回归无脚本错误、无失败本地资源、无新增外部运行请求。元信息图片不自动加载，RSS自动发现与链接不新增运行期请求。另按唯一图片地址实际GET验证200与image类型。
- 校验15页OG／Twitter十项完整、正式基准路径正确，并覆盖两种模式下12个带id详情的元信息。生成器文案例外按上文如实记录。
- 首页与工作台的范围、总数及核对状态与批准草稿一致；生成器原件与已发布根目录、构建目录中的feed／sitemap字节相同。
- `npm run build:pages`通过，产物含129个运行文件及`.nojekyll`；三个新文件在本地预览返回200与正确MIME，SW清单仍为80项。脚本语法与补丁空白检查通过。
- 桌面对照、验收JSON和截图仅保存在本机`.tmp/discovery-1.8-*`，未加入公开发布清单。

线上Actions结果及部署后文件核验见本记录后续「发布结果」。没有用本地检查替代线上发布成功证明。

## 回退

基线提交为`6974344ce1833c970c3f726b3a6edda215697ff5`。需要回退时通过正常Git版本流程恢复该状态并重新构建部署；不覆盖浏览器本地便签、收藏或优化器配置。原批准快照及热力图仍可从基线提交恢复。

## 发布结果

- 运行文件发布提交：`0cd0a3e41e080af12f315c9dacd0449d9dde709d`。
- [GitHub Actions 40654819579](https://github.com/ZLongLab/MyWeb/actions/runs/40654819579)的build和deploy均成功，确认完成后才执行线上复核。
- 正式地址：https://zlonglab.github.io/MyWeb/ 。
- 线上读取时间：`2026-10-28T08:11:48.038Z`。22项线上文件检查全部通过：三件套与批准快照／SVG均为200且内容逐字一致，15页源代码均含正式OG与Twitter元标签，首页源代码含正式分享图片地址，线上SW版本为1.8.0。
- 桌面浏览器另确认首页53次／179格、工作台范围与53次及非过期状态、工作台和说明书版本1.8.0、订阅点击区不小于44px；无脚本错误、无外部运行请求。
- 浏览器XML解析器成功解析sitemap与feed，23个sitemap地址和13个feed链接字段全量符合正式/MyWeb/基准路径。

| 线上文件 | HTTP | SHA-256（与本地原件相同） |
| --- | ---: | --- |
| `feed.xml` | 200 | `eb980cfd7f17c90e5cec697397660131e08f580d9f7c65cab71bfd287b11a332` |
| `assets/site-snapshot.js` | 200 | `476cadc34bb407b402233c698b97249ae89f9731b43ae6047c8f06bbbce94435` |
| `assets/images/github-activity.svg` | 200 | `5a8eecd52e64623e6a1683c5a29042bf3dc0e9a5ccd4dfeda0462cd96b5dc98a` |
| `sitemap.xml` | 200 | `c9ed7b71e5e2032fe9f8692c353705456d65577997f2a9d523712687d06f17f7` |
| `robots.txt` | 200 | `1647fa4533992a38a51962eda4e2057d447fbaec852f332a5e9e984bff6bb992` |

本节是发布后的纯文档补充，提交标记`[skip ci]`以避免对完全相同的运行文件再做一次部署；不改变上述已验收的线上内容。最后复核Git改动仅为此记录，工作区干净。
