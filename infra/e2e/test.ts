import { test as base, expect } from "@playwright/test";

export const test = base.extend<{ pageErrors: void }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: Array<string> = [];
      page.on("pageerror", (error) => errors.push(error.message));

      await use();

      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
