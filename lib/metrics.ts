import type { Metrics } from "./schemas";

const FILLERS = /\b(um+|uh+|erm|you know|basically|kind of|sort of|i mean|literally)\b/gi;

export function countFillers(text: string): number {
  return (text.match(FILLERS) || []).length;
}
