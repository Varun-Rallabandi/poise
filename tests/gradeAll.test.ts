import { describe, expect, it } from "vitest";
import { gradeAll } from "@/lib/gradeAll";
import type { Feedback, Question } from "@/lib/schemas";
import type { Answer } from "@/lib/session";

const q = (t: string): Question => ({ question: t, category: "design", file: "", talkingPoints: [], keywords: [] });
const metrics = { seconds: 1, words: 1, wpm: 0, fillers: 0, longestPause: 0 };
const a = (t: string, extra: Partial<Answer> = {}): Answer => ({ question: q(t), transcript: t, metrics, ...extra });

describe("gradeAll", () => {
  it("grades only ungraded answers and keeps order", async () => {
    const seen: string[] = [];
    const res = await gradeAll([a("1"), a("2", { feedback: { score: 9 } as Feedback }), a("3")], async (qq) => {
      seen.push(qq.question);
      return { score: Number(qq.question) } as Feedback;
    });
    expect(seen.sort()).toEqual(["1", "3"]);
    expect(res.map((r) => r.feedback?.score)).toEqual([1, 9, 3]);
  });

  it("records per-answer failures", async () => {
    const res = await gradeAll([a("1"), a("2")], async (qq) => {
      if (qq.question === "2") throw new Error("nope");
      return { score: 5 } as Feedback;
    });
    expect(res[0].feedback?.score).toBe(5);
    expect(res[1].error).toBe("nope");
  });

  it("never runs more than the concurrency limit", async () => {
    let live = 0;
    let peak = 0;
    await gradeAll(
      Array.from({ length: 8 }, (_, i) => a(String(i))),
      async () => {
        peak = Math.max(peak, ++live);
        await new Promise((r) => setTimeout(r, 5));
        live--;
        return { score: 1 } as Feedback;
      },
      2,
    );
    expect(peak).toBe(2);
  });
});
