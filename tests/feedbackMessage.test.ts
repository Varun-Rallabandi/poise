import { describe, expect, it } from "vitest";
import { feedbackMessage } from "@/lib/feedbackMessage";

const q = {
  question: "Why Postgres?",
  category: "design" as const,
  file: "db.ts",
  talkingPoints: ["relational data", "transactions"],
  keywords: ["joins"],
};
const m = { seconds: 40, words: 90, wpm: 135, fillers: 3, longestPause: 2.5 };

describe("feedbackMessage", () => {
  it("includes question, talking points and metrics", () => {
    const s = feedbackMessage(q, "Because joins", m);
    expect(s).toContain('"Why Postgres?"');
    expect(s).toContain("relational data; transactions");
    expect(s).toContain("135 words/min");
    expect(s).toContain("longest pause 2.5s");
  });
  it("marks empty answers explicitly", () => {
    expect(feedbackMessage(q, "   ", m)).toContain("(no answer recorded)");
  });
});
