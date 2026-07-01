"use client";

import { useEffect, useRef } from "react";

// One big emoji answer card. Celebrates when correct, shakes gently when wrong.

const COLORS = ["#ffd166", "#06d6a0", "#4cc9f0"]; // sunny, mint, sky

type Props = {
  emoji: string;
  word: string;
  colorIndex: number;
  celebrate: boolean;
  /** Increment to trigger a shake (a new wrong tap on this card). */
  shakeSignal: number;
  disabled: boolean;
  onPick: () => void;
};

export default function Card({
  emoji,
  word,
  colorIndex,
  celebrate,
  shakeSignal,
  disabled,
  onPick,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  // Play the shake imperatively so a repeat wrong tap always replays it.
  useEffect(() => {
    if (shakeSignal === 0 || !ref.current) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    ref.current.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-10px)" },
        { transform: "translateX(10px)" },
        { transform: "translateX(-7px)" },
        { transform: "translateX(7px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 500, easing: "ease-in-out" },
    );
  }, [shakeSignal]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onPick}
      disabled={disabled}
      aria-label={word}
      className={`flex aspect-square w-full items-center justify-center rounded-[2rem] border-4 border-white shadow-lg transition-transform duration-150 active:scale-95 disabled:active:scale-100 ${
        celebrate ? "animate-celebrate" : ""
      }`}
      style={{ backgroundColor: COLORS[colorIndex % COLORS.length] }}
    >
      <span className="text-6xl drop-shadow-sm sm:text-7xl md:text-8xl">{emoji}</span>
    </button>
  );
}
