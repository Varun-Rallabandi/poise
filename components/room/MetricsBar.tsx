import type { Metrics } from "@/lib/schemas";
import { fillerTone, paceTone, pauseTone, type Tone } from "@/lib/thresholds";
import { mmss } from "@/lib/format";

const toneClass: Record<Tone, string> = {
  good: "text-accent",
  ok: "text-foreground",
  watch: "text-warn",
};

function Stat({ label, value, tone }: { label: string; value: string; tone: Tone }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted">{label}</span>
      <span className={`font-mono text-lg tabular-nums ${toneClass[tone]}`}>{value}</span>
    </div>
  );
}

export function MetricsBar({ m }: { m: Metrics }) {
  return (
    <div className="flex gap-6 rounded-xl border border-border bg-surface px-4 py-2">
      <Stat label="Time" value={mmss(m.seconds)} tone="ok" />
      <Stat label="Pace" value={m.wpm ? `${m.wpm} wpm` : "—"} tone={paceTone(m.wpm)} />
      <Stat label="Fillers" value={String(m.fillers)} tone={fillerTone(m.fillers, m.seconds)} />
      <Stat label="Longest pause" value={`${m.longestPause}s`} tone={pauseTone(m.longestPause)} />
    </div>
  );
}
