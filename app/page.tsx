"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildRound,
  display,
  makeDeck,
  WIN_TARGET,
  type Letter,
  type Round,
} from "@/lib/letters";
import { playSuccess, playWrong, unlockAudio } from "@/lib/audio";
import { cancelSpeech, initSpeech, speakLetter } from "@/lib/speech";
import StartGate from "@/components/StartGate";
import StarBar from "@/components/StarBar";
import Card from "@/components/Card";
import WinScreen from "@/components/WinScreen";

type Phase = "start" | "playing" | "won";

const ADVANCE_DELAY = 950; // ms to enjoy the celebration before the next letter

export default function Home() {
  const [phase, setPhase] = useState<Phase>("start");
  const [deck, setDeck] = useState<Letter[]>([]);
  const [deckPos, setDeckPos] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [correct, setCorrect] = useState(0);
  const [pickedCorrect, setPickedCorrect] = useState<number | null>(null);
  const [shakes, setShakes] = useState<number[]>([0, 0, 0]);
  const [locked, setLocked] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  // Speak the letter whenever a new round appears (and sound is on).
  useEffect(() => {
    if (phase === "playing" && round && soundOn) {
      speakLetter(round.letter);
    }
    // Depend on the letter identity, not the round object, to avoid re-speaking
    // on unrelated re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round?.letter.char, phase, soundOn]);

  const startRoundAt = useCallback((newDeck: Letter[], pos: number) => {
    setRound(buildRound(newDeck[pos]));
    setPickedCorrect(null);
    setShakes([0, 0, 0]);
    setLocked(false);
  }, []);

  const beginGame = useCallback(() => {
    unlockAudio();
    initSpeech();
    const newDeck = makeDeck();
    setDeck(newDeck);
    setDeckPos(0);
    setCorrect(0);
    setPhase("playing");
    startRoundAt(newDeck, 0);
  }, [startRoundAt]);

  const handlePick = useCallback(
    (cardIndex: number) => {
      if (!round || locked || pickedCorrect !== null) return;
      const card = round.cards[cardIndex];

      if (!card.isCorrect) {
        if (soundOn) playWrong();
        setShakes((prev) => {
          const next = [...prev];
          next[cardIndex] += 1;
          return next;
        });
        return;
      }

      // Correct!
      if (soundOn) playSuccess();
      setPickedCorrect(cardIndex);
      setLocked(true);
      const nextCorrect = correct + 1;
      setCorrect(nextCorrect);

      advanceTimer.current = setTimeout(() => {
        if (nextCorrect >= WIN_TARGET) {
          setPhase("won");
          return;
        }
        const nextPos = deckPos + 1;
        setDeckPos(nextPos);
        startRoundAt(deck, nextPos);
      }, ADVANCE_DELAY);
    },
    [round, locked, pickedCorrect, soundOn, correct, deckPos, deck, startRoundAt],
  );

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on;
      if (!next) cancelSpeech();
      else if (round) speakLetter(round.letter);
      return next;
    });
  }, [round]);

  if (phase === "start") {
    return <StartGate onStart={beginGame} />;
  }

  if (phase === "won") {
    return <WinScreen onPlayAgain={beginGame} />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-5">
      {/* Top bar: sound toggle + progress */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          className="shrink-0 rounded-full bg-white/70 px-3 py-2 text-2xl shadow-sm transition-transform active:scale-90"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
        <StarBar count={correct} total={WIN_TARGET} />
      </div>

      {/* The prompt letter — tap to hear it again. */}
      <button
        type="button"
        onClick={() => soundOn && round && speakLetter(round.letter)}
        aria-label={round ? `Hear the letter ${round.letter.char} again` : undefined}
        className="mx-auto my-auto flex flex-col items-center"
      >
        <span
          key={round?.letter.char}
          className="animate-float select-none text-[7rem] font-bold leading-none text-white sm:text-[9rem]"
          style={{ textShadow: "0 6px 0 rgba(0,0,0,0.12)" }}
        >
          {round ? display(round.letter) : ""}
        </span>
      </button>

      {/* Answer cards */}
      <div className="mb-2 grid grid-cols-3 gap-3 sm:gap-4">
        {round?.cards.map((card, i) => (
          <Card
            key={`${round.letter.char}-${i}`}
            emoji={card.emoji}
            word={card.word}
            colorIndex={i}
            celebrate={pickedCorrect === i}
            shakeSignal={shakes[i]}
            disabled={locked}
            onPick={() => handlePick(i)}
          />
        ))}
      </div>
    </main>
  );
}
