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

// Touching window.localStorage itself can throw when site data is blocked, so only do it inside try.
const defaultStore = (): StorageLike | undefined =>
  typeof window === "undefined" ? undefined : window.localStorage;

/** History is a per-browser convenience; storage can be missing or throw (private mode), so never fail on it. */
export function loadHistory(store?: StorageLike): SessionRecord[] {
  try {
    const raw = (store ?? defaultStore())?.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSession(rec: SessionRecord, store?: StorageLike): SessionRecord[] {
  const next = [...loadHistory(store), rec].slice(-MAX);
  try {
    (store ?? defaultStore())?.setItem(KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function clearHistory(store?: StorageLike) {
  try {
    (store ?? defaultStore())?.removeItem(KEY);
  } catch {}
}
