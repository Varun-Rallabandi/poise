import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3417);

export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices["Desktop Chrome"],
    permissions: ["camera", "microphone"],
    launchOptions: { args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] },
  },
  webServer: { command: `PORT=${PORT} pnpm dev`, port: PORT, reuseExistingServer: true },
});
