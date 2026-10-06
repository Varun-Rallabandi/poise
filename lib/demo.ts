import type { Feedback, Metrics, Question, QuestionSet } from "./schemas";

/** A canned session so the room can be tried without an API key or a repo. */
export const DEMO_SET: QuestionSet = {
  summary: "A small Express + Postgres URL shortener with a React dashboard for click analytics.",
  weakSpots: ["No rate limiting on POST /links", "Slug collisions retried without a cap", "No tests for analytics rollups"],
  questions: [
    {
      question: "Walk me through how a short link gets created, from the request coming in to the row in the database.",
      category: "design",
      file: "src/routes/links.ts",
      talkingPoints: ["Validate URL with zod", "Generate 7-char base62 slug", "Insert with unique constraint", "Retry on collision"],
      keywords: ["base62", "unique index", "retry"],
    },
    {
      question: "What happens if this gets a hundred times more traffic tomorrow? What breaks first?",
      category: "scaling",
      file: "src/routes/redirect.ts",
      talkingPoints: ["Redirect path hits Postgres every time", "Add a cache in front (Redis/edge)", "Click logging should be async/batched"],
      keywords: ["cache", "hot path", "batch writes"],
    },
    {
      question: "I noticed there's no rate limiting on link creation. How would you add it, and where?",
      category: "live-change",
      file: "src/routes/links.ts",
      talkingPoints: ["Middleware keyed by IP or API key", "Token bucket in Redis", "Return 429 with Retry-After"],
      keywords: ["middleware", "token bucket", "429"],
    },
  ],
};

/** Offline stand-in for the coach so the UI flow can be exercised without a key. */
export function demoFeedback(q: Question, transcript: string, m: Metrics): Feedback {
  const said = transcript.toLowerCase();
  const hit = q.keywords.filter((k) => said.includes(k.toLowerCase()));
  const missed = q.talkingPoints.filter((p) => !p.toLowerCase().split(/\W+/).some((w) => w.length > 4 && said.includes(w)));
  return {
    score: Math.max(1, Math.min(10, 3 + hit.length * 2 + (m.words > 40 ? 1 : 0))),
    answeredTheQuestion: m.words > 15,
    strengths: hit.length ? [`You mentioned ${hit.join(", ")}.`] : ["You gave it a go, which is the whole point of practice."],
    improve: ["Lead with a one-sentence answer, then the detail.", "Name the specific file or function you changed."],
    missedPoints: missed,
    betterAnswer: `Short version: ${q.talkingPoints[0]}. Then ${q.talkingPoints.slice(1).join(", ").toLowerCase()}.`,
    followUp: "",
    deliveryNote: `Demo mode: ${m.wpm} wpm with ${m.fillers} fillers. Add an API key for real coaching.`,
  };
}
