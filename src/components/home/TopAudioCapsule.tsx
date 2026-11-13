import { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar.jsx";
import { homeData } from "./home-data";

export default function TopAudioCapsule() {
  const audio = useRef<HTMLAudioElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [tracks, setTracks] = useState<{ name: string; url: string }[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  useEffect(
    () => () => tracks.forEach((track) => URL.revokeObjectURL(track.url)),
    [tracks],
  );
  function selectTrack(offset: number) {
    setIndex((current) => (current + offset + tracks.length) % tracks.length);
    setPlaying(false);
    setTime(0);
    setDuration(0);
  }
  async function toggle() {
    if (!tracks.length) {
      input.current?.click();
      return;
    }
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else
      try {
        await audio.current.play();
        setError("");
      } catch {
        setError("此音频暂时无法播放，请换一首。");
      }
  }
  return (
    <div className="gallery-masthead gallery-width">
      <Navbar page="home" />
      <div className="audio-capsule glass-card" aria-label="本地音乐播放器">
        <button
          className={"vinyl " + (playing ? "is-spinning" : "")}
          aria-label="选择本地音乐"
          onClick={() => input.current?.click()}
        >
          <span />
        </button>
        <div className="audio-title">
          <span>{tracks[index]?.name || "Now Playing"}</span>
          <small>
            {error ||
              (tracks.length
                ? `${index + 1} / ${tracks.length} · 本地音频`
                : "选择一首本地音乐")}
          </small>
        </div>
        <button
          aria-label="上一首"
          disabled={tracks.length < 2}
          onClick={() => selectTrack(-1)}
        >
          ‹
        </button>
        <input
          aria-label="播放进度"
          type="range"
          min="0"
          max={duration || 1}
          step="0.1"
          value={time}
          disabled={!duration}
          onChange={(event) => {
            if (audio.current)
              audio.current.currentTime = Number(event.target.value);
            setTime(Number(event.target.value));
          }}
        />
        <button aria-label={playing ? "暂停" : "播放"} onClick={toggle}>
          {playing ? "Ⅱ" : "▷"}
        </button>
        <button
          aria-label="下一首"
          disabled={tracks.length < 2}
          onClick={() => selectTrack(1)}
        >
          ›
        </button>
        <input
          ref={input}
          hidden
          type="file"
          accept="audio/*"
          multiple
          aria-label="添加本地音频"
          onChange={(event) => {
            const files = Array.from(event.target.files || []).filter((file) =>
              file.type.startsWith("audio/"),
            );
            audio.current?.pause();
            setPlaying(false);
            setIndex(0);
            setTime(0);
            setDuration(0);
            setError("");
            setTracks(
              files.map((file) => ({
                name: file.name,
                url: URL.createObjectURL(file),
              })),
            );
            event.target.value = "";
          }}
        />
        <audio
          ref={audio}
          src={tracks[index]?.url}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={() =>
            setDuration(
              Number.isFinite(audio.current?.duration)
                ? audio.current!.duration
                : 0,
            )
          }
          onTimeUpdate={() => setTime(audio.current?.currentTime || 0)}
          onEnded={() => {
            setPlaying(false);
            if (tracks.length > 1) selectTrack(1);
          }}
          onError={() => {
            setPlaying(false);
            setError("此音频暂时无法播放，请换一首。");
          }}
        />
      </div>
      <div className="masthead-meta">
        <span>EST. {homeData.snapshot.siteStarted.slice(0, 4)}</span>
        <span>SITE v{homeData.workbench.updates[0].version}</span>
      </div>
    </div>
  );
}
