import type { Feedback, Metrics, Question } from "./schemas";

export type Answer = {
  question: Question;
  transcript: string;
  metrics: Metrics;
  feedback?: Feedback;
  error?: string;
};

export type Phase = "intro" | "asking" | "ready" | "answering" | "grading" | "review" | "done";

export type SessionState = {
  phase: Phase;
  index: number;
  questions: Question[];
  answers: Answer[];
};

export type SessionAction =
  | { type: "start" }
  | { type: "asked" }
  | { type: "begin" }
  | { type: "end"; transcript: string; metrics: Metrics }
  | { type: "graded"; feedback: Feedback }
  | { type: "gradeFailed"; error: string }
  | { type: "next" };

export function initSession(questions: Question[]): SessionState {
  return { phase: "intro", index: 0, questions, answers: [] };
}
