import type { Question } from "./schemas";

/** The ladder: each level gives less help, so confidence builds instead of dependence. */
export type HintLevel = 1 | 2 | 3 | 4;

export const LEVELS: Record<HintLevel, { name: string; blurb: string }> = {
  1: { name: "Training wheels", blurb: "Full talking points on screen while you answer." },
  2: { name: "Cue words", blurb: "Just a few keywords to jog your memory." },
  3: { name: "Solo, coached", blurb: "No hints. Feedback right after each answer." },
  4: { name: "Mock interview", blurb: "No hints, no feedback until the end. Like the real thing." },
};
