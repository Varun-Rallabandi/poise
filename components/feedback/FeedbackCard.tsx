import type { Feedback } from "@/lib/schemas";
import { ScoreBadge } from "./ScoreBadge";

function List({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  if (!items.length) return null;
  return (
    <div>
      <p className={`text-xs font-medium uppercase tracking-wide ${tone}`}>{title}</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export function FeedbackCard({ fb }: { fb: Feedback }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-4">
        <ScoreBadge score={fb.score} />
        <div>
          <p className="font-medium">{fb.answeredTheQuestion ? "You answered the question" : "You drifted from the question"}</p>
          <p className="text-sm text-muted">{fb.deliveryNote}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <List title="What worked" items={fb.strengths} tone="text-accent" />
        <List title="Do next time" items={fb.improve} tone="text-warn" />
      </div>
      <List title="From your code, worth mentioning" items={fb.missedPoints} tone="text-muted" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">A tighter version</p>
        <p className="mt-1 text-sm leading-relaxed">{fb.betterAnswer}</p>
      </div>
    </div>
  );
}
