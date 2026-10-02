import { test as base, expect } from "@playwright/test";
import { e2eCoverageFixture } from "../../bgord-scripts/e2e-coverage-fixture";

export const test = base.extend<{ pageErrors: void; coverage: void }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: Array<string> = [];
      page.on("pageerror", (error) => {
        if (error.message.startsWith("Transition was skipped")) return;
        errors.push(error.message);
      });

      await use();

      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
  coverage: [e2eCoverageFixture, { auto: true }],
});

export { expect };
