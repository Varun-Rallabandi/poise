import { describe, expect, it } from "vitest";
import { computeMetrics, countFillers, countWords } from "@/lib/metrics";

describe("countFillers", () => {
  it("counts common fillers case-insensitively", () => {
    expect(countFillers("Um so basically I, uh, you know, used Redis")).toBe(4);
    expect(countFillers("Ummm I mean it works")).toBe(2);
  });
  it("does not flag words that contain fillers", () => {
    expect(countFillers("umbrella and huh")).toBe(0);
  });
});

describe("computeMetrics", () => {
  it("computes words per minute", () => {
    const m = computeMetrics("one two three four five six", 6, 0);
    expect(m.words).toBe(6);
    expect(m.wpm).toBe(60);
  });
  it("avoids wild wpm in the first seconds", () => {
    expect(computeMetrics("hi there", 1, 0).wpm).toBe(0);
  });
  it("rounds pauses to one decimal", () => {
    expect(computeMetrics("", 10, 2.345).longestPause).toBe(2.3);
  });
  it("handles empty text", () => {
    expect(countWords("   ")).toBe(0);
  });
});
