// SpeechSynthesis wrapper for the spoken "B ... buh" prompt.
//
// This is best-effort by design: TTS voices vary by device and there's no
// reliable SSML in the browser, so the game never *depends* on speech — the
// chime, animation, and emoji carry the "did I get it right" signal. Here we
// just do our best to pick a clean voice and degrade silently if none exists.

import type { Letter } from "./letters";

let preferred: SpeechSynthesisVoice | null = null;

function supported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): void {
  if (!supported()) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return; // not loaded yet — onvoiceschanged will retry
  preferred =
    voices.find((v) => /en[-_]US/i.test(v.lang) && v.localService) ||
    voices.find((v) => /en[-_]US/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0];
}

/** Resolve a voice up front. getVoices() is often empty on first call, so we
 *  also listen for the async voiceschanged event. Safe to call more than once. */
export function initSpeech(): void {
  if (!supported()) return;
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

/** Speak the letter name then its phonics sound: "B" ... "buh". */
export function speakLetter(letter: Letter): void {
  if (!supported()) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // clear anything still queued so prompts never overlap

  const say = (text: string, rate: number, pitch: number) => {
    const u = new SpeechSynthesisUtterance(text);
    if (preferred) u.voice = preferred;
    u.lang = preferred?.lang ?? "en-US";
    u.rate = rate;
    u.pitch = pitch;
    u.volume = 1;
    synth.speak(u);
  };

  say(letter.char, 0.8, 1.15); // the name — clear and slow
  say(letter.sound, 0.7, 1.1); // the sound — the phonics payload
}

/** Stop any in-flight speech (used when the parent mutes sound). */
export function cancelSpeech(): void {
  if (supported()) window.speechSynthesis.cancel();
}
