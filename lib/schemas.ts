import { z } from "zod";

export const QuestionSchema = z.object({
  question: z.string().describe("What the interviewer says out loud, conversational"),
  category: z.enum(["design", "tradeoff", "scaling", "edge-case", "testing", "bug", "next-steps", "live-change"]),
  file: z.string().describe("Most relevant file path, or empty string"),
  talkingPoints: z.array(z.string()).describe("3-5 bullet points a strong answer covers, grounded in the actual code"),
  keywords: z.array(z.string()).describe("2-4 short cue words that jog memory without giving the answer"),
});

export type Question = z.infer<typeof QuestionSchema>;

export const QuestionSetSchema = z.object({
  summary: z.string().describe("2-3 sentence plain-English summary of what the project does and how it's built"),
  weakSpots: z.array(z.string()).describe("Things an interviewer will likely poke at: bugs, missing tests, shortcuts"),
  questions: z.array(QuestionSchema),
});

export type QuestionSet = z.infer<typeof QuestionSetSchema>;

export const FeedbackSchema = z.object({
  score: z.number().int().min(1).max(10),
  answeredTheQuestion: z.boolean(),
  strengths: z.array(z.string()),
  improve: z.array(z.string()).describe("Specific, actionable fixes, max 3"),
  missedPoints: z.array(z.string()).describe("Important points from the code they didn't mention"),
  betterAnswer: z.string().describe("A tight 30-45 second spoken answer in first person, natural tone"),
  followUp: z.string().describe("A realistic interviewer follow-up based on what they said, or empty string if none"),
  deliveryNote: z.string().describe("One sentence on delivery based on the metrics: pace, fillers, pauses"),
});

export type Feedback = z.infer<typeof FeedbackSchema>;
