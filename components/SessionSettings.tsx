"use client";

export type Settings = { count: number; role: string };

export function SessionSettings({ value, onChange }: { value: Settings; onChange: (s: Settings) => void }) {
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Role you&apos;re interviewing for (optional)</span>
        <input
          className="rounded-lg border border-border bg-background px-3 py-2"
          placeholder="e.g. Robotics Software Engineer"
          value={value.role}
          onChange={(e) => onChange({ ...value, role: e.target.value })}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Questions: {value.count}</span>
        <input
          type="range"
          min={3}
          max={20}
          value={value.count}
          onChange={(e) => onChange({ ...value, count: Number(e.target.value) })}
          className="accent-[var(--accent)]"
        />
      </label>
    </div>
  );
}
