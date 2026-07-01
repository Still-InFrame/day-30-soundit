"use client";

// Tap-to-start splash. Its tap doubles as the audio + speech unlock that mobile
// browsers require before any sound can play.

type Props = {
  onStart: () => void;
};

export default function StartGate({ onStart }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 p-6 text-center">
      <div className="animate-float">
        <h1
          className="text-6xl font-bold tracking-tight text-white sm:text-7xl"
          style={{ textShadow: "0 4px 0 rgba(0,0,0,0.12)" }}
        >
          Soundit
        </h1>
        <p className="mt-3 text-xl font-medium text-[#3f3d56]/80 sm:text-2xl">
          Tap the picture that starts with the letter!
        </p>
      </div>

      <div className="flex gap-3 text-6xl sm:text-7xl" aria-hidden>
        <span className="animate-float" style={{ animationDelay: "0s" }}>
          🐻
        </span>
        <span className="animate-float" style={{ animationDelay: "0.4s" }}>
          🍎
        </span>
        <span className="animate-float" style={{ animationDelay: "0.8s" }}>
          ☀️
        </span>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-[#ef476f] px-14 py-6 text-3xl font-bold text-white shadow-xl transition-transform active:scale-95 sm:text-4xl"
      >
        Play ▶
      </button>
    </div>
  );
}
