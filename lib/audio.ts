// Synthesized chimes via the Web Audio API — no audio files needed, and
// identical on every device. Must be unlocked by a user gesture first
// (browsers block audio before an interaction).

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/** Call from a tap handler to create/resume the context (unlocks mobile audio). */
export function unlockAudio(): void {
  const c = getCtx();
  if (c && c.state === "suspended") void c.resume();
}

/** One shaped tone with a click-free attack/decay envelope. */
function tone(
  freq: number,
  startOffset: number,
  duration: number,
  type: OscillatorType,
  peak: number,
): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  const t0 = c.currentTime + startOffset;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** Happy ascending arpeggio (C-E-G-C) for a correct answer. */
export function playSuccess(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => tone(f, i * 0.09, 0.22, "triangle", 0.28));
}

/** Soft, low, non-punishing "boop" for a wrong tap — a nudge, not a buzzer. */
export function playWrong(): void {
  tone(320, 0, 0.16, "sine", 0.22);
  tone(240, 0.12, 0.2, "sine", 0.2);
}
