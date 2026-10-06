import { describe, expect, it } from "vitest";
import { initSession, sessionReducer as r, type SessionState } from "@/lib/session";
import type { Feedback, Question } from "@/lib/schemas";

const q = (n: number): Question => ({ question: `Q${n}`, category: "design", file: "", talkingPoints: [], keywords: [] });
const metrics = { seconds: 30, words: 70, wpm: 140, fillers: 1, longestPause: 1 };
const fb = { score: 7 } as Feedback;

const answerOnce = (s: SessionState) =>
  [{ type: "asked" }, { type: "begin" }, { type: "end", transcript: "hi", metrics }, { type: "graded", feedback: fb }].reduce(
    (acc, a) => r(acc, a as Parameters<typeof r>[1]),
    s,
  );

describe("sessionReducer", () => {
  it("walks a question through the full loop", () => {
    let s = r(initSession([q(1), q(2)]), { type: "start" });
    expect(s.phase).toBe("asking");
    s = answerOnce(s);
    expect(s.phase).toBe("review");
    expect(s.answers[0]).toMatchObject({ transcript: "hi", feedback: fb });
    s = r(s, { type: "next" });
    expect(s).toMatchObject({ phase: "asking", index: 1 });
  });

  it("finishes after the last question", () => {
    const s = r(answerOnce(r(initSession([q(1)]), { type: "start" })), { type: "next" });
    expect(s.phase).toBe("done");
  });

  it("records grading errors without losing the answer", () => {
    let s = r(initSession([q(1)]), { type: "start" });
    s = r(r(r(s, { type: "asked" }), { type: "begin" }), { type: "end", transcript: "x", metrics });
    s = r(s, { type: "gradeFailed", error: "boom" });
    expect(s.answers[0]).toMatchObject({ transcript: "x", error: "boom" });
  });

  it("ignores actions that don't fit the current phase", () => {
    const s = initSession([q(1)]);
    expect(r(s, { type: "begin" })).toBe(s);
    expect(r(s, { type: "next" })).toBe(s);
  });
});
