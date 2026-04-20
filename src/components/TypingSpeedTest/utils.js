// ============================================================
// utils.js – Újrafelhasználható segédfüggvények
// ============================================================

import { TEXTS } from './constants';

// Véletlenszerűen kiválaszt egy szöveget a megadott nehézségi szinthez.
// Ha van egyéni szöveg (legalább 20 karakter), azt adja vissza.
export function pickText(difficulty, customText) {
  if (customText && customText.trim().length >= 20) return customText.trim();
  const arr = TEXTS[difficulty] || TEXTS.medium;
  return arr[Math.floor(Math.random() * arr.length)];
}

// Kiszámolja a szavak per perc (WPM) értéket.
// Az 5 karakter = 1 szó iparági szabvány alapján számol.
export function calcWpm(correctChars, elapsedSeconds) {
  const wordsTyped = correctChars / 5;
  return elapsedSeconds > 0 ? Math.round((wordsTyped / elapsedSeconds) * 60) : 0;
}

// Kiszámolja a pontosságot százalékban.
// Az összes leütött karakter és a helyesek arányából számol.
export function calcAccuracy(typedArray, passage) {
  const total = typedArray.length;
  if (total === 0) return 100;
  const correct = typedArray.filter((char, i) => char === passage[i]).length;
  return Math.round((correct / total) * 100);
}