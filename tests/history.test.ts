import { describe, expect, it } from "vitest";
import { clearHistory, loadHistory, saveSession, type SessionRecord } from "@/lib/history";

function memory() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  };
}
const rec = (at: number): SessionRecord => ({ at, level: 1, questions: 3, avgScore: 6, avgWpm: 140, fillersPerMin: 2, longestPause: 2 });

describe("history", () => {
  it("saves and loads in order", () => {
    const s = memory();
    saveSession(rec(1), s);
    saveSession(rec(2), s);
    expect(loadHistory(s).map((r) => r.at)).toEqual([1, 2]);
  });
  it("keeps only the last 50", () => {
    const s = memory();
    for (let i = 0; i < 55; i++) saveSession(rec(i), s);
    const h = loadHistory(s);
    expect(h).toHaveLength(50);
    expect(h[0].at).toBe(5);
  });
  it("survives corrupt data and throwing storage", () => {
    const s = memory();
    s.setItem("poise.history.v1", "{nope");
    expect(loadHistory(s)).toEqual([]);
    const broken = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); }, removeItem: () => {} };
    expect(loadHistory(broken)).toEqual([]);
    expect(() => saveSession(rec(1), broken)).not.toThrow();
  });
  it("clears", () => {
    const s = memory();
    saveSession(rec(1), s);
    clearHistory(s);
    expect(loadHistory(s)).toEqual([]);
  });
});
