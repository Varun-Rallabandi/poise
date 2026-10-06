import type { Question } from "@/lib/schemas";

export function QuestionCard({ q, n, total, showText }: { q: Question; n: number; total: number; showText: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          Question {n} of {total}
        </span>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-accent">{q.category}</span>
      </div>
      <p className="mt-2 text-lg leading-snug">{showText ? q.question : "Listen to the interviewer…"}</p>
      {showText && q.file && <p className="mt-1 font-mono text-xs text-muted">{q.file}</p>}
    </div>
  );
}
