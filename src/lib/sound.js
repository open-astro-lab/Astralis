let audioCtx = null;
let ambientNodes = null;
let ambientPlaying = false;

function getCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone({ freq, duration = 0.15, type = "sine", startTime = 0, gainPeak = 0.07, detune = 0 }) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const t0 = ctx.currentTime + startTime;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export function playClick() {
  playTone({ freq: 720, duration: 0.05, type: "sine", gainPeak: 0.045 });
}

export function playCorrect() {
  // Bright, quick ascending two-note chime.
  playTone({ freq: 523.25, duration: 0.13, type: "sine", gainPeak: 0.08 });
  playTone({ freq: 783.99, duration: 0.22, type: "sine", gainPeak: 0.08, startTime: 0.08 });
}

export function playWrong() {
  // Short, soft, low buzz — noticeable but not harsh.
  playTone({ freq: 185, duration: 0.22, type: "sawtooth", gainPeak: 0.045 });
  playTone({ freq: 175, duration: 0.22, type: "sawtooth", gainPeak: 0.03, detune: -15 });
}

export function playLevelUp() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
    playTone({ freq, duration: 0.3, type: "sine", gainPeak: 0.08, startTime: i * 0.09 })
  );
}

// A layered ambient soundscape: a warm filtered pad chord with a slow
// filter sweep for movement, plus a soft pentatonic arpeggio ticking over
// it for genuine rhythmic energy — not just a static drone.
let ambientTimers = [];

export function startAmbient() {
  if (ambientPlaying) return;
  const ctx = getCtx();
  if (!ctx) return;

  const master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.5);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.7;
  filter.connect(master);

  // Warm Cmaj7-ish pad, low register.
  const padFreqs = [130.81, 164.81, 196.0, 246.94]; // C3 E3 G3 B3
  const oscillators = padFreqs.map((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = f;
    osc.detune.value = (i - 1.5) * 4;
    const oGain = ctx.createGain();
    oGain.gain.value = 0.55;
    osc.connect(oGain);
    oGain.connect(filter);
    osc.start();
    return osc;
  });

  // Slow filter sweep gives the pad a gentle breathing/opening motion.
  const filterLfo = ctx.createOscillator();
  filterLfo.frequency.value = 0.07;
  const filterLfoGain = ctx.createGain();
  filterLfoGain.gain.value = 450;
  filterLfo.connect(filterLfoGain);
  filterLfoGain.connect(filter.frequency);
  filterLfo.start();

  // Soft pentatonic arpeggio — the "energy" layer, ticking gently on top.
  const scale = [523.25, 587.33, 659.25, 783.99, 880.0]; // C5 D5 E5 G5 A5
  let step = 0;
  function scheduleArp() {
    if (!ambientPlaying) return;
    const freq = scale[step % scale.length];
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(g);
    g.connect(master);
    const t0 = ctx.currentTime;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.05, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
    osc.start(t0);
    osc.stop(t0 + 0.6);
    step += 1;
    const delay = step % 4 === 0 ? 780 : 480;
    ambientTimers.push(setTimeout(scheduleArp, delay));
  }
  ambientTimers.push(setTimeout(scheduleArp, 400));

  ambientNodes = { oscillators, master, filterLfo };
  ambientPlaying = true;
}

export function stopAmbient() {
  if (!ambientPlaying || !ambientNodes) return;
  ambientTimers.forEach(clearTimeout);
  ambientTimers = [];
  const ctx = getCtx();
  const { oscillators, master, filterLfo } = ambientNodes;
  if (ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  }
  setTimeout(() => {
    oscillators.forEach((o) => {
      try { o.stop(); } catch { /* already stopped */ }
    });
    try { filterLfo.stop(); } catch { /* already stopped */ }
  }, 450);
  ambientPlaying = false;
  ambientNodes = null;
}
