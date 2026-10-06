export type Tone = "good" | "ok" | "watch";

/** Conversational interview pace sits around 120-160 wpm. */
export function paceTone(wpm: number): Tone {
  if (wpm === 0) return "ok";
  if (wpm >= 115 && wpm <= 165) return "good";
  if (wpm >= 95 && wpm <= 185) return "ok";
  return "watch";
}

/** Fillers per minute: under 3 sounds natural, over 6 is distracting. */
export function fillerTone(fillers: number, seconds: number): Tone {
  const perMin = seconds > 0 ? (fillers / seconds) * 60 : 0;
  return perMin < 3 ? "good" : perMin <= 6 ? "ok" : "watch";
}

export function pauseTone(longest: number): Tone {
  return longest < 3 ? "good" : longest < 5 ? "ok" : "watch";
}
