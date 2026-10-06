import Anthropic from "@anthropic-ai/sdk";

// Server-only: reads ANTHROPIC_API_KEY from the environment.
export const client = new Anthropic();
export const MODEL = "claude-opus-4-8";

import type { RepoFile } from "./types";

/**
 * The repo as one cached system block. It leads the system prompt in every route,
 * so the questions call warms the cache for all the feedback calls that follow.
 */
export function repoSystemBlock(files: RepoFile[]): Anthropic.TextBlockParam {
  const body = files.map((f) => `<file path="${f.path}">\n${f.content}\n</file>`).join("\n\n");
  return {
    type: "text",
    text: `The candidate's take-home project repository:\n\n<repo>\n${body}\n</repo>`,
    cache_control: { type: "ephemeral" },
  };
}
