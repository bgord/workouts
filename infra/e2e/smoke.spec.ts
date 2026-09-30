import { expect, test } from "@playwright/test";

const personas = [
  { name: "empty", header: "Dashboard" },
  { name: "builder", header: "Dashboard" },
  { name: "athlete", header: "Dashboard" },
  { name: "active", header: "Dashboard" },
  { name: "archivist", header: "Dashboard" },
  { name: "polyglot", header: "Pulpit" },
];

for (const persona of personas) {
  test.describe(`Smoke - ${persona.name}`, () => {
    test.use({ storageState: `.auth/${persona.name}.json` });

    test("lands on the dashboard without errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await expect(page.getByRole("heading", { level: 1, name: persona.header })).toBeVisible();
      expect(errors).toEqual([]);
    });
  });
}
