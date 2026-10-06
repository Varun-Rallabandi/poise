/** Rough token estimate: ~4 characters per token for code. */
export function approxTokens(chars: number): string {
  const t = Math.round(chars / 4);
  return t >= 1000 ? `${Math.round(t / 1000)}k` : String(t);
}

export function mmss(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
