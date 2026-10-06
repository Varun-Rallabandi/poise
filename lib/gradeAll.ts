import type { Feedback, Metrics, Question } from "./schemas";
import type { Answer } from "./session";

type Grader = (q: Question, transcript: string, m: Metrics) => Promise<Feedback>;

/** Grade every answer that doesn't have feedback yet (mock-interview mode), a few at a time. */
export async function gradeAll(answers: Answer[], grade: Grader, concurrency = 3): Promise<Answer[]> {
  const out = answers.slice();
  const todo = out.map((a, i) => i).filter((i) => !out[i].feedback && !out[i].error);
  let cursor = 0;
  async function worker() {
    while (cursor < todo.length) {
      const i = todo[cursor++];
      const a = out[i];
      try {
        out[i] = { ...a, feedback: await grade(a.question, a.transcript, a.metrics) };
      } catch (e) {
        out[i] = { ...a, error: e instanceof Error ? e.message : String(e) };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, todo.length) }, worker));
  return out;
}
