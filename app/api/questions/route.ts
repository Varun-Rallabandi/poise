import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { missingKeyResponse, toErrorResponse } from "@/lib/apiError";
import { client, MODEL, repoSystemBlock } from "@/lib/claude";
import { QUESTIONS_PROMPT } from "@/lib/prompts";
import { QuestionSetSchema } from "@/lib/schemas";
import type { RepoFile } from "@/lib/types";

export const maxDuration = 300;

export async function POST(req: Request) {
  const noKey = missingKeyResponse();
  if (noKey) return noKey;
  const { files, count = 12, role = "" } = (await req.json()) as { files: RepoFile[]; count?: number; role?: string };
  if (!Array.isArray(files) || files.length === 0)
    return Response.json({ error: "Upload a repo folder first." }, { status: 400 });
  const n = Math.min(Math.max(Math.round(count), 3), 25);

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      thinking: { type: "adaptive" },
      system: [repoSystemBlock(files), { type: "text", text: QUESTIONS_PROMPT }],
      messages: [{ role: "user", content: `Generate ${n} interview questions.${role ? ` The role is: ${role}.` : ""}` }],
      output_config: { format: zodOutputFormat(QuestionSetSchema) },
    });
    const msg = await stream.finalMessage();
    const text = msg.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") throw new Error(`Model returned no answer (stop_reason: ${msg.stop_reason})`);
    return Response.json(QuestionSetSchema.parse(JSON.parse(text.text)));
  } catch (e) {
    return toErrorResponse(e);
  }
}
