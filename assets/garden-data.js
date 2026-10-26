// Explicitly reviewed static graph; do not edit generated positions.
window.SITE_GARDEN_GRAPH = {
  "version": 1,
  "sourceHash": "2c5daa31ba408aaa0a63eac7c4ab964aaa0c520ab8657f2487b120450d1803c3",
  "eligible": true,
  "height": 300,
  "nodes": [
    {
      "id": "documentassistant-confirm-before-archive",
      "title": "DocumentAssistant：先给出分类建议，再确认归档",
      "maturity": "seed",
      "citations": 0,
      "x": 150,
      "y": 60,
      "r": 14
    },
    {
      "id": "hello-world",
      "title": "你好，世界。这是小站的第一天。",
      "maturity": "seed",
      "citations": 1,
      "x": 450,
      "y": 60,
      "r": 16
    },
    {
      "id": "how-this-site-grew",
      "title": "这个站是怎么长出来的",
      "maturity": "seed",
      "citations": 2,
      "x": 750,
      "y": 60,
      "r": 18
    },
    {
      "id": "next-steps",
      "title": "给下一次更新，留一张清单",
      "maturity": "seed",
      "citations": 0,
      "x": 150,
      "y": 210,
      "r": 14
    },
    {
      "id": "recallai-local-search",
      "title": "RecallAI：本地检索与收纳的边界",
      "maturity": "seed",
      "citations": 0,
      "x": 450,
      "y": 210,
      "r": 14
    },
    {
      "id": "small-first-version",
      "title": "先做一个小而完整的网站",
      "maturity": "seed",
      "citations": 1,
      "x": 750,
      "y": 210,
      "r": 16
    }
  ],
  "edges": [
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
      "from": "small-first-version",
      "to": "how-this-site-grew"
    }
  ],
  "reviewedAt": "2026-10-26"
};
