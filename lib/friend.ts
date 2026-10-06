import type { QuestionSet } from "./schemas";

/** A script a friend can read from while interviewing you over Google Meet. */
export function friendScript(set: QuestionSet): string {
  const lines = set.questions.map((q, i) => `${i + 1}. ${q.question}\n   (Listen for: ${q.talkingPoints.join("; ")})`);
  return [
    "Thanks for helping me practice! Ask these in order, out loud, like a real interviewer.",
    "Ask a follow-up whenever something I say sounds vague.",
    "",
    ...lines,
  ].join("\n");
}
