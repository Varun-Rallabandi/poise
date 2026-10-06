import type { Phase } from "@/lib/session";

type Props = {
  phase: Phase;
  onRepeat: () => void;
  onBegin: () => void;
  onEnd: () => void;
  onNext: () => void;
  isLast: boolean;
  followUp?: string;
  onFollowUp: () => void;
  onHearBetter?: () => void;
};

const btn = "rounded-full px-5 py-2.5 text-sm font-medium transition disabled:opacity-40";

export function Controls({ phase, onRepeat, onBegin, onEnd, onNext, isLast, followUp, onFollowUp, onHearBetter }: Props) {
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
        <>
          {followUp && (
            <button className={`${btn} bg-accent text-white`} onClick={onFollowUp}>
              Take the follow-up
            </button>
          )}
          <button className={`${btn} ${followUp ? "border border-border" : "bg-accent text-white"}`} onClick={onNext}>
            {isLast ? "Finish session" : "Next question"}
          </button>
          {onHearBetter && (
            <button className={`${btn} border border-border`} onClick={onHearBetter}>
              Hear the tighter version
            </button>
          )}
        </>
      )}
    </div>
  );
}
