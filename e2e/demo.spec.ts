import { expect, test } from "@playwright/test";

test("demo session walks through a question", async ({ page }) => {
  // Headless Chrome has no TTS voices or speech recognition; stub just enough to drive the flow.
  await page.addInitScript(() => {
    window.speechSynthesis.speak = (u: SpeechSynthesisUtterance) => setTimeout(() => u.onend?.(new Event("end") as SpeechSynthesisEvent), 50);
    class FakeRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      onresult: ((e: unknown) => void) | null = null;
      onend: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      start() {
        setTimeout(() => {
          const result = Object.assign([{ transcript: "We use base62 slugs with a unique index and retry on collision" }], { isFinal: true });
          this.onresult?.({ resultIndex: 0, results: [result] });
        }, 100);
      }
      stop() {
        this.onend?.();
      }
    }
    // Newer Chrome exposes the unprefixed constructor too, so replace both.
    Object.assign(window, { SpeechRecognition: FakeRecognition, webkitSpeechRecognition: FakeRecognition });
  });

  await page.goto("/");
  await page.getByText("Try a 3-question demo").click();
  await page.getByRole("button", { name: "Start interview" }).click();
  await expect(page.getByText("Question 1 of 3")).toBeVisible();

  await expect(page.getByText("Talking points")).toBeVisible();
  await page.getByRole("button", { name: "Start answering" }).click();
  await expect(page.getByText("base62 slugs")).toBeVisible();
  await page.getByRole("button", { name: "Done answering" }).click();

  await expect(page.getByText("A tighter version")).toBeVisible();
  await page.screenshot({ path: "e2e/.out/review.png", fullPage: true });
});

test("mock interview mode defers feedback to the end", async ({ page }) => {
  await page.addInitScript(() => {
    window.speechSynthesis.speak = (u: SpeechSynthesisUtterance) => setTimeout(() => u.onend?.(new Event("end") as SpeechSynthesisEvent), 20);
    class FakeRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      onresult: ((e: unknown) => void) | null = null;
      onend: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      start() {
        setTimeout(() => this.onresult?.({ resultIndex: 0, results: [Object.assign([{ transcript: "cache it" }], { isFinal: true })] }), 50);
      }
      stop() {
        this.onend?.();
      }
    }
    Object.assign(window, { SpeechRecognition: FakeRecognition, webkitSpeechRecognition: FakeRecognition });
  });
  await page.goto("/");
  await page.getByText("4. Mock interview").click();
  await page.getByText("Try a 3-question demo").click();
  await page.getByRole("button", { name: "Start interview" }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Start answering" }).click();
    await expect(page.getByText("cache it")).toBeVisible();
    await expect(page.getByText("Talking points")).toHaveCount(0);
    await page.getByRole("button", { name: "Done answering" }).click();
    // No per-answer review in mock mode: it goes straight to the next question.
    if (i < 2) await expect(page.getByText(`Question ${i + 2} of 3`)).toBeVisible();
    await expect(page.getByRole("button", { name: /Next question|Finish session/ })).toHaveCount(0);
  }
  await expect(page.getByText("Session done")).toBeVisible();
  // All three answers were graded at the end.
  await expect(page.locator("details summary").filter({ hasText: /\d+\/10/ })).toHaveCount(3);
});
