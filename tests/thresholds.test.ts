import { describe, expect, it } from "vitest";
import { fillerTone, paceTone, pauseTone } from "@/lib/thresholds";

describe("thresholds", () => {
  it("pace", () => {
    expect(paceTone(140)).toBe("good");
    expect(paceTone(100)).toBe("ok");
    expect(paceTone(210)).toBe("watch");
    expect(paceTone(0)).toBe("ok");
  });
  it("fillers are judged per minute", () => {
    expect(fillerTone(2, 60)).toBe("good");
    expect(fillerTone(5, 60)).toBe("ok");
    expect(fillerTone(5, 30)).toBe("watch");
  });
  it("pauses", () => {
    expect(pauseTone(1.2)).toBe("good");
    expect(pauseTone(4)).toBe("ok");
    expect(pauseTone(7)).toBe("watch");
  });
});
