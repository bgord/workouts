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

    await nav.getByRole("link", { name: "Profile" }).click();

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

    await page.getByRole("navigation").getByRole("link", { name: "Home" }).click();

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

  test("goes back from the exercise to the workout it was opened from", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}?filter=all_time`);
    await page.getByRole("list", { name: "Exercises" }).getByRole("link").first().click();
    await expect(page.getByRole("link", { name: "Back", exact: true })).toHaveAttribute("href", "/catalog");

    await page.getByRole("link", { name: "Back", exact: true }).click();

    await expect(page).toHaveURL(
      new RegExp(`/workouts/${fixtures.athlete.scheduledWorkout.id}\\?filter=all_time`),
    );
  });

  test("goes back from the exercise to the plan it was opened from", async ({ page }) => {
    await page.goto(`/plans/${fixtures.athlete.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();
    await page.locator('a[href^="/catalog/exercise/"]').first().click();
    await expect(page.getByRole("link", { name: "Back", exact: true })).toHaveAttribute("href", "/catalog");

    await page.getByRole("link", { name: "Back", exact: true }).click();

    await expect(page).toHaveURL(new RegExp(`/plans/${fixtures.athlete.plan.id}$`));
  });

  test("links to body weight and body parts", async ({ page }) => {
    await page.goto("/measurements");

    await expect(page.getByRole("heading", { level: 1, name: "Measurements" })).toBeVisible();
    await expect(page.locator('a[href="/measurements/body-weight"]')).toBeVisible();
    await expect(page.locator('a[href="/measurements/body-parts"]')).toBeVisible();
  });

  test("goes back from body weight and body parts to the measurements", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("link", { name: "Back", exact: true }).click();

    await expect(page).toHaveURL(/\/measurements$/);

    await page.goto("/measurements/body-parts");

    await page.getByRole("link", { name: "Back", exact: true }).click();

    await expect(page).toHaveURL(/\/measurements$/);
  });

  test("opens the body weight history filtered by a deep link", async ({ page }) => {
    await page.goto("/measurements/body-weight?month=all");

    await expect(page.getByRole("combobox", { name: "Month" })).toHaveValue("all");
  });

  test("restores the workouts filters on browser back", async ({ page }) => {
    await page.goto("/workouts");
    await page.getByLabel("Period").selectOption({ label: "All time" });
    await expect(page).toHaveURL(/filter=all_time/);
    await page.getByRole("list", { name: "Workouts" }).getByRole("link").first().click();
    await expect(page).toHaveURL(/\/workouts\/[0-9a-f-]{36}/);

    await page.goBack();

    await expect(page).toHaveURL(/\/workouts\?filter=all_time/);
    await expect(page.getByLabel("Period")).toHaveValue("all_time");
  });

  test("goes forward again after going back", async ({ page }) => {
    const card = page.locator(`a[href^="/workouts/${fixtures.athlete.scheduledWorkout.id}"]`);

    await page.goto("/workouts");
    const title = (await card.getByRole("heading", { level: 2 }).textContent()) ?? "";
    await card.click();
    await expect(page).toHaveURL(new RegExp(`/workouts/${fixtures.athlete.scheduledWorkout.id}`));
    await page.goBack();
    await expect(page).toHaveURL(/\/workouts$/);

    await page.goForward();

    await expect(page).toHaveURL(new RegExp(`/workouts/${fixtures.athlete.scheduledWorkout.id}`));
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  });
});
