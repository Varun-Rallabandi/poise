import { describe, expect, it } from "vitest";
import { approxTokens, mmss } from "@/lib/format";

describe("format", () => {
  it("estimates tokens", () => {
    expect(approxTokens(400)).toBe("100");
    expect(approxTokens(40_000)).toBe("10k");
  });
  it("formats seconds", () => {
    expect(mmss(0)).toBe("0:00");
    expect(mmss(75.9)).toBe("1:15");
    expect(mmss(-3)).toBe("0:00");
  });
});
