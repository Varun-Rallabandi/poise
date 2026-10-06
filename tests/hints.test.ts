import { describe, expect, it } from "vitest";
import { deferFeedback, hintFor } from "@/lib/hints";
import type { Question } from "@/lib/schemas";

const q: Question = { question: "Q", category: "design", file: "", talkingPoints: ["a", "b"], keywords: ["k"] };

describe("hintFor", () => {
  it("fades help as the level rises", () => {
    expect(hintFor(1, q)).toEqual({ kind: "points", items: ["a", "b"] });
    expect(hintFor(2, q)).toEqual({ kind: "keywords", items: ["k"] });
    expect(hintFor(3, q).kind).toBe("none");
    expect(hintFor(4, q).kind).toBe("none");
  });
  it("only defers feedback in mock interview mode", () => {
    expect([1, 2, 3, 4].map((l) => deferFeedback(l as 1))).toEqual([false, false, false, true]);
  });
});
