// Explicitly reviewed static graph; do not edit generated positions.
window.SITE_GARDEN_GRAPH = {
  "version": 2,
  "sourceHash": "b563898fe1d2b6e3ef85dc10aa99cae503fa98b3d23c653028b8880a4238eca3",
  "eligible": true,
  "height": 650,
  "nodes": [
    {
      "id": "documentassistant-confirm-before-archive",
      "title": "DocumentAssistant：先给出分类建议，再确认归档",
      "label": "DocumentAssistant",
      "maturity": "growing",
      "citations": 1,
      "x": 190,
      "y": 60,
      "r": 11,
      "isolated": false
    },
    {
      "id": "hello-world",
      "title": "你好，世界。这是小站的第一天。",
      "label": "你好，世界",
      "maturity": "seed",
      "citations": 1,
      "x": 705,
      "y": 120,
      "r": 11,
      "isolated": false
    },
    {
      "id": "how-this-site-grew",
      "title": "这个站是怎么长出来的",
      "label": "这个站是怎么长出来的",
      "maturity": "evergreen",
      "citations": 4,
      "x": 430,
      "y": 190,
      "r": 13,
      "isolated": false
    },
    {
      "id": "image-workshop-batch-guide",
      "title": "用图片工坊完成一次批量压缩",
      "label": "批量图片处理",
      "maturity": "growing",
      "citations": 1,
      "x": 190,
      "y": 260,
      "r": 11,
      "isolated": false
    },
    {
      "id": "next-steps",
      "title": "给下一次更新，留一张清单",
      "label": "给下一次更新",
      "maturity": "seed",
      "citations": 0,
      "x": 705,
      "y": 320,
      "r": 10,
      "isolated": false
    },
    {
      "id": "recallai-local-search",
      "title": "RecallAI：本地检索与收纳的边界",
      "label": "RecallAI",
      "maturity": "growing",
      "citations": 1,
      "x": 430,
      "y": 390,
      "r": 11,
      "isolated": false
    },
    {
      "id": "small-first-version",
      "title": "先做一个小而完整的网站",
      "label": "先做小而完整的网站",
      "maturity": "seed",
      "citations": 2,
      "x": 190,
      "y": 460,
      "r": 12,
      "isolated": false
    },
    {
      "id": "video-studio-first-prompt",
      "title": "视频灵感室从一句想法到分镜提示词",
      "label": "视频提示词入门",
      "maturity": "growing",
      "citations": 1,
      "x": 705,
      "y": 520,
      "r": 11,
      "isolated": false
    }
  ],
  "edges": [
    {
      "from": "documentassistant-confirm-before-archive",
      "to": "recallai-local-search"
    },
    {
      "from": "hello-world",
      "to": "how-this-site-grew"
    },
    {
      "from": "how-this-site-grew",
      "to": "hello-world"
    },
    {
      "from": "how-this-site-grew",
      "to": "small-first-version"
    },
    {
      "from": "image-workshop-batch-guide",
      "to": "how-this-site-grew"
    },
    {
      "from": "image-workshop-batch-guide",
      "to": "video-studio-first-prompt"
    },
    {
      "from": "next-steps",
      "to": "how-this-site-grew"
    },
    {
      "from": "next-steps",
      "to": "small-first-version"
    },
    {
      "from": "recallai-local-search",
      "to": "documentassistant-confirm-before-archive"
    },
    {
      "from": "small-first-version",
      "to": "how-this-site-grew"
    },
    {
      "from": "video-studio-first-prompt",
      "to": "image-workshop-batch-guide"
    }
  ],
  "reviewedAt": "2026-11-24",
  "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"garden-canvas\" viewBox=\"0 0 900 650\" role=\"group\" aria-label=\"园子里的路\"><title>园子里的路</title><desc>实线为人工维护的文章引用；虚线只围住暂无引用的记录，不表示它们互相引用。种子为空心点，生长中为半填，常青为实心。</desc><style>.garden-canvas{--garden-ink:#93620a;--garden-label:#302718}.garden-graph-edge{fill:none;stroke:var(--garden-ink);stroke-opacity:.45;stroke-width:1.8}.garden-graph-node{color:var(--garden-ink)}.garden-node-ring{stroke:currentColor;stroke-width:1.8}.garden-node-half,.garden-node-seed{fill:currentColor}.garden-node-label{fill:var(--garden-label);font:15px sans-serif}.garden-hit{fill:transparent;stroke:transparent}.garden-canvas a:focus{outline:none}.garden-canvas a:focus .garden-hit,.garden-canvas a:hover .garden-hit{stroke:var(--garden-ink);stroke-width:2}.garden-waiting-zone ellipse{fill:none;stroke:var(--garden-ink);stroke-opacity:.18;stroke-dasharray:3 6}.garden-waiting-zone text{fill:var(--garden-ink);font:12px sans-serif}</style><path class=\"garden-graph-edge\" data-from=\"documentassistant-confirm-before-archive\" data-to=\"recallai-local-search\" d=\"M190 60Q334.75 207 430 390\" aria-hidden=\"true\"/><path class=\"garden-graph-edge\" data-from=\"hello-world\" data-to=\"how-this-site-grew\" d=\"M705 120Q572.75 175.625 430 190\" aria-hidden=\"true\"/><path class=\"garden-graph-edge\" data-from=\"how-this-site-grew\" data-to=\"hello-world\" d=\"M430 190Q562.25 134.375 705 120\" aria-hidden=\"true\"/><path class=\"garden-graph-edge\" data-from=\"how-this-site-grew\" data-to=\"small-first-version\" d=\"M430 190Q330.25 343 190 460\" aria-hidden=\"true\"/><path class=\"garden-graph-edge\" data-from=\"image-workshop-batch-guide\" data-to=\"how-this-site-grew\" d=\"M190 260Q304.75 207 430 190\" aria-hidden=\"true\"/><path class=\"garden-graph-edge\" data-from=\"image-workshop-batch-guide\" data-to=\"video-studio-first-prompt\" d=\"M190 260Q467 351.375 705 520\" aria-hidden=\"true\"/><path class=\"garden-graph-edge\" data-from=\"next-steps\" data-to=\"how-this-site-grew\" d=\"M705 320Q557.75 275.625 430 190\" aria-hidden=\"true\"/><path class=\"garden-graph-edge\" data-from=\"next-steps\" data-to=\"small-first-version\" d=\"M705 320Q458 428.625 190 460\" aria-hidden=\"true\"/><path class=\"garden-graph-edge\" data-from=\"recallai-local-search\" data-to=\"documentassistant-confirm-before-archive\" d=\"M430 390Q285.25 243 190 60\" aria-hidden=\"true\"/><path class=\"garden-graph-edge\" data-from=\"small-first-version\" data-to=\"how-this-site-grew\" d=\"M190 460Q289.75 307 430 190\" aria-hidden=\"true\"/><path class=\"garden-graph-edge\" data-from=\"video-studio-first-prompt\" data-to=\"image-workshop-batch-guide\" d=\"M705 520Q428 428.625 190 260\" aria-hidden=\"true\"/><a class=\"garden-graph-node\" data-article-id=\"documentassistant-confirm-before-archive\" data-maturity=\"growing\" href=\"../../article.html?id=documentassistant-confirm-before-archive\" tabindex=\"0\" aria-label=\"DocumentAssistant：先给出分类建议，再确认归档\"><title>DocumentAssistant：先给出分类建议，再确认归档</title><rect class=\"garden-hit\" x=\"90\" y=\"30\" width=\"200\" height=\"64\" rx=\"6\"/><circle class=\"garden-node-ring\" cx=\"190\" cy=\"60\" r=\"11\" fill=\"none\"/><path class=\"garden-node-half\" d=\"M190 49a11 11 0 0 1 0 22Z\"/><text class=\"garden-node-label\" x=\"190\" y=\"87\" text-anchor=\"middle\">DocumentAssistant</text></a><a class=\"garden-graph-node\" data-article-id=\"hello-world\" data-maturity=\"seed\" href=\"../../article.html?id=hello-world\" tabindex=\"0\" aria-label=\"你好，世界。这是小站的第一天。\"><title>你好，世界。这是小站的第一天。</title><rect class=\"garden-hit\" x=\"605\" y=\"90\" width=\"200\" height=\"64\" rx=\"6\"/><circle class=\"garden-node-ring\" cx=\"705\" cy=\"120\" r=\"11\" fill=\"none\"/><circle class=\"garden-node-seed\" cx=\"705\" cy=\"120\" r=\"2\"/><text class=\"garden-node-label\" x=\"705\" y=\"147\" text-anchor=\"middle\">你好，世界</text></a><a class=\"garden-graph-node\" data-article-id=\"how-this-site-grew\" data-maturity=\"evergreen\" href=\"../../article.html?id=how-this-site-grew\" tabindex=\"0\" aria-label=\"这个站是怎么长出来的\"><title>这个站是怎么长出来的</title><rect class=\"garden-hit\" x=\"330\" y=\"160\" width=\"200\" height=\"64\" rx=\"6\"/><circle class=\"garden-node-ring\" cx=\"430\" cy=\"190\" r=\"13\" fill=\"currentColor\"/><text class=\"garden-node-label\" x=\"430\" y=\"217\" text-anchor=\"middle\">这个站是怎么长出来的</text></a><a class=\"garden-graph-node\" data-article-id=\"image-workshop-batch-guide\" data-maturity=\"growing\" href=\"../../article.html?id=image-workshop-batch-guide\" tabindex=\"0\" aria-label=\"用图片工坊完成一次批量压缩\"><title>用图片工坊完成一次批量压缩</title><rect class=\"garden-hit\" x=\"90\" y=\"230\" width=\"200\" height=\"64\" rx=\"6\"/><circle class=\"garden-node-ring\" cx=\"190\" cy=\"260\" r=\"11\" fill=\"none\"/><path class=\"garden-node-half\" d=\"M190 249a11 11 0 0 1 0 22Z\"/><text class=\"garden-node-label\" x=\"190\" y=\"287\" text-anchor=\"middle\">批量图片处理</text></a><a class=\"garden-graph-node\" data-article-id=\"next-steps\" data-maturity=\"seed\" href=\"../../article.html?id=next-steps\" tabindex=\"0\" aria-label=\"给下一次更新，留一张清单\"><title>给下一次更新，留一张清单</title><rect class=\"garden-hit\" x=\"605\" y=\"290\" width=\"200\" height=\"64\" rx=\"6\"/><circle class=\"garden-node-ring\" cx=\"705\" cy=\"320\" r=\"10\" fill=\"none\"/><circle class=\"garden-node-seed\" cx=\"705\" cy=\"320\" r=\"2\"/><text class=\"garden-node-label\" x=\"705\" y=\"347\" text-anchor=\"middle\">给下一次更新</text></a><a class=\"garden-graph-node\" data-article-id=\"recallai-local-search\" data-maturity=\"growing\" href=\"../../article.html?id=recallai-local-search\" tabindex=\"0\" aria-label=\"RecallAI：本地检索与收纳的边界\"><title>RecallAI：本地检索与收纳的边界</title><rect class=\"garden-hit\" x=\"330\" y=\"360\" width=\"200\" height=\"64\" rx=\"6\"/><circle class=\"garden-node-ring\" cx=\"430\" cy=\"390\" r=\"11\" fill=\"none\"/><path class=\"garden-node-half\" d=\"M430 379a11 11 0 0 1 0 22Z\"/><text class=\"garden-node-label\" x=\"430\" y=\"417\" text-anchor=\"middle\">RecallAI</text></a><a class=\"garden-graph-node\" data-article-id=\"small-first-version\" data-maturity=\"seed\" href=\"../../article.html?id=small-first-version\" tabindex=\"0\" aria-label=\"先做一个小而完整的网站\"><title>先做一个小而完整的网站</title><rect class=\"garden-hit\" x=\"90\" y=\"430\" width=\"200\" height=\"64\" rx=\"6\"/><circle class=\"garden-node-ring\" cx=\"190\" cy=\"460\" r=\"12\" fill=\"none\"/><circle class=\"garden-node-seed\" cx=\"190\" cy=\"460\" r=\"2\"/><text class=\"garden-node-label\" x=\"190\" y=\"487\" text-anchor=\"middle\">先做小而完整的网站</text></a><a class=\"garden-graph-node\" data-article-id=\"video-studio-first-prompt\" data-maturity=\"growing\" href=\"../../article.html?id=video-studio-first-prompt\" tabindex=\"0\" aria-label=\"视频灵感室从一句想法到分镜提示词\"><title>视频灵感室从一句想法到分镜提示词</title><rect class=\"garden-hit\" x=\"605\" y=\"490\" width=\"200\" height=\"64\" rx=\"6\"/><circle class=\"garden-node-ring\" cx=\"705\" cy=\"520\" r=\"11\" fill=\"none\"/><path class=\"garden-node-half\" d=\"M705 509a11 11 0 0 1 0 22Z\"/><text class=\"garden-node-label\" x=\"705\" y=\"547\" text-anchor=\"middle\">视频提示词入门</text></a></svg>\n"
};
