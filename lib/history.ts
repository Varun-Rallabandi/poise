import type { HintLevel } from "./hints";

export type SessionRecord = {
  at: number;
  level: HintLevel;
  questions: number;
  avgScore: number | null;
  avgWpm: number;
  fillersPerMin: number;
  longestPause: number;
};

const KEY = "poise.history.v1";
const MAX = 50;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** History is a per-browser convenience; storage can be missing or throw (private mode), so never fail on it. */
export function loadHistory(store: StorageLike | undefined = globalThis.localStorage): SessionRecord[] {
  try {
    const raw = store?.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSession(rec: SessionRecord, store: StorageLike | undefined = globalThis.localStorage): SessionRecord[] {
  const next = [...loadHistory(store), rec].slice(-MAX);
  try {
    store?.setItem(KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function clearHistory(store: StorageLike | undefined = globalThis.localStorage) {
  try {
    store?.removeItem(KEY);
  } catch {}
}
