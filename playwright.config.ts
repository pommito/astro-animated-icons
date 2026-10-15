import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:45321",
    ...devices["Desktop Chrome"],
    channel: "chrome",
  },
  webServer: {
    command: "pnpm build && pnpm --filter @grave/animated-icons-playground exec astro preview --ignore-lock --host 127.0.0.1 --port 45321",
    url: "http://127.0.0.1:45321",
    reuseExistingServer: false,
  },
});
