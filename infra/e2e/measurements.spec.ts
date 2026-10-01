import { expect, test } from "./test";

test.describe("Measurements - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("links to body weight and body parts", async ({ page }) => {
    await page.goto("/measurements");

    await expect(page.getByRole("heading", { level: 1, name: "Measurements" })).toBeVisible();
    await expect(page.locator('a[href="/measurements/body-weight"]')).toBeVisible();
    await expect(page.locator('a[href="/measurements/body-parts"]')).toBeVisible();
  });
});
