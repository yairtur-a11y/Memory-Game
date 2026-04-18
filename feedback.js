// ── Feedback: sound + haptics ───────────────────────────────────────────────
// Audio: Web Audio API, synthesized on-the-fly, no external files.
// Haptics: navigator.vibrate — Android/Chrome only. iOS Safari does not
//   expose this API at all; canVibrate will be false and nothing is called.

const Feedback = (() => {
  let audioCtx  = null;
  let soundOn   = localStorage.getItem("fb-sound")   !== "false";
  let hapticsOn = localStorage.getItem("fb-haptics") !== "false";

  // navigator.vibrate is undefined on iOS Safari — detect once at load time
  const canVibrate = typeof navigator.vibrate === "function";

  // Create (or reuse) the AudioContext and wait for it to be running.
  // iOS Safari starts every AudioContext in "suspended" state and requires
  // an explicit resume() that resolves before audio can be scheduled.
  async function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state !== "running") await audioCtx.resume();
    return audioCtx;
  }

  // Schedule a sine tone. fire-and-forget — callers don't await this.
  // Multiple simultaneous calls (e.g. chords) each await the same resume
  // promise, then schedule relative to the shared currentTime, so relative
  // timing via `delay` is preserved even after an async unlock on iOS.
  async function tone(freq, dur, vol = 0.12, delay = 0) {
    if (!soundOn) return;
    try {
      const c   = await ensureAudio();
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
    if (!hapticsOn || !canVibrate) return;
    try { navigator.vibrate(pattern); } catch (_) {}
  }

  return {
    get soundOn()    { return soundOn; },
    get hapticsOn()  { return hapticsOn; },
    get canVibrate() { return canVibrate; },

    setSound(v)   { soundOn = v;   localStorage.setItem("fb-sound",   String(v)); },
    setHaptics(v) { hapticsOn = v; localStorage.setItem("fb-haptics", String(v)); },

    tap()     { tone(1100, 0.04, 0.06); vibe(4); },
    flip()    { tone(880,  0.07, 0.08); },
    correct() { tone(523, 0.16, 0.13); tone(784, 0.24, 0.13, 0.09); vibe([8, 40, 12]); },
    wrong()   { tone(220, 0.22, 0.10); vibe(22); },
    win()     { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.30, 0.14, i * 0.10)); vibe([12, 60, 12, 60, 20]); },
  };
})();
