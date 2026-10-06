import type { SessionRecord } from "@/lib/history";

/** Score per session, oldest to newest. Small on purpose: a trend, not a dashboard. */
export function ProgressChart({ history }: { history: SessionRecord[] }) {
  const pts = history.filter((h) => h.avgScore !== null).slice(-12);
  if (pts.length < 2) return <p className="text-sm text-muted">Do a couple more sessions to see your trend.</p>;
  const W = 320;
  const H = 80;
  const x = (i: number) => 8 + (i * (W - 16)) / (pts.length - 1);
  const y = (s: number) => H - 8 - ((s - 1) / 9) * (H - 16);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.avgScore!)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full max-w-sm" role="img" aria-label="Average score per session">
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={p.at} cx={x(i)} cy={y(p.avgScore!)} r={3} fill="var(--accent)">
          <title>
            {new Date(p.at).toLocaleDateString()}: {p.avgScore}/10 at level {p.level}
          </title>
        </circle>
      ))}
    </svg>
  );
}
