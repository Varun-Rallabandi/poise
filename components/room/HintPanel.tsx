import type { Hint } from "@/lib/hints";

export function HintPanel({ hint }: { hint: Hint }) {
  if (hint.kind === "none") return null;
  return (
    <aside className="rounded-xl border border-accent/30 bg-accent-soft p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-accent">
        {hint.kind === "points" ? "Talking points" : "Cue words"}
      </p>
      {hint.kind === "points" ? (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {hint.items.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-wrap gap-2">
          {hint.items.map((k) => (
            <span key={k} className="rounded-full bg-surface px-3 py-1 text-sm">
              {k}
            </span>
          ))}
        </div>
      )}
    </aside>
  );
}
