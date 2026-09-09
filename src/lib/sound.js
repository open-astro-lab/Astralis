let audioCtx = null;
let ambientNodes = null;
let ambientPlaying = false;
let ambientTimers = [];

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

// No compressor — a compressor sitting on top of a constant ambient drone
// was the source of the continuous buzzing/distortion artifact. Instead,
// every sound connects straight to the output, with gain levels chosen so
// even worst-case overlap (ambient pad + arpeggio + a UI tone, all at once)
// stays safely under 1.0 and can never clip or distort.
function playTone({ freq, duration = 0.15, type = "sine", startTime = 0, gainPeak = 0.35, detune = 0 }) {
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
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export function playClick() {
  playTone({ freq: 720, duration: 0.06, type: "sine", gainPeak: 0.3 });
}

export function playCorrect() {
  playTone({ freq: 523.25, duration: 0.14, type: "sine", gainPeak: 0.4 });
  playTone({ freq: 783.99, duration: 0.24, type: "sine", gainPeak: 0.4, startTime: 0.09 });
}

export function playWrong() {
  playTone({ freq: 196, duration: 0.24, type: "triangle", gainPeak: 0.3 });
  playTone({ freq: 174.6, duration: 0.24, type: "triangle", gainPeak: 0.24, startTime: 0.03 });
}

export function playLevelUp() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
    playTone({ freq, duration: 0.32, type: "sine", gainPeak: 0.4, startTime: i * 0.1 })
  );
}

// Simple ambient pad + gentle pentatonic arpeggio, gain-budgeted so the
// running total (pad + arp, continuously) never comes close to clipping —
// no compressor needed, so no pumping/distortion artifact is possible.
export function startAmbient() {
  if (ambientPlaying) return;
  const ctx = getCtx();
  if (!ctx) return;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.27, ctx.currentTime + 1.2);
  master.connect(ctx.destination);

  const padFreqs = [130.81, 164.81, 196.0]; // C3 E3 G3 — simple, warm, stable
  const oscillators = padFreqs.map((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = f;
    osc.detune.value = (i - 1) * 4;
    const oGain = ctx.createGain();
    oGain.gain.value = 0.4;
    osc.connect(oGain);
    oGain.connect(master);
    osc.start();
    return osc;
  });

  const scale = [523.25, 587.33, 659.25, 783.99, 880.0]; // C5 D5 E5 G5 A5 pentatonic
  let step = 0;
  function scheduleArp() {
    if (!ambientPlaying) return;
    const ctxNow = getCtx();
    if (!ctxNow) return;
    const freq = scale[step % scale.length];
    const osc = ctxNow.createOscillator();
    const g = ctxNow.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(g);
    g.connect(master);
    const t0 = ctxNow.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.35, t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
    osc.start(t0);
    osc.stop(t0 + 0.55);
    step += 1;
    const delay = step % 4 === 0 ? 780 : 480;
    ambientTimers.push(setTimeout(scheduleArp, delay));
  }
  ambientTimers.push(setTimeout(scheduleArp, 400));

  ambientNodes = { oscillators, master };
  ambientPlaying = true;
}

export function stopAmbient() {
  if (!ambientPlaying || !ambientNodes) return;
  ambientTimers.forEach(clearTimeout);
  ambientTimers = [];
  const ctx = getCtx();
  const { oscillators, master } = ambientNodes;
  if (ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  }
  setTimeout(() => {
    oscillators.forEach((o) => {
      try { o.stop(); } catch { /* already stopped */ }
    });
  }, 450);
  ambientPlaying = false;
  ambientNodes = null;
}
