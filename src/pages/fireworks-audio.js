// Pure Web Audio API procedural firework acoustics (launch whistle, resonant boom, sparkling crackle).
export function createFireworksAudio() {
  let ctx = null;
  let noiseBuffer = null;
  let enabled = false;

  function ensureContext() {
    if (ctx) {
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      return ctx;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    const length = ctx.sampleRate * 2;
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return ctx;
  }

  function setEnabled(next) {
    enabled = Boolean(next);
    if (enabled) ensureContext();
  }

  function isEnabled() {
    return enabled;
  }

  function playLaunch(pan = 0) {
    if (!enabled) return;
    const audio = ensureContext();
    if (!audio || !noiseBuffer) return;

    const now = audio.currentTime + 0.005;
    const src = audio.createBufferSource();
    src.buffer = noiseBuffer;

    const filter = audio.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 4.2;
    filter.frequency.setValueAtTime(620, now);
    filter.frequency.exponentialRampToValueAtTime(1950, now + 0.42);

    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.46);

    const out = audio.createStereoPanner ? audio.createStereoPanner() : null;
    if (out) {
      out.pan.value = Math.max(-0.7, Math.min(0.7, pan));
      src.connect(filter).connect(gain).connect(out).connect(audio.destination);
    } else {
      src.connect(filter).connect(gain).connect(audio.destination);
    }
    src.start(now);
    src.stop(now + 0.5);
  }

  function playBurst(intensity = 1, pan = 0, crackle = false) {
    if (!enabled) return;
    const audio = ensureContext();
    if (!audio || !noiseBuffer) return;

    const now = audio.currentTime + 0.005;
    const dest = audio.createStereoPanner ? audio.createStereoPanner() : null;
    if (dest) {
      dest.pan.value = Math.max(-0.75, Math.min(0.75, pan));
      dest.connect(audio.destination);
    }
    const target = dest || audio.destination;

    // 1. Sub-bass atmospheric thump.
    const sub = audio.createOscillator();
    const subGain = audio.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(118 + Math.random() * 24, now);
    sub.frequency.exponentialRampToValueAtTime(34, now + 0.34);
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(0.22 * intensity, now + 0.015);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.44);
    sub.connect(subGain).connect(target);
    sub.start(now);
    sub.stop(now + 0.46);

    // 2. Warm bloom noise cloud.
    const cloud = audio.createBufferSource();
    cloud.buffer = noiseBuffer;
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(1500, now);
    lp.frequency.exponentialRampToValueAtTime(220, now + 0.72);
    const cloudGain = audio.createGain();
    cloudGain.gain.setValueAtTime(0.0001, now);
    cloudGain.gain.exponentialRampToValueAtTime(0.18 * intensity, now + 0.014);
    cloudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.78);
    cloud.connect(lp).connect(cloudGain).connect(target);
    cloud.start(now);
    cloud.stop(now + 0.82);

    // 3. Optional glittering crackle pops.
    if (crackle) {
      const pops = 6;
      for (let i = 0; i < pops; i++) {
        const offset = 0.24 + i * 0.055 + Math.random() * 0.07;
        const pop = audio.createBufferSource();
        pop.buffer = noiseBuffer;
        const hp = audio.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 2800 + Math.random() * 1400;
        const pg = audio.createGain();
        pg.gain.setValueAtTime(0.0001, now + offset);
        pg.gain.exponentialRampToValueAtTime(0.045 * intensity, now + offset + 0.004);
        pg.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.045);
        pop.connect(hp).connect(pg).connect(target);
        pop.start(now + offset);
        pop.stop(now + offset + 0.055);
      }
    }
  }

  function dispose() {
    if (ctx) {
      ctx.close().catch(() => {});
      ctx = null;
      noiseBuffer = null;
    }
  }

  return { setEnabled, isEnabled, playLaunch, playBurst, dispose };
}
