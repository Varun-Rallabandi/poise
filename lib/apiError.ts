import Anthropic from "@anthropic-ai/sdk";

/** Turn SDK errors into messages a user can act on. */
export function toErrorResponse(e: unknown): Response {
  if (e instanceof Anthropic.AuthenticationError)
    return Response.json({ error: "ANTHROPIC_API_KEY is missing or invalid. Add it to .env.local." }, { status: 401 });
  if (e instanceof Anthropic.RateLimitError)
    return Response.json({ error: "Rate limited by the API. Wait a few seconds and try again." }, { status: 429 });
  if (e instanceof Anthropic.APIError) return Response.json({ error: e.message }, { status: e.status ?? 500 });
  return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
}
