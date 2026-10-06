import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { toErrorResponse } from "@/lib/apiError";
import { client, MODEL, repoSystemBlock } from "@/lib/claude";
import { feedbackMessage } from "@/lib/feedbackMessage";
import { FEEDBACK_PROMPT } from "@/lib/prompts";
import { FeedbackSchema, MetricsSchema, QuestionSchema } from "@/lib/schemas";
import type { RepoFile } from "@/lib/types";

export const maxDuration = 120;

export async function POST(req: Request) {
  const body = await req.json();
  const files = body.files as RepoFile[];
  const question = QuestionSchema.safeParse(body.question);
  const metrics = MetricsSchema.safeParse(body.metrics);
  if (!Array.isArray(files) || !files.length || !question.success || !metrics.success)
    return Response.json({ error: "Missing repo, question or metrics." }, { status: 400 });
  const transcript = String(body.transcript ?? "");

  try {
    const res = await client.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: [repoSystemBlock(files), { type: "text", text: FEEDBACK_PROMPT }],
      messages: [{ role: "user", content: feedbackMessage(question.data, transcript, metrics.data) }],
      output_config: { format: zodOutputFormat(FeedbackSchema) },
    });
    if (!res.parsed_output) throw new Error(`Model returned no feedback (stop_reason: ${res.stop_reason})`);
    return Response.json(res.parsed_output);
  } catch (e) {
    return toErrorResponse(e);
  }
}
