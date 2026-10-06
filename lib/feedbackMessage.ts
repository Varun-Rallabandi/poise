import type { Metrics, Question } from "./schemas";

/** The user turn for grading one answer. Kept pure so it's easy to test. */
export function feedbackMessage(question: Question, transcript: string, metrics: Metrics): string {
  return `Question asked: "${question.question}"
Talking points a strong answer covers: ${question.talkingPoints.join("; ") || "(follow-up question: judge against the code)"}

Candidate's spoken answer (transcript):
"""${transcript.trim() || "(no answer recorded)"}"""

Delivery metrics: ${metrics.seconds}s long, ${metrics.wpm} words/min, ${metrics.fillers} filler words, longest pause ${metrics.longestPause}s.`;
}
