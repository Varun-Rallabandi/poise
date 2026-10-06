"use client";
import { useState, useSyncExternalStore } from "react";
import { clearHistory, loadHistory } from "@/lib/history";
import { ProgressChart } from "./ProgressChart";

// Read once per mount on the client; the server renders nothing.
const noop = () => () => {};

export function RecentSessions() {
  const [cleared, setCleared] = useState(false);
  const raw = useSyncExternalStore(noop, () => JSON.stringify(loadHistory()), () => "[]");
  const history = cleared ? [] : (JSON.parse(raw) as ReturnType<typeof loadHistory>);
  if (!history.length) return null;
  const last = history[history.length - 1];
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="font-medium">
          {history.length} practice session{history.length === 1 ? "" : "s"} so far
        </p>
        <button
          className="text-sm text-muted underline-offset-2 hover:underline"
          onClick={() => {
            clearHistory();
            setCleared(true);
          }}
        >
          Clear
        </button>
      </div>
      <p className="mt-1 text-sm text-muted">
        Last: level {last.level}, {last.avgScore ?? "—"}/10, {last.avgWpm} wpm, {last.fillersPerMin} fillers/min
      </p>
      <div className="mt-3">
        <ProgressChart history={history} />
      </div>
    </section>
  );
}
