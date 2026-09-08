let audioCtx = null;
let ambientNodes = null;
let ambientPlaying = false;
let ambientTimers = [];
let masterBus = null;

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

// A shared limiter sits between every sound and the speakers so louder
// volumes don't clip — set gently so it acts as a safety net only, not an
// active compressor (an aggressive compressor here was audibly "pumping"
// every time a note hit, which is what sounded like a glitch).
function getMasterBus() {
  const ctx = getCtx();
  if (!ctx) return null;
  if (!masterBus) {
    masterBus = ctx.createDynamicsCompressor();
    masterBus.threshold.value = -6;
    masterBus.knee.value = 6;
    masterBus.ratio.value = 2;
    masterBus.attack.value = 0.02;
    masterBus.release.value = 0.3;
    masterBus.connect(ctx.destination);
  }
  return masterBus;
}

function playTone({ freq, duration = 0.15, type = "sine", startTime = 0, gainPeak = 0.5, detune = 0 }) {
  const ctx = getCtx();
  const bus = getMasterBus();
  if (!ctx || !bus) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  osc.connect(gain);
  gain.connect(bus);
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
  playTone({ freq: 523.25, duration: 0.14, type: "sine", gainPeak: 0.48 });
  playTone({ freq: 783.99, duration: 0.24, type: "sine", gainPeak: 0.48, startTime: 0.09 });
}

export function playWrong() {
  playTone({ freq: 196, duration: 0.24, type: "triangle", gainPeak: 0.36 });
  playTone({ freq: 174.6, duration: 0.24, type: "triangle", gainPeak: 0.28, startTime: 0.03 });
}

export function playLevelUp() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
    playTone({ freq, duration: 0.32, type: "sine", gainPeak: 0.48, startTime: i * 0.1 })
  );
}

// Simple, robust ambient pad + gentle pentatonic arpeggio — routed through
// the shared compressor so it can run much louder without distorting.
export function startAmbient() {
  if (ambientPlaying) return;
  const ctx = getCtx();
  const bus = getMasterBus();
  if (!ctx || !bus) return;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.26, ctx.currentTime + 1.2);
  master.connect(bus);

  const padFreqs = [130.81, 164.81, 196.0]; // C3 E3 G3 — simple, warm, stable
  const oscillators = padFreqs.map((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = f;
    osc.detune.value = (i - 1) * 4;
    const oGain = ctx.createGain();
    oGain.gain.value = 0.55;
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
    g.gain.linearRampToValueAtTime(0.22, t0 + 0.03);
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
