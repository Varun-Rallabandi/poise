import type { Feedback, Metrics, Question, QuestionSet } from "./schemas";
import type { RepoFile } from "./types";

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

export const generateQuestions = (files: RepoFile[], count: number, role: string) =>
  post<QuestionSet>("/api/questions", { files, count, role });

export const gradeAnswer = (files: RepoFile[], question: Question, transcript: string, metrics: Metrics) =>
  post<Feedback>("/api/feedback", { files, question, transcript, metrics });
