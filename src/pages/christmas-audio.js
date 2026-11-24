const NOTE_FREQ = {
  G2: 98.0, C3: 130.81, F3: 174.61, G3: 196.0,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, D6: 1174.66, E6: 1318.51,
};

// Gentle celesta arrangement of Silent Night (in 6/8 lullaby pulse, beats in eighth-note pairs).
const MELODY = [
  ["G4", 1.5, "C3"], ["A4", .5], ["G4", 1], ["E4", 3, "G3"],
  ["G4", 1.5, "C3"], ["A4", .5], ["G4", 1], ["E4", 3, "G3"],
  ["D5", 2, "G2"], ["D5", 1], ["B4", 3, "G3"],
  ["C5", 2, "C3"], ["C5", 1], ["G4", 3, "G3"],
  ["A4", 2, "F3"], ["A4", 1], ["C5", 1.5], ["B4", .5], ["A4", 1],
  ["G4", 1.5, "C3"], ["A4", .5], ["G4", 1], ["E4", 3, "G3"],
  ["A4", 2, "F3"], ["A4", 1], ["C5", 1.5], ["B4", .5], ["A4", 1],
  ["G4", 1.5, "C3"], ["A4", .5], ["G4", 1], ["E4", 3, "G3"],
  ["D5", 2, "G2"], ["D5", 1], ["F5", 1.5], ["D5", .5], ["B4", 1],
  ["C5", 3, "C3"], ["E5", 3, "G3"],
  ["C5", 1.5, "C3"], ["G4", .5], ["E4", 1], ["G4", 1.5, "G2"], ["F4", .5], ["D4", 1],
  ["C4", 4.5, "C3"], [null, 2.5],
];

const TAP_SCALE = ["C5", "D5", "E5", "G5", "A5", "C6", "D6", "E6"];
const BEAT_SECONDS = .48;

export function createMusicBox() {
  let ctx = null;
  let master = null;
  let output = null;
  let playing = false;
  let timer = 0;
  let stepIndex = 0;
  let nextNoteTime = 0;
  let tapCursor = 0;

  function ensureContext() {
    if (ctx) return true;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return false;
    ctx = new AudioCtor();

    master = ctx.createGain();
    master.gain.value = .0001;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 3400;
    filter.Q.value = .5;

    // Warm music-box shimmer echo.
    const delay = ctx.createDelay(1);
    delay.delayTime.value = .29;
    const feedback = ctx.createGain();
    feedback.gain.value = .24;
    const echoTone = ctx.createBiquadFilter();
    echoTone.type = "lowpass";
    echoTone.frequency.value = 1850;
    const wet = ctx.createGain();
    wet.gain.value = .28;

    filter.connect(master);
    filter.connect(delay);
    delay.connect(echoTone);
    echoTone.connect(feedback);
    feedback.connect(delay);
    echoTone.connect(wet);
    wet.connect(master);
    master.connect(ctx.destination);

    output = filter;
    return true;
  }

  function playCelesta(freq, startTime, duration, volume) {
    if (!ctx || !output || !freq) return;
    const stopAt = startTime + Math.max(.45, duration) + .25;

    const fund = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const bell = ctx.createOscillator();
    fund.type = "sine";
    overtone.type = "sine";
    bell.type = "triangle";
    fund.frequency.setValueAtTime(freq, startTime);
    overtone.frequency.setValueAtTime(freq * 2, startTime);
    bell.frequency.setValueAtTime(freq * 3, startTime);

    const env = ctx.createGain();
    env.gain.setValueAtTime(.0001, startTime);
    env.gain.linearRampToValueAtTime(volume, startTime + .012);
    env.gain.exponentialRampToValueAtTime(volume * .28, startTime + duration * .45);
    env.gain.exponentialRampToValueAtTime(.0001, stopAt);

    const overGain = ctx.createGain();
    overGain.gain.setValueAtTime(.0001, startTime);
    overGain.gain.linearRampToValueAtTime(volume * .18, startTime + .008);
    overGain.gain.exponentialRampToValueAtTime(.0001, startTime + Math.min(duration * .7, .75));

    const bellGain = ctx.createGain();
    bellGain.gain.setValueAtTime(.0001, startTime);
    bellGain.gain.linearRampToValueAtTime(volume * .05, startTime + .005);
    bellGain.gain.exponentialRampToValueAtTime(.0001, startTime + .16);

    fund.connect(env);
    overtone.connect(overGain);
    bell.connect(bellGain);
    env.connect(output);
    overGain.connect(output);
    bellGain.connect(output);

    fund.start(startTime);
    overtone.start(startTime);
    bell.start(startTime);
    fund.stop(stopAt + .03);
    overtone.stop(stopAt + .03);
    bell.stop(stopAt + .03);
  }

  function schedule() {
    if (!playing || !ctx) return;
    while (nextNoteTime < ctx.currentTime + .28) {
      const [note, beats, bass] = MELODY[stepIndex];
      const dur = beats * BEAT_SECONDS;
      if (note) playCelesta(NOTE_FREQ[note], nextNoteTime, dur * 1.12, .22);
      if (bass) playCelesta(NOTE_FREQ[bass], nextNoteTime, dur * 1.4, .10);
      nextNoteTime += dur;
      stepIndex = (stepIndex + 1) % MELODY.length;
    }
  }

  function start() {
    if (!ensureContext()) return false;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    playing = true;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(.0001, master.gain.value), now);
    master.gain.linearRampToValueAtTime(.34, now + .28);
    nextNoteTime = now + .06;
    schedule();
    clearInterval(timer);
    timer = window.setInterval(schedule, 110);
    return true;
  }

  function stop() {
    playing = false;
    clearInterval(timer);
    timer = 0;
    if (!ctx || !master) return false;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(.0001, master.gain.value), now);
    master.gain.exponentialRampToValueAtTime(.0001, now + .25);
    return false;
  }

  return {
    isPlaying() {
      return playing;
    },
    toggle() {
      return playing ? stop() : start();
    },
    playLightChime(isLit) {
      if (!playing || !ctx) return;
      const now = ctx.currentTime + .02;
      const notes = isLit ? ["C5", "E5", "G5", "B5", "D6"] : ["G5", "E5", "C5"];
      notes.forEach((name, idx) => {
        playCelesta(NOTE_FREQ[name], now + idx * .075, .95, .14);
      });
    },
    playTapNote() {
      if (!playing || !ctx) return;
      const note = TAP_SCALE[tapCursor % TAP_SCALE.length];
      tapCursor++;
      playCelesta(NOTE_FREQ[note], ctx.currentTime + .01, .85, .16);
    },
    setVisibility(hidden) {
      if (!ctx || !playing) return;
      if (hidden) {
        clearInterval(timer);
        timer = 0;
        ctx.suspend().catch(() => {});
      } else {
        ctx.resume().then(() => {
          if (!playing) return;
          nextNoteTime = ctx.currentTime + .08;
          schedule();
          clearInterval(timer);
          timer = window.setInterval(schedule, 110);
        }).catch(() => {});
      }
    },
  };
}
