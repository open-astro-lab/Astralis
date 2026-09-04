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

// A soft, slowly shifting ambient pad — three detuned triangle oscillators
// forming a gentle chord, with a slow LFO breathing the volume in and out.
export function startAmbient() {
  if (ambientPlaying) return;
  const ctx = getCtx();
  if (!ctx) return;

  const master = ctx.createGain();
  master.gain.value = 0.03;
  master.connect(ctx.destination);

  const freqs = [130.81, 164.81, 196.0]; // soft low C-E-G
  const oscillators = freqs.map((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = f;
    osc.detune.value = (i - 1) * 5;
    osc.connect(master);
    osc.start();
    return osc;
  });

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.045;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain);
  lfoGain.connect(master.gain);
  lfo.start();

  ambientNodes = { oscillators, master, lfo };
  ambientPlaying = true;
}

export function stopAmbient() {
  if (!ambientPlaying || !ambientNodes) return;
  const ctx = getCtx();
  const { oscillators, master, lfo } = ambientNodes;
  if (ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  }
  setTimeout(() => {
    oscillators.forEach((o) => {
      try { o.stop(); } catch { /* already stopped */ }
    });
    try { lfo.stop(); } catch { /* already stopped */ }
  }, 450);
  ambientPlaying = false;
  ambientNodes = null;
}
