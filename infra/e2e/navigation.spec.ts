import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Navigation - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("goes to every section from the navigation", async ({ page }) => {
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

    await nav.getByRole("link", { name: "Dashboard" }).click();

    await expect(page).toHaveURL("/");
  });

  test("shows the progress bar while the next page loads", async ({ page }) => {
    await page.route("**/api/plans/list", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });
    await page.goto("/");

    await page.getByRole("navigation").getByRole("link", { name: "Plans" }).click();

    await expect(page.getByTestId("navigation-progress")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Plans" })).toBeVisible();
    await expect(page.getByTestId("navigation-progress")).toBeHidden();
  });

  test("marks only the current section as active", async ({ page }) => {
    await page.goto("/workouts");

    const nav = page.getByRole("navigation");

    await expect(nav.getByRole("link", { name: "Workouts" })).toHaveAttribute("data-status", "active");
    await expect(nav.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("data-status", "active");
    await expect(nav.getByRole("link", { name: "Catalog" })).not.toHaveAttribute("data-status", "active");
  });

  test("keeps the section active on a nested page", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    const nav = page.getByRole("navigation");

    await expect(nav.getByRole("link", { name: "Catalog" })).toHaveAttribute("data-status", "active");

    await page.goto("/measurements/body-weight");

    await expect(nav.getByRole("link", { name: "Measurements" })).toHaveAttribute("data-status", "active");
  });

  test("goes back to the dashboard from the logo", async ({ page }) => {
    await page.goto("/plans");

    await page.getByRole("navigation").locator('a[href="/"]').first().click();

    await expect(page).toHaveURL("/");
  });

  test("goes back from the exercise to the catalog", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    await page.getByRole("link", { name: "Back", exact: true }).click();

    await expect(page).toHaveURL(/\/catalog/);
  });

  test("goes back from the plan to the plans", async ({ page }) => {
    await page.goto(`/plans/${fixtures.athlete.plan.id}`);

    await page.getByRole("link", { name: "Back", exact: true }).click();

    await expect(page).toHaveURL(/\/plans/);
  });

  test("goes back from the workout to the filtered workouts list", async ({ page }) => {
    await page.goto("/workouts?filter=all_time");
    await page.locator(`a[href^="/workouts/${fixtures.athlete.scheduledWorkout.id}"]`).click();

    await page.getByRole("link", { name: "Back", exact: true }).click();

    await expect(page).toHaveURL(/\/workouts\?filter=all_time/);
  });

  test("goes back from body weight and body parts to the measurements", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("link", { name: "Back", exact: true }).click();

    await expect(page).toHaveURL(/\/measurements$/);

    await page.goto("/measurements/body-parts");

    await page.getByRole("link", { name: "Back", exact: true }).click();

    await expect(page).toHaveURL(/\/measurements$/);
  });
});
