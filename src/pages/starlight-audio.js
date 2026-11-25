// Pure Web Audio API polyphonic synthesizer with 4 musical timbres & subtle ambient echo.
export const SCALE_NOTES = [
  { id: "C6", label: "C6", key: "K", freq: 1046.5 },
  { id: "A5", label: "A5", key: "J", freq: 880.0 },
  { id: "G5", label: "G5", key: "H", freq: 783.99 },
  { id: "E5", label: "E5", key: "G", freq: 659.25 },
  { id: "D5", label: "D5", key: "F", freq: 587.33 },
  { id: "C5", label: "C5", key: "D", freq: 523.25 },
  { id: "A4", label: "A4", key: "S", freq: 440.0 },
  { id: "G4", label: "G4", key: "A", freq: 392.0 },
];

export function createStarlightSynth() {
  let ctx = null;
  let master = null;
  let delaySend = null;

  function ensureContext() {
    if (ctx) {
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      return ctx;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();

    master = ctx.createGain();
    master.gain.value = 0.72;

    // Gentle soft-limiter compressor prevents clipping on rich chords.
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    master.connect(comp).connect(ctx.destination);

    // Subtle dreamy delay line for celesta / nebula shimmer.
    const delay = ctx.createDelay(0.6);
    delay.delayTime.value = 0.28;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.26;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2600;
    const wet = ctx.createGain();
    wet.gain.value = 0.28;

    delaySend = ctx.createGain();
    delaySend.gain.value = 1;
    delaySend.connect(delay);
    delay.connect(tone);
    tone.connect(feedback);
    feedback.connect(delay);
    tone.connect(wet);
    wet.connect(master);

    return ctx;
  }

  function playNote(rowIndex, timbre = "celesta", velocity = 0.85) {
    const audio = ensureContext();
    if (!audio || !master) return;
    const note = SCALE_NOTES[rowIndex];
    if (!note) return;

    const now = audio.currentTime + 0.005;
    const f = note.freq;
    const peak = Math.max(0.05, Math.min(0.24, 0.16 * velocity));

    if (timbre === "celesta") {
      // Crystalline music box: bell fundamental + glassy 3rd harmonic sparkle.
      const osc1 = audio.createOscillator();
      const osc2 = audio.createOscillator();
      const gain = audio.createGain();
      const overGain = audio.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(f, now);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(f * 3, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.009);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.55);

      overGain.gain.setValueAtTime(0.0001, now);
      overGain.gain.exponentialRampToValueAtTime(peak * 0.22, now + 0.005);
      overGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

      osc1.connect(gain);
      osc2.connect(overGain).connect(gain);
      gain.connect(master);
      gain.connect(delaySend);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.6);
      osc2.stop(now + 0.42);
      return;
    }

    if (timbre === "epiano") {
      // Warm Rhodes-like electric piano with soft lowpass sweep.
      const osc1 = audio.createOscillator();
      const osc2 = audio.createOscillator();
      const filter = audio.createBiquadFilter();
      const gain = audio.createGain();

      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(f, now);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(f * 2, now);
      osc2.detune.value = 3;

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(f * 4.2, now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(420, f * 1.4), now + 0.9);

      const g2 = audio.createGain();
      g2.gain.value = 0.28;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak * 1.15, now + 0.014);
      gain.gain.exponentialRampToValueAtTime(peak * 0.42, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);

      osc1.connect(filter);
      osc2.connect(g2).connect(filter);
      filter.connect(gain);
      gain.connect(master);
      gain.connect(delaySend);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.4);
      osc2.stop(now + 1.4);
      return;
    }

    if (timbre === "harp") {
      // Plucked ethereal harp: crisp saw/triangle burst filtered smoothly.
      const osc = audio.createOscillator();
      const filter = audio.createBiquadFilter();
      const gain = audio.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, now);
      filter.type = "lowpass";
      filter.Q.value = 2.4;
      filter.frequency.setValueAtTime(Math.min(6200, f * 6.5), now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(360, f * 1.25), now + 0.65);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak * 0.9, now + 0.007);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.45);

      osc.connect(filter).connect(gain);
      gain.connect(master);
      gain.connect(delaySend);

      osc.start(now);
      osc.stop(now + 1.5);
      return;
    }

    // "nebula": lush detuned space pad with gentle attack & starry bloom.
    const oscA = audio.createOscillator();
    const oscB = audio.createOscillator();
    const filter = audio.createBiquadFilter();
    const gain = audio.createGain();

    oscA.type = "sine";
    oscA.frequency.setValueAtTime(f, now);
    oscA.detune.value = -7;

    oscB.type = "triangle";
    oscB.frequency.setValueAtTime(f * 0.5, now);
    oscB.detune.value = 7;

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1850, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak * 0.95, now + 0.14);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    gain.connect(delaySend);

    oscA.start(now);
    oscB.start(now);
    oscA.stop(now + 2.15);
    oscB.stop(now + 2.15);
  }

  function dispose() {
    if (ctx) {
      ctx.close().catch(() => {});
      ctx = null;
      master = null;
      delaySend = null;
    }
  }

  return { ensureContext, playNote, dispose };
}
