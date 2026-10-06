import { describe, expect, it } from "vitest";
import { MAX_FILE_CHARS, readRepoFolder, type FileLike } from "@/lib/repo";

const f = (path: string, content: string): FileLike => ({
  name: path.split("/").pop()!,
  webkitRelativePath: path,
  size: content.length,
  text: async () => content,
});

describe("readRepoFolder", () => {
  it("keeps source files and drops noise", async () => {
    const res = await readRepoFolder([
      f("proj/src/index.ts", "export {}"),
      f("proj/node_modules/x/index.js", "junk"),
      f("proj/logo.png", "\u0000"),
    ]);
    expect(res.files.map((x) => x.path)).toEqual(["src/index.ts"]);
    expect(res.skipped).toEqual([]);
  });

  it("reports oversized files instead of silently dropping them", async () => {
    const res = await readRepoFolder([f("proj/big.json", "x".repeat(MAX_FILE_CHARS + 1))]);
    expect(res.files).toHaveLength(0);
    expect(res.skipped).toEqual(["big.json (too large)"]);
  });

  it("tracks total characters", async () => {
    const res = await readRepoFolder([f("p/a.ts", "abc"), f("p/b.ts", "de")]);
    expect(res.totalChars).toBe(5);
  });
});
