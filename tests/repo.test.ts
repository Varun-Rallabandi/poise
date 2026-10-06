import { describe, expect, it } from "vitest";
import { isIgnoredPath, isTextFile, stripRootFolder } from "@/lib/repo";

describe("isIgnoredPath", () => {
  it("skips dependency and build folders", () => {
    expect(isIgnoredPath("node_modules/react/index.js")).toBe(true);
    expect(isIgnoredPath("web/.next/server/page.js")).toBe(true);
    expect(isIgnoredPath("api/__pycache__/x.pyc")).toBe(true);
  });
  it("skips lockfiles and minified bundles", () => {
    expect(isIgnoredPath("pnpm-lock.yaml")).toBe(true);
    expect(isIgnoredPath("public/vendor.min.js")).toBe(true);
  });
  it("keeps normal source files", () => {
    expect(isIgnoredPath("src/app.ts")).toBe(false);
    expect(isIgnoredPath("src/builder.ts")).toBe(false);
  });
});

describe("isTextFile", () => {
  it("accepts source and config", () => {
    for (const p of ["a.ts", "b.py", "c.go", "Dockerfile", "docs/README", "x.yml"]) expect(isTextFile(p)).toBe(true);
  });
  it("rejects binaries", () => {
    for (const p of ["logo.png", "font.woff2", "db.sqlite"]) expect(isTextFile(p)).toBe(false);
  });
});

describe("stripRootFolder", () => {
  it("drops the picked folder name", () => {
    expect(stripRootFolder("takehome/src/a.ts")).toBe("src/a.ts");
    expect(stripRootFolder("a.ts")).toBe("a.ts");
  });
});
