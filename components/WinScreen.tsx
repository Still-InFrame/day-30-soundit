"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

// Celebration screen after WIN_TARGET correct answers.

type Props = {
  onPlayAgain: () => void;
};

export default function WinScreen({ onPlayAgain }: Props) {
  useEffect(() => {
    // A few staggered bursts for a satisfying finale.
    const fire = (particleRatio: number, opts: confetti.Options) =>
      confetti({
        origin: { y: 0.6 },
        particleCount: Math.floor(200 * particleRatio),
        ...opts,
      });

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6 text-center">
      <div className="animate-pop-in text-8xl sm:text-9xl" aria-hidden>
        🎉
      </div>
      <h2
        className="text-5xl font-bold text-white sm:text-6xl"
        style={{ textShadow: "0 4px 0 rgba(0,0,0,0.12)" }}
      >
        You did it!
      </h2>
      <div className="flex gap-2 text-4xl" aria-hidden>
        ⭐⭐⭐⭐⭐
      </div>
      <button
        type="button"
        onClick={onPlayAgain}
        className="rounded-full bg-[#ef476f] px-12 py-6 text-3xl font-bold text-white shadow-xl transition-transform active:scale-95 sm:text-4xl"
      >
        Play Again 🔄
      </button>
    </div>
  );
}
