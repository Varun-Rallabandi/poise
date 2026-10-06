import type { Metrics } from "./schemas";

const FILLERS = /\b(um+|uh+|erm|you know|basically|kind of|sort of|i mean|literally)\b/gi;

export function countFillers(text: string): number {
  return (text.match(FILLERS) || []).length;
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

export function computeMetrics(text: string, seconds: number, longestPause: number): Metrics {
  const words = countWords(text);
  return {
    seconds: Math.round(seconds),
    words,
    wpm: seconds > 3 ? Math.round((words / seconds) * 60) : 0,
    fillers: countFillers(text),
    longestPause: Math.round(longestPause * 10) / 10,
  };
}
