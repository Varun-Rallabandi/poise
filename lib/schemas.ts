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
