import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./infra/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: 0,
  workers: process.env["CI"] ? 1 : 4,
  timeout: 10_000,
  reporter: process.env["CI"] ? [["github"], ["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://localhost:3000", trace: "retain-on-failure" },
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "catalog-mutation",
      testMatch: /catalog\.mutation\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
    {
      name: "desktop",
      testIgnore: [/.*\.setup\.ts/, /.*\.mutation\.spec\.ts/, /.*\.mobile\.spec\.ts/, /catalog\.spec\.ts/],
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
    {
      name: "mobile",
      testMatch: /.*\.mobile\.spec\.ts/,
      use: { ...devices["Pixel 10"] },
      dependencies: ["setup"],
    },
    {
      name: "desktop-mutation",
      testMatch: /.*\.mutation\.spec\.ts/,
      testIgnore: [/.*\.mobile\.mutation\.spec\.ts/, /catalog\.mutation\.spec\.ts/],
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
    {
      name: "mobile-mutation",
      testMatch: /.*\.mobile\.mutation\.spec\.ts/,
      use: { ...devices["Pixel 10"] },
      dependencies: ["setup"],
    },
    {
      name: "catalog",
      testMatch: /catalog\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["catalog-mutation"],
    },
  ],
  webServer: [
    {
      command: "bash bgord-scripts/server-start-test.sh",
      stdout: "pipe",
      stderr: "pipe",
      port: 3000,
      name: "bun-backend",
      timeout: process.env["CI"] ? 60_000 : 20_000,
      gracefulShutdown: { signal: "SIGTERM", timeout: 1_000 },
    },
  ],
});
