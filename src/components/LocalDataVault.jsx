import { useRef, useState } from "react";

const VAULT_STORES = [
  {
    key: "myweb_guestbook_v1",
    label: "随手便签",
    href: "guestbook.html",
    describe(data) {
      return Array.isArray(data?.entries) ? `${data.entries.length} 条便签` : "0 条便签";
    },
  },
  {
    key: "myweb_image_inspiration_v1",
    label: "图片灵感室",
    href: "image-prompts.html",
    describe(data) {
      return Array.isArray(data?.favorites) ? `${data.favorites.length} 个收藏` : "0 个收藏";
    },
  },
  {
    key: "myweb_video_prompts_v1",
    label: "视频灵感室",
    href: "video-prompts.html",
    describe(data) {
      const drafts = Array.isArray(data?.drafts) ? data.drafts.length : 0;
      const favs = Array.isArray(data?.favorites) ? data.favorites.length : 0;
      return `${drafts} 份草稿 · ${favs} 个收藏`;
    },
  },
  {
    key: "myweb_focus_lab_v1",
    label: "专注白噪音",
    href: "focus-lab.html",
    describe(data) {
      if (Number.isInteger(data?.sessions) && Number.isInteger(data?.minutes)) {
        return `${data.sessions} 轮 · ${data.minutes} 分钟`;
      }
      return "暂无今日记录";
    },
  },
];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function inspectVault() {
  const rows = [];
  let totalBytes = 0;
  for (const store of VAULT_STORES) {
    let raw = null;
    try {
      raw = window.localStorage.getItem(store.key);
    } catch {
      rows.push({ ...store, status: "unavailable", summary: "无法访问存储", bytes: 0, parsed: null });
      continue;
    }
    if (raw === null) {
      rows.push({ ...store, status: "empty", summary: store.describe(null), bytes: 0, parsed: null });
      continue;
    }
    const bytes = new Blob([raw]).size;
    totalBytes += bytes;
    try {
      const parsed = JSON.parse(raw);
      rows.push({ ...store, status: "ready", summary: store.describe(parsed), bytes, parsed });
    } catch {
      rows.push({ ...store, status: "corrupt", summary: "格式异常（已保护未改动）", bytes, parsed: null });
    }
  }
  return { rows, totalBytes };
}

export default function LocalDataVault() {
  const [snapshot, setSnapshot] = useState(inspectVault);
  const [message, setMessage] = useState("所有工具的数据都留在当前浏览器，可在这里一键打包或恢复。");
  const fileInputRef = useRef(null);

  function refresh() {
    setSnapshot(inspectVault());
  }

  function exportAll() {
    const current = inspectVault();
    setSnapshot(current);
    const stores = {};
    let count = 0;
    for (const row of current.rows) {
      if (row.status === "ready" && row.parsed !== null) {
        stores[row.key] = row.parsed;
        count += 1;
      }
    }
    if (!count) {
      setMessage("当前浏览器还没有可导出的工具记录，先在便签或灵感室保存一条吧。");
      return;
    }
    const payload = {
      app: "myweb-local-vault",
      version: 1,
      exportedAt: new Date().toISOString(),
      stores,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `myweb-local-vault-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setMessage(`已打包导出 ${count} 项本地数据（${formatBytes(blob.size)}）。`);
  }

  async function importAll(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 2_000_000) {
      setMessage("备份文件超过 2 MB，已取消导入。");
      return;
    }
    try {
      const parsed = JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
      if (
        !parsed ||
        parsed.app !== "myweb-local-vault" ||
        parsed.version !== 1 ||
        !parsed.stores ||
        typeof parsed.stores !== "object"
      ) {
        setMessage("备份格式不匹配，请选择本站工作台导出的全站本地备份 JSON。");
        return;
      }
      const allowedKeys = new Set(VAULT_STORES.map((s) => s.key));
      let restored = 0;
      for (const [key, value] of Object.entries(parsed.stores)) {
        if (!allowedKeys.has(key) || !value || typeof value !== "object") continue;
        window.localStorage.setItem(key, JSON.stringify(value));
        restored += 1;
      }
      refresh();
      setMessage(`已恢复 ${restored} 项本地工具数据到当前浏览器。`);
    } catch {
      setMessage("无法读取这份 JSON 文件，现有本地数据未被改动。");
    }
  }

  const readyCount = snapshot.rows.filter((row) => row.status === "ready").length;

  return (
    <section
      className="workbench-section"
      id="vault"
      aria-labelledby="workbench-vault-title"
      tabIndex="-1"
    >
      <div className="workbench-section-heading">
        <p className="workbench-section-index">LOCAL / VAULT</p>
        <h2 id="workbench-vault-title">本地数据保险箱</h2>
        <p>把分散在各小工具里的本地数据收在一起，方便换设备前一键打包带走。</p>
      </div>
      <div className="workbench-section-content">
        <div className="vault-grid">
          {snapshot.rows.map((row) => (
            <a key={row.key} href={row.href} className="vault-card" data-state={row.status}>
              <div className="vault-card-top">
                <strong>{row.label}</strong>
                <span>{formatBytes(row.bytes)}</span>
              </div>
              <p>{row.summary}</p>
            </a>
          ))}
        </div>
        <div className="vault-actions">
          <button
            type="button"
            className="vault-btn-primary"
            id="vault-export-all"
            onClick={exportAll}
          >
            一键备份全部数据 ({readyCount} 项 · {formatBytes(snapshot.totalBytes)})
          </button>
          <button
            type="button"
            className="vault-btn"
            id="vault-import-all"
            onClick={() => fileInputRef.current?.click()}
          >
            导入恢复备份
          </button>
          <button type="button" className="vault-btn" onClick={refresh}>
            刷新状态
          </button>
          <input
            ref={fileInputRef}
            id="vault-import-file"
            type="file"
            accept=".json,application/json"
            className="visually-hidden"
            aria-label="选择全站本地数据备份 JSON"
            onChange={importAll}
          />
        </div>
        <p className="vault-status" id="vault-status" role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </section>
  );
}
