import { describe, expect, it } from "vitest";
import { repoSystemBlock } from "@/lib/claude";

describe("repoSystemBlock", () => {
  it("wraps each file with its path and marks the block cacheable", () => {
    const block = repoSystemBlock([
      { path: "src/a.ts", content: "const a = 1;" },
      { path: "README.md", content: "# Hi" },
    ]);
    expect(block.text).toContain('<file path="src/a.ts">\nconst a = 1;\n</file>');
    expect(block.text).toContain('<file path="README.md">');
    expect(block.cache_control).toEqual({ type: "ephemeral" });
  });
});
