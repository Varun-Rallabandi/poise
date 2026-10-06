import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, repoSystemBlock } from "@/lib/claude";
import { QUESTIONS_PROMPT } from "@/lib/prompts";
import { QuestionSetSchema } from "@/lib/schemas";
import type { RepoFile } from "@/lib/types";

export const maxDuration = 300;

export async function POST(req: Request) {
  const { files, count = 12 } = (await req.json()) as { files: RepoFile[]; count?: number };

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 32000,
    thinking: { type: "adaptive" },
    system: [repoSystemBlock(files), { type: "text", text: QUESTIONS_PROMPT }],
    messages: [{ role: "user", content: `Generate ${count} interview questions.` }],
    output_config: { format: zodOutputFormat(QuestionSetSchema) },
  });
  const msg = await stream.finalMessage();
  const text = msg.content.find((b) => b.type === "text");
  return Response.json(QuestionSetSchema.parse(JSON.parse(text!.text)));
}
