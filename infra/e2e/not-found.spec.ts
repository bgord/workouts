import { expect, test } from "./test";

test.describe("Not found - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("shows the page not found for an unknown route", async ({ page }) => {
    await page.goto("/no-such-page");

    await expect(page.getByRole("heading", { level: 1, name: "Nothing on the bar" })).toBeVisible();
    await expect(page.getByText("The page you are looking for does not exist")).toBeVisible();

    await page.getByRole("link", { name: "Back to dashboard" }).click();

    await expect(page).toHaveURL("/");
  });

  test("shows the exercise not found for an unknown exercise", async ({ page }) => {
    await page.goto("/catalog/exercise/00000000-0000-4000-8000-000000000000");

    await expect(page.getByRole("heading", { level: 1, name: "Exercise not found" })).toBeVisible();

    await page.getByRole("link", { name: "Browse the catalog" }).click();

    await expect(page).toHaveURL("/catalog");
  });

  test("shows the plan not found for an unknown plan", async ({ page }) => {
    await page.goto("/plans/00000000-0000-4000-8000-000000000000");

    await expect(page.getByRole("heading", { level: 1, name: "Plan not found" })).toBeVisible();

    await page.getByRole("link", { name: "Go to plans" }).click();

    await expect(page).toHaveURL("/plans");
  });

  test("shows the workout not found for an unknown workout", async ({ page }) => {
    await page.goto("/workouts/00000000-0000-4000-8000-000000000000");

    await expect(page.getByRole("heading", { level: 1, name: "Workout not found" })).toBeVisible();

    await page.getByRole("link", { name: "Go to workouts" }).click();

    await expect(page).toHaveURL(/\/workouts/);
  });
});
