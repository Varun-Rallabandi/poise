import { LEVELS, type HintLevel } from "@/lib/hints";
import type { SessionRecord } from "@/lib/history";
import type { Answer } from "@/lib/session";
import { AnswerReview } from "./AnswerReview";
import { ProgressChart } from "./ProgressChart";

type Props = {
  rec: SessionRecord;
  answers: Answer[];
  history: SessionRecord[];
  next: HintLevel;
  onAgain: (level: HintLevel) => void;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl tabular-nums">{value}</p>
    </div>
  );
}

export function SummaryScreen({ rec, answers, history, next, onAgain }: Props) {
  const nudge =
    next > rec.level ? "You're ready for less help." : next < rec.level ? "Take a step back and rebuild." : "Run it again at this level.";
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Session done</h2>
        <p className="text-muted">That&apos;s {rec.questions} questions answered out loud, on camera. That&apos;s the hard part.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Avg score" value={rec.avgScore === null ? "—" : `${rec.avgScore}`} />
        <Stat label="Avg pace" value={`${rec.avgWpm} wpm`} />
        <Stat label="Fillers / min" value={`${rec.fillersPerMin}`} />
        <Stat label="Longest pause" value={`${rec.longestPause}s`} />
      </div>
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="mb-2 text-sm text-muted">Your trend</p>
        <ProgressChart history={history} />
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-accent-soft p-4">
        <p className="flex-1 text-sm">
          {nudge} Next: <span className="font-medium">Level {next}, {LEVELS[next].name}</span>
        </p>
        <button className="rounded-full bg-accent px-5 py-2.5 text-sm text-white" onClick={() => onAgain(next)}>
          Practice again
        </button>
      </div>
      <AnswerReview answers={answers} />
    </div>
  );
}
