import { describe, expect, it } from "vitest";
import { DEMO_SET } from "@/lib/demo";
import { friendScript } from "@/lib/friend";

describe("friendScript", () => {
  it("numbers every question and includes what to listen for", () => {
    const s = friendScript(DEMO_SET);
    expect(s).toContain("1. Walk me through");
    expect(s).toContain("3. I noticed");
    expect(s).toContain("(Listen for: Validate URL with zod;");
  });
});
