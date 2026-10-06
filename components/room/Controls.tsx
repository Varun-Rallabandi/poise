import type { Phase } from "@/lib/session";

type Props = {
  phase: Phase;
  onRepeat: () => void;
  onBegin: () => void;
  onEnd: () => void;
  onNext: () => void;
  isLast: boolean;
};

const btn = "rounded-full px-5 py-2.5 text-sm font-medium transition disabled:opacity-40";

export function Controls({ phase, onRepeat, onBegin, onEnd, onNext, isLast }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(phase === "ready" || phase === "asking") && (
        <>
          <button className={`${btn} bg-accent text-white`} onClick={onBegin} disabled={phase === "asking"}>
            Start answering
          </button>
          <button className={`${btn} border border-border`} onClick={onRepeat}>
            Repeat question
          </button>
        </>
      )}
      {phase === "answering" && (
        <button className={`${btn} bg-danger text-white`} onClick={onEnd}>
          Done answering
        </button>
      )}
      {phase === "grading" && <span className="text-sm text-muted">Coach is reviewing your answer…</span>}
      {phase === "review" && (
        <button className={`${btn} bg-accent text-white`} onClick={onNext}>
          {isLast ? "Finish session" : "Next question"}
        </button>
      )}
    </div>
  );
}
