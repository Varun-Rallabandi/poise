import { describe, expect, it } from "vitest";
import type { Feedback, Question } from "@/lib/schemas";
import type { Answer } from "@/lib/session";
import { suggestLevel, summarize } from "@/lib/summary";

const q: Question = { question: "Q", category: "design", file: "", talkingPoints: [], keywords: [] };
const ans = (score: number | null, seconds: number, wpm: number, fillers: number, pause: number): Answer => ({
  question: q,
  transcript: "x",
  metrics: { seconds, words: seconds ? 10 : 0, wpm, fillers, longestPause: pause },
  ...(score === null ? {} : { feedback: { score } as Feedback }),
});

describe("summarize", () => {
  it("averages scores and pace, rates fillers per minute", () => {
    const r = summarize([ans(6, 60, 120, 3, 2), ans(9, 60, 160, 1, 4.5)], 2, 1);
    expect(r).toEqual({ at: 1, level: 2, questions: 2, avgScore: 7.5, avgWpm: 140, fillersPerMin: 2, longestPause: 4.5 });
  });
  it("leaves the score empty when nothing was graded", () => {
    expect(summarize([ans(null, 30, 130, 0, 1)], 1).avgScore).toBeNull();
  });
  it("ignores silent answers for pace", () => {
    expect(summarize([ans(5, 0, 0, 0, 0), ans(5, 30, 150, 0, 0)], 1).avgWpm).toBe(150);
  });
});

describe("suggestLevel", () => {
  const base = summarize([ans(5, 30, 140, 0, 1)], 2);
  it("moves up after a strong session", () => expect(suggestLevel({ ...base, avgScore: 8 })).toBe(3));
  it("moves down after a rough one", () => expect(suggestLevel({ ...base, avgScore: 3 })).toBe(1));
  it("stays put otherwise and at the ends", () => {
    expect(suggestLevel(base)).toBe(2);
    expect(suggestLevel({ ...base, level: 4, avgScore: 10 })).toBe(4);
    expect(suggestLevel({ ...base, level: 1, avgScore: 1 })).toBe(1);
  });
});
