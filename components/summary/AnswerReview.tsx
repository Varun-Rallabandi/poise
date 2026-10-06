import type { Answer } from "@/lib/session";
import { FeedbackCard } from "../feedback/FeedbackCard";

export function AnswerReview({ answers }: { answers: Answer[] }) {
  return (
    <div className="flex flex-col gap-2">
      {answers.map((a, i) => (
        <details key={i} className="rounded-xl border border-border bg-surface p-4">
          <summary className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="text-muted">{i + 1}.</span> {a.question.question}
            </span>
            <span className="shrink-0 font-mono text-sm">{a.feedback ? `${a.feedback.score}/10` : a.error ? "error" : "—"}</span>
          </summary>
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted">
              <span className="font-medium text-foreground">You said:</span> {a.transcript || "(nothing recorded)"}
            </p>
            {a.feedback && <FeedbackCard fb={a.feedback} />}
            {a.error && <p className="text-sm text-danger">{a.error}</p>}
          </div>
        </details>
      ))}
    </div>
  );
}
