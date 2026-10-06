import { z } from "zod";

export const QuestionSchema = z.object({
  question: z.string().describe("What the interviewer says out loud, conversational"),
  category: z.enum(["design", "tradeoff", "scaling", "edge-case", "testing", "bug", "next-steps", "live-change"]),
  file: z.string().describe("Most relevant file path, or empty string"),
  talkingPoints: z.array(z.string()).describe("3-5 bullet points a strong answer covers, grounded in the actual code"),
  keywords: z.array(z.string()).describe("2-4 short cue words that jog memory without giving the answer"),
});

export type Question = z.infer<typeof QuestionSchema>;
