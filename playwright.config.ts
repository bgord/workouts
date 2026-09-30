import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./infra/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: 0,
  workers: 1,
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      testIgnore: /.*\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
  webServer: [
    {
      command: "bash bgord-scripts/server-start-test.sh",
      stdout: "pipe",
      stderr: "pipe",
      port: 3000,
      name: "bun-backend",
      timeout: 20_000,
      gracefulShutdown: { signal: "SIGTERM", timeout: 1_000 },
    },
  ],
});
