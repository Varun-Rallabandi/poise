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
  /** Mock-interview mode: skip per-answer grading and move straight on. */
  defer: boolean;
};

export type SessionAction =
  | { type: "start" }
  | { type: "asked" }
  | { type: "begin" }
  | { type: "end"; transcript: string; metrics: Metrics }
  | { type: "graded"; feedback: Feedback }
  | { type: "gradeFailed"; error: string }
  | { type: "next" }
  | { type: "followUp"; question: string };

export function initSession(questions: Question[], defer = false): SessionState {
  return { phase: "intro", index: 0, questions, answers: [], defer };
}

function advance(s: SessionState): SessionState {
  const index = s.index + 1;
  return index >= s.questions.length ? { ...s, phase: "done" } : { ...s, index, phase: "asking" };
}

export function sessionReducer(s: SessionState, a: SessionAction): SessionState {
  switch (a.type) {
    case "start":
      return s.phase === "intro" ? { ...s, phase: "asking" } : s;
    case "asked":
      return s.phase === "asking" ? { ...s, phase: "ready" } : s;
    case "begin":
      return s.phase === "ready" ? { ...s, phase: "answering" } : s;
    case "end": {
      if (s.phase !== "answering") return s;
      const answer: Answer = { question: s.questions[s.index], transcript: a.transcript, metrics: a.metrics };
      const next = { ...s, answers: [...s.answers, answer] };
      return s.defer ? advance(next) : { ...next, phase: "grading" };
    }
    case "graded":
    case "gradeFailed": {
      if (s.phase !== "grading") return s;
      const answers = s.answers.slice();
      const last = answers[answers.length - 1];
      answers[answers.length - 1] = a.type === "graded" ? { ...last, feedback: a.feedback } : { ...last, error: a.error };
      return { ...s, phase: "review", answers };
    }
    case "followUp": {
      if (s.phase !== "review") return s;
      const parent = s.questions[s.index];
      const fu: Question = { ...parent, question: a.question, talkingPoints: [], keywords: [], category: parent.category };
      const questions = [...s.questions.slice(0, s.index + 1), fu, ...s.questions.slice(s.index + 1)];
      return advance({ ...s, questions });
    }
    case "next": {
      if (s.phase !== "review") return s;
      return advance(s);
    }
  }
}
