import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/focus-lab.css";

const STORAGE_KEY = "myweb_focus_lab_v1";
const MODES = [
  { id: "focus-25", label: "专注 25 分", minutes: 25, kind: "focus" },
  { id: "focus-45", label: "深度 45 分", minutes: 45, kind: "focus" },
  { id: "break-5", label: "小憩 5 分", minutes: 5, kind: "break" },
  { id: "break-15", label: "长休 15 分", minutes: 15, kind: "break" },
];

const CHANNELS = [
  { id: "rain", label: "窗外细雨", hint: "柔和粉红噪声与细雨高频", icon: "☂" },
  { id: "fire", label: "冬夜壁炉", hint: "低沉暖流与轻微木柴噼啪", icon: "✦" },
  { id: "wind", label: "松林微风", hint: "缓慢起伏的林间呼吸风声", icon: "〰" },
];

const MIX_PRESETS = [
  { label: "雨夜书房", values: { rain: 55, fire: 28, wind: 0 } },
  { label: "松林清晨", values: { rain: 15, fire: 0, wind: 52 } },
  { label: "静谧壁炉", values: { rain: 0, fire: 60, wind: 18 } },
  { label: "全部静音", values: { rain: 0, fire: 0, wind: 0 } },
];

function todayKey() {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function readStats() {
  const key = todayKey();
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (
      parsed &&
      parsed.date === key &&
      Number.isInteger(parsed.sessions) &&
      Number.isInteger(parsed.minutes)
    ) {
      return { date: key, sessions: parsed.sessions, minutes: parsed.minutes };
    }
  } catch {
    /* Storage may be unavailable. */
  }
  return { date: key, sessions: 0, minutes: 0 };
}

function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function createNoiseBuffer(ctx, kind) {
  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  if (kind === "brown") {
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.025 * white) / 1.025;
      const crackle = Math.random() > 0.9994 ? (Math.random() - 0.5) * 0.55 : 0;
      data[i] = Math.max(-1, Math.min(1, last * 3.1 + crackle));
    }
  } else {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.055;
      b6 = white * 0.115926;
    }
  }
  return buffer;
}

function playBowlChime(ctx) {
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  const now = ctx.currentTime + 0.02;
  [528, 1056].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(idx === 0 ? 0.12 : 0.04, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.5);
  });
}

export default function FocusLabPage() {
  const [modeId, setModeId] = useState("focus-25");
  const [customMinutes, setCustomMinutes] = useState("30");
  const [activeMinutes, setActiveMinutes] = useState(25);
  const [activeKind, setActiveKind] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [task, setTask] = useState("");
  const [volumes, setVolumes] = useState({ rain: 0, fire: 0, wind: 0 });
  const [stats, setStats] = useState(readStats);
  const [notice, setNotice] = useState("选好专注时长或调开白噪音，开始安静的一段时间。");

  const audioRef = useRef(null);
  const endTimeRef = useRef(0);
  const completedRef = useRef(false);
  const baseTitleRef = useRef("专注时钟 · 白噪音实验室 · 有间小站");

  const ensureAudio = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.ctx.state === "suspended") {
        audioRef.current.ctx.resume().catch(() => {});
      }
      return audioRef.current;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    const pink = createNoiseBuffer(ctx, "pink");
    const brown = createNoiseBuffer(ctx, "brown");

    const buildChannel = (buffer, setupFilter) => {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      const lastNode = setupFilter(ctx, src);
      lastNode.connect(gain).connect(ctx.destination);
      src.start();
      return gain;
    };

    const rainGain = buildChannel(pink, (c, src) => {
      const filter = c.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1350;
      filter.Q.value = 0.55;
      src.connect(filter);
      return filter;
    });

    const fireGain = buildChannel(brown, (c, src) => {
      const filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 340;
      src.connect(filter);
      return filter;
    });

    const windGain = buildChannel(pink, (c, src) => {
      const filter = c.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 540;
      filter.Q.value = 1.6;
      const lfo = c.createOscillator();
      const lfoGain = c.createGain();
      lfo.frequency.value = 0.11;
      lfoGain.gain.value = 220;
      lfo.connect(lfoGain).connect(filter.frequency);
      lfo.start();
      src.connect(filter);
      return filter;
    });

    audioRef.current = {
      ctx,
      gains: { rain: rainGain, fire: fireGain, wind: windGain },
    };
    return audioRef.current;
  }, []);

  useEffect(() => {
    baseTitleRef.current = document.title;
    return () => {
      document.title = baseTitleRef.current;
      if (audioRef.current) {
        audioRef.current.ctx.close().catch(() => {});
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!running) {
      document.title = baseTitleRef.current;
      return;
    }
    document.title = `${formatClock(secondsLeft)} · ${activeKind === "focus" ? "专注中" : "休息中"} · 有间小站`;
  }, [running, secondsLeft, activeKind]);

  // Timestamp-calibrated countdown so background tabs never drift.
  useEffect(() => {
    if (!running) return;
    completedRef.current = false;

    function syncRemaining() {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0 && !completedRef.current) {
        completedRef.current = true;
        setRunning(false);
        playBowlChime(audioRef.current?.ctx);
        if (activeKind === "focus") {
          setStats((current) => {
            const key = todayKey();
            const base = current.date === key ? current : { date: key, sessions: 0, minutes: 0 };
            const next = {
              date: key,
              sessions: base.sessions + 1,
              minutes: base.minutes + activeMinutes,
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
              /* Local persistence is optional. */
            }
            return next;
          });
          setNotice(`已完成一轮 ${activeMinutes} 分钟专注，喝口水歇一会儿。`);
        } else {
          setNotice("休息结束，准备好开始下一轮专注了。");
        }
      }
    }

    const timer = window.setInterval(syncRemaining, 250);
    const onVisible = () => {
      if (!document.hidden) syncRemaining();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [running, activeKind, activeMinutes]);

  function applyVolumes(nextVolumes) {
    setVolumes(nextVolumes);
    const hasSound = Object.values(nextVolumes).some((v) => v > 0);
    if (!hasSound && !audioRef.current) return;
    const engine = ensureAudio();
    if (!engine) {
      setNotice("当前浏览器不支持 Web Audio 合成音频。");
      return;
    }
    const now = engine.ctx.currentTime;
    for (const key of ["rain", "fire", "wind"]) {
      const target = (nextVolumes[key] / 100) * 0.42;
      engine.gains[key].gain.setTargetAtTime(target, now, 0.08);
    }
  }

  function switchMode(nextId) {
    const picked = MODES.find((item) => item.id === nextId) || MODES[0];
    setModeId(picked.id);
    setActiveMinutes(picked.minutes);
    setActiveKind(picked.kind);
    setRunning(false);
    setSecondsLeft(picked.minutes * 60);
    setNotice(`已切换至「${picked.label}」。`);
  }

  function applyCustomDuration(event) {
    event.preventDefault();
    const parsed = Math.round(Number(customMinutes));
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 120) {
      setNotice("自定义时长请输入 1–120 之间的整数分钟。");
      return;
    }
    setModeId("custom");
    setActiveMinutes(parsed);
    setActiveKind("focus");
    setRunning(false);
    setSecondsLeft(parsed * 60);
    setNotice(`已设定自定义专注时长：${parsed} 分钟。`);
  }

  function toggleTimer() {
    if (running) {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      setRunning(false);
      return;
    }
    // Prepare Web Audio context on user gesture so the end chime can play reliably.
    ensureAudio();
    const baseSeconds = secondsLeft === 0 ? activeMinutes * 60 : secondsLeft;
    if (secondsLeft === 0) setSecondsLeft(baseSeconds);
    endTimeRef.current = Date.now() + baseSeconds * 1000;
    setRunning(true);
  }

  const total = activeMinutes * 60;
  const progress = total > 0 ? (total - secondsLeft) / total : 0;
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const activeSounds = Object.values(volumes).filter((v) => v > 0).length;

  return (
    <main className="container focus-lab" id="main">
      <header className="focus-lab-hero">
        <p className="eyebrow">小实验室 / FOCUS &amp; SOUNDSCAPE LAB</p>
        <h1>
          专注时钟与白噪音<span className="title-period">。</span>
        </h1>
        <p className="room-lead">
          不加载任何外部音频文件，用浏览器 Web Audio 实时合成窗外细雨、壁炉暖流与松林微风；计时按时间戳校准，切后台也不漂移。
        </p>
      </header>

      <div className="focus-lab-grid">
        <section className="focus-timer-card glass-card" aria-label="专注计时器">
          <div className="focus-mode-tabs" role="group" aria-label="专注时长模式">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={modeId === item.id}
                onClick={() => switchMode(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <form className="focus-custom-row" onSubmit={applyCustomDuration}>
            <label htmlFor="focus-custom-minutes">自定义分钟</label>
            <input
              id="focus-custom-minutes"
              type="number"
              min="1"
              max="120"
              value={customMinutes}
              onChange={(event) => setCustomMinutes(event.target.value)}
            />
            <button type="submit">设为专注</button>
          </form>

          <div className="focus-ring-wrap">
            <svg viewBox="0 0 220 220" className="focus-ring-svg" aria-hidden="true">
              <circle cx="110" cy="110" r={radius} className="focus-ring-track" />
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="focus-ring-fill"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
              />
            </svg>
            <div className="focus-clock-readout">
              <span className="focus-clock-state">
                {running ? (activeKind === "focus" ? "专注中" : "休息中") : "已就绪"}
              </span>
              <time className="focus-clock-digits">{formatClock(secondsLeft)}</time>
            </div>
          </div>

          <label className="focus-task-field">
            <span className="visually-hidden">本轮专注目标</span>
            <input
              type="text"
              maxLength={60}
              value={task}
              onChange={(event) => setTask(event.target.value)}
              placeholder="这一轮只专注做一件事…"
            />
          </label>

          <div className="focus-timer-actions">
            <button
              type="button"
              className="button focus-start-btn"
              onClick={toggleTimer}
            >
              {running ? "暂停计时" : secondsLeft === 0 ? "重新开始" : "开始专注"}
            </button>
            <button
              type="button"
              className="button"
              onClick={() => {
                setRunning(false);
                setSecondsLeft(activeMinutes * 60);
                setNotice("计时器已重置。");
              }}
            >
              重置
            </button>
          </div>

          <div className="focus-today-stats">
            <div>
              <span>今日完成</span>
              <strong>{stats.sessions} 轮</strong>
            </div>
            <div>
              <span>累计专注</span>
              <strong>{stats.minutes} 分钟</strong>
            </div>
          </div>

          <p className="focus-notice" role="status" aria-live="polite">
            {notice}
          </p>
        </section>

        <section className="focus-sound-card glass-card" aria-label="环境白噪音混音台">
          <div className="focus-sound-head">
            <div>
              <p className="eyebrow">WEB AUDIO SYNTH</p>
              <h2>环境白噪音混音</h2>
            </div>
            <span className="focus-sound-badge">
              {activeSounds > 0 ? `正在播放 ${activeSounds} 路` : "已静音"}
            </span>
          </div>

          <div className="focus-presets">
            {MIX_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  applyVolumes(preset.values);
                  setNotice(`已切换环境音组合「${preset.label}」。`);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="focus-channels">
            {CHANNELS.map((ch) => {
              const value = volumes[ch.id];
              return (
                <div className="focus-channel" key={ch.id} data-active={value > 0}>
                  <div className="focus-channel-top">
                    <span className="focus-channel-icon" aria-hidden="true">
                      {ch.icon}
                    </span>
                    <div className="focus-channel-copy">
                      <h3>{ch.label}</h3>
                      <p>{ch.hint}</p>
                    </div>
                    <span className="focus-channel-val">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    aria-label={`${ch.label}音量`}
                    value={value}
                    onChange={(event) =>
                      applyVolumes({
                        ...volumes,
                        [ch.id]: Number(event.target.value),
                      })
                    }
                  />
                </div>
              );
            })}
          </div>

          <aside className="focus-lab-more">
            <p>
              喜欢互动小实验？也可以去看看冬日限定的{" "}
              <a href="christmas.html">圣诞夜粒子圣诞树 →</a>，或用{" "}
              <a href="frame-studio.html">画框工坊 →</a> 给作品截图与代码加上画廊边框。
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
