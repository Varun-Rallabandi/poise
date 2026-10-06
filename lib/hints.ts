import type { Question } from "./schemas";

/** The ladder: each level gives less help, so confidence builds instead of dependence. */
export type HintLevel = 1 | 2 | 3 | 4;

export const LEVELS: Record<HintLevel, { name: string; blurb: string }> = {
  1: { name: "Training wheels", blurb: "Full talking points on screen while you answer." },
  2: { name: "Cue words", blurb: "Just a few keywords to jog your memory." },
  3: { name: "Solo, coached", blurb: "No hints. Feedback right after each answer." },
  4: { name: "Mock interview", blurb: "No hints, no feedback until the end. Like the real thing." },
};

export type Hint = { kind: "points" | "keywords" | "none"; items: string[] };

export function hintFor(level: HintLevel, q: Question): Hint {
  if (level === 1) return { kind: "points", items: q.talkingPoints };
  if (level === 2) return { kind: "keywords", items: q.keywords };
  return { kind: "none", items: [] };
}

/** Levels 1-3 grade each answer immediately; level 4 holds feedback until the end. */
export const deferFeedback = (level: HintLevel) => level === 4;
