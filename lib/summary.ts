import type { HintLevel } from "./hints";
import type { SessionRecord } from "./history";
import type { Answer } from "./session";

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const round1 = (n: number) => Math.round(n * 10) / 10;

export function summarize(answers: Answer[], level: HintLevel, at = Date.now()): SessionRecord {
  const scores = answers.flatMap((a) => (a.feedback ? [a.feedback.score] : []));
  const spoken = answers.filter((a) => a.metrics.words > 0);
  const seconds = spoken.reduce((t, a) => t + a.metrics.seconds, 0);
  const fillers = spoken.reduce((t, a) => t + a.metrics.fillers, 0);
  return {
    at,
    level,
    questions: answers.length,
    avgScore: scores.length ? round1(avg(scores)) : null,
    avgWpm: Math.round(avg(spoken.map((a) => a.metrics.wpm))),
    fillersPerMin: seconds ? round1((fillers / seconds) * 60) : 0,
    longestPause: Math.max(0, ...answers.map((a) => a.metrics.longestPause)),
  };
}

/** Move up the ladder after a strong session, back down after a rough one. */
export function suggestLevel(rec: SessionRecord): HintLevel {
  if (rec.avgScore === null) return rec.level;
  if (rec.avgScore >= 7.5 && rec.level < 4) return (rec.level + 1) as HintLevel;
  if (rec.avgScore < 4.5 && rec.level > 1) return (rec.level - 1) as HintLevel;
  return rec.level;
}
