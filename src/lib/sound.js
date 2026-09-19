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

// Short UI tones – soft sine only, low volume so they never buzz on phone speakers
function playTone({ freq, duration = 0.15, type = "sine", startTime = 0, gainPeak = 0.18, detune = 0 }) {
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
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export function playClick() {
  playTone({ freq: 720, duration: 0.05, type: "sine", gainPeak: 0.12 });
}

export function playCorrect() {
  playTone({ freq: 523.25, duration: 0.14, type: "sine", gainPeak: 0.18 });
  playTone({ freq: 783.99, duration: 0.22, type: "sine", gainPeak: 0.16, startTime: 0.09 });
}

export function playWrong() {
  playTone({ freq: 196, duration: 0.22, type: "sine", gainPeak: 0.14 });
  playTone({ freq: 174.6, duration: 0.22, type: "sine", gainPeak: 0.12, startTime: 0.03 });
}

export function playLevelUp() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
    playTone({ freq, duration: 0.28, type: "sine", gainPeak: 0.16, startTime: i * 0.1 })
  );
}

/**
 * Soft ambient pad – pure sine waves only, heavily filtered and very quiet.
 * Designed so phone speakers never produce a harsh buzz or distortion.
 */
export function startAmbient() {
  if (ambientPlaying) return;
  const ctx = getCtx();
  if (!ctx) return;

  // Master volume kept very low
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 1.5);

  // Gentle low-pass so nothing harsh reaches the speaker
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;
  filter.Q.value = 0.5;
  filter.connect(master);
  master.connect(ctx.destination);

  // Warm, quiet chord – pure sine only (no triangle/saw that create buzz)
  const padFreqs = [130.81, 164.81, 196.0]; // C3 E3 G3
  const oscillators = padFreqs.map((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    osc.detune.value = (i - 1) * 3;
    const oGain = ctx.createGain();
    oGain.gain.value = 0.22; // quiet individual voices
    osc.connect(oGain);
    oGain.connect(filter);
    osc.start();
    return osc;
  });

  // Very soft, slow arpeggio on top
  const scale = [523.25, 587.33, 659.25, 783.99, 880.0];
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
    g.connect(filter);
    const t0 = ctxNow.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.08, t0 + 0.05); // much quieter
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);
    osc.start(t0);
    osc.stop(t0 + 0.75);
    step += 1;
    const delay = step % 4 === 0 ? 1100 : 700; // slower, calmer
    ambientTimers.push(setTimeout(scheduleArp, delay));
  }
  ambientTimers.push(setTimeout(scheduleArp, 800));

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
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
  }
  setTimeout(() => {
    oscillators.forEach((o) => {
      try { o.stop(); } catch { /* already stopped */ }
    });
  }, 550);
  ambientPlaying = false;
  ambientNodes = null;
}
