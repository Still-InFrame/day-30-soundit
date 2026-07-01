// Phonics content + round-building logic. All data is local — no backend.

export type Letter = {
  /** Uppercase letter, e.g. "B". */
  char: string;
  /** Phonetic spelling fed to speech synthesis to coax out the *sound*
   *  ("buh") rather than the letter *name* ("bee"). Best-effort per device. */
  sound: string;
  /** The object whose name starts with this letter's sound. */
  emoji: string;
  word: string;
};

type Card = {
  emoji: string;
  word: string;
  isCorrect: boolean;
};

export type Round = {
  letter: Letter;
  cards: Card[];
};

/** How many correct answers wins the game. */
export const WIN_TARGET = 10;

// Hand-curated so every entry has a distinct initial sound and a clean,
// instantly-recognizable emoji. Because distractors are drawn from *other*
// entries, no distractor can ever share the target's starting sound.
const LETTERS: Letter[] = [
  { char: "A", sound: "ah", emoji: "🍎", word: "apple" },
  { char: "B", sound: "buh", emoji: "🐻", word: "bear" },
  { char: "C", sound: "kuh", emoji: "🐱", word: "cat" },
  { char: "D", sound: "duh", emoji: "🐶", word: "dog" },
  { char: "F", sound: "ff", emoji: "🐟", word: "fish" },
  { char: "G", sound: "guh", emoji: "🐐", word: "goat" },
  { char: "H", sound: "huh", emoji: "🏠", word: "house" },
  { char: "L", sound: "lll", emoji: "🦁", word: "lion" },
  { char: "M", sound: "mmm", emoji: "🌙", word: "moon" },
  { char: "P", sound: "puh", emoji: "🐷", word: "pig" },
  { char: "R", sound: "rrr", emoji: "🌈", word: "rainbow" },
  { char: "S", sound: "sss", emoji: "☀️", word: "sun" },
  { char: "T", sound: "tuh", emoji: "🌳", word: "tree" },
];

/** Display form pairing upper + lower case, e.g. "Bb". */
export function display(letter: Letter): string {
  return letter.char + letter.char.toLowerCase();
}

/** Fisher-Yates shuffle, returns a new array. */
function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** A fresh, randomly-ordered deck of letters for one playthrough. */
export function makeDeck(): Letter[] {
  return shuffle(LETTERS);
}

/** Build one round: the target's card plus two distractors, positions shuffled. */
export function buildRound(letter: Letter): Round {
  const distractors = shuffle(LETTERS.filter((l) => l.char !== letter.char)).slice(0, 2);
  const cards = shuffle([
    { emoji: letter.emoji, word: letter.word, isCorrect: true },
    ...distractors.map((d) => ({ emoji: d.emoji, word: d.word, isCorrect: false })),
  ]);
  return { letter, cards };
}
