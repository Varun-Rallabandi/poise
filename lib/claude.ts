import Anthropic from "@anthropic-ai/sdk";

// Server-only: reads ANTHROPIC_API_KEY from the environment.
export const client = new Anthropic();
export const MODEL = "claude-opus-4-8";
