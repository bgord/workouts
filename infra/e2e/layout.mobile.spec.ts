// cSpell:ignore networkidle
import * as fixtures from "../../scripts/seed/fixtures";
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

  test("keeps the pages within the viewport width", async ({ page }) => {
    const routes = [
      "/",
      "/workouts",
      `/workouts/${fixtures.athlete.scheduledWorkout.id}`,
      "/catalog",
      `/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`,
      "/plans",
      `/plans/${fixtures.athlete.plan.id}`,
      "/measurements",
      "/measurements/body-weight",
      "/measurements/body-parts",
    ];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );

      expect(overflow, route).toBeLessThanOrEqual(0);
    }
  });

  test("opens the schedule dialog on the workouts list", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();

    await expect(page.locator("#workout-create").getByRole("button", { name: "Schedule" })).toBeVisible();
  });
});
