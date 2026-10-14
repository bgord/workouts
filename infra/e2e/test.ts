import { test as base, expect } from "@playwright/test";
import { e2eCoverageFixture } from "../../bgord-scripts/e2e-coverage-fixture";

export const test = base.extend<{ pageErrors: void; coverage: void }>({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page);

    page.goto = async (url, options) => {
      const response = await goto(url, options);

      await expect
        .poll(async () => {
          if (page.url().includes("/public/")) return true;

          return (await page.locator("main[data-hydrated]").count()) > 0;
        })
        .toBe(true);

      return response;
    };

    await use(page);
  },
  pageErrors: [
    async ({ page }, use) => {
      await use();

      const errors = await page.pageErrors({ filter: "all" });

      expect(
        errors
          .map((error) => error.message)
          .filter((message) => !message.startsWith("Transition was skipped")),
      ).toEqual([]);
    },
    { auto: true },
  ],
  coverage: [e2eCoverageFixture, { auto: true }],
});

export { expect };
