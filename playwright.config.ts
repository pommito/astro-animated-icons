import { defineConfig, devices } from "@playwright/test";

const baseURL = `http://127.0.0.1:${process.env.ICON_TEST_PORT ?? "45321"}`;

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL,
    ...devices["Desktop Chrome"],
    channel: "chrome",
  },
  webServer: {
    command: "node scripts/fixture.mjs serve",
    url: baseURL,
    reuseExistingServer: false,
    stdout: "pipe",
    gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
  },
});
