import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Dashboard - empty", () => {
  test.use({ storageState: ".auth/empty.json" });

  test("shows the empty state", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Nothing scheduled")).toBeVisible();
    await expect(page.getByText("Schedule a workout to see it here")).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to workouts" })).toHaveAttribute("href", "/workouts");
  });

  test("shows zeroed completed sessions", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Completed sessions" })).toBeVisible();
    await expect(page.getByRole("listitem").filter({ hasText: "All time" })).toHaveText("0All time");
  });

  test("hides the workout cards and body weight stats", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Next up" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "In progress" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "Last completed" })).toBeHidden();
    await expect(page.getByText("Latest weight")).toBeHidden();
  });
});

test.describe("Dashboard - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("shows the scheduled workout as next up", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Next up" })).toBeVisible();
    await expect(page.locator(`a[href^="/workouts/${fixtures.athlete.scheduledWorkout.id}"]`)).toBeVisible();
    await expect(page.getByRole("heading", { name: "In progress" })).toBeHidden();
  });

  test("shows the last completed workout", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Last completed" })).toBeVisible();
  });

  test("hides the empty state", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Nothing scheduled")).toBeHidden();
  });

  test("counts all completed sessions", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listitem").filter({ hasText: "All time" })).toHaveText("24All time");
  });

  test("shows the body weight stats with the bulk reference", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Latest weight")).toBeVisible();
    await expect(page.getByText("7-day average")).toBeVisible();
    await expect(page.getByText("Since reference")).toBeVisible();
    await expect(page.getByText(/^Bulk since /)).toBeVisible();
  });

  test("shows the offline bar while the connection is lost", async ({ page, context }) => {
    await page.goto("/");

    await expect(page.getByText("No internet connection detected")).toBeHidden();

    await context.setOffline(true);

    await expect(page.getByText("No internet connection detected")).toBeVisible();

    await context.setOffline(false);

    await expect(page.getByText("No internet connection detected")).toBeHidden();
  });
});

test.describe("Dashboard - active", () => {
  test.use({ storageState: ".auth/active.json" });

  test("shows the workout in progress", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "In progress" })).toBeVisible();
    await expect(page.locator(`a[href^="/workouts/${fixtures.active.workout.id}"]`)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Next up" })).toBeHidden();
  });

  test("hides the empty state and the last completed workout", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Nothing scheduled")).toBeHidden();
    await expect(page.getByRole("heading", { name: "Last completed" })).toBeHidden();
  });

  test("shows zeroed completed sessions", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listitem").filter({ hasText: "All time" })).toHaveText("0All time");
  });
});
