import { expect, test } from "./test";

test.describe("Mobile - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("goes to every section from the bottom navigation", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation");

    await nav.getByRole("link", { name: "Workouts" }).click();

    await expect(page).toHaveURL(/\/workouts/);

    await nav.getByRole("link", { name: "Catalog" }).click();

    await expect(page).toHaveURL(/\/catalog/);

    await nav.getByRole("link", { name: "Plans" }).click();

    await expect(page).toHaveURL(/\/plans/);

    await nav.getByRole("link", { name: "Measurements" }).click();

    await expect(page).toHaveURL(/\/measurements/);

    await nav.locator('a[href="/profile"]').click();

    await expect(page).toHaveURL(/\/profile/);
  });
});
