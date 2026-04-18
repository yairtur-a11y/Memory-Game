// ── Feedback: sound + haptics ───────────────────────────────────────────────
// All audio is synthesized via Web Audio API — no external files, works offline.
// Haptics use navigator.vibrate (Android / Chrome); degrades silently on iOS.

const Feedback = (() => {
  let audioCtx   = null;
  let soundOn    = localStorage.getItem("fb-sound")   !== "false";
  let hapticsOn  = localStorage.getItem("fb-haptics") !== "false";

  // Lazy-init AudioContext after first user gesture (required by browsers)
  function audio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  // Sine tone: freq Hz, dur seconds, vol 0–1, optional delay seconds
  function tone(freq, dur, vol = 0.12, delay = 0) {
    if (!soundOn) return;
    try {
      const c   = audio();
      const t   = c.currentTime + delay;
      const osc = c.createOscillator();
      const amp = c.createGain();
      osc.connect(amp);
      amp.connect(c.destination);
      osc.frequency.setValueAtTime(freq, t);
      amp.gain.setValueAtTime(0, t);
      amp.gain.linearRampToValueAtTime(vol, t + 0.006);
      amp.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch (_) {}
  }

  function vibe(pattern) {
    if (!hapticsOn || !navigator.vibrate) return;
    try { navigator.vibrate(pattern); } catch (_) {}
  }

  return {
    get soundOn()   { return soundOn; },
    get hapticsOn() { return hapticsOn; },

    setSound(v) {
      soundOn = v;
      localStorage.setItem("fb-sound", String(v));
    },
    setHaptics(v) {
      hapticsOn = v;
      localStorage.setItem("fb-haptics", String(v));
    },

    // Very short high click — UI buttons
    tap() {
      tone(1100, 0.04, 0.06);
      vibe(4);
    },

    // Soft mid tick — card flip
    flip() {
      tone(880, 0.07, 0.08);
    },

    // Ascending two-tone chime — correct match / correct answer
    correct() {
      tone(523, 0.16, 0.13);
      tone(784, 0.24, 0.13, 0.09);
      vibe([8, 40, 12]);
    },

    // Short low thud — wrong match / wrong answer
    wrong() {
      tone(220, 0.22, 0.10);
      vibe(22);
    },

    // Ascending four-note melody — win
    win() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.30, 0.14, i * 0.10));
      vibe([12, 60, 12, 60, 20]);
    },
  };
})();
