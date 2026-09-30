import { expect, test } from "@playwright/test";
import * as fixtures from "../../scripts/seed/fixtures";

test.describe("Workouts - empty", () => {
  test.use({ storageState: ".auth/empty.json" });

  test("shows the empty state", async ({ page }) => {
    await page.goto("/workouts");

    await expect(page.getByText("No workouts yet")).toBeVisible();
    await expect(page.getByText("Schedule one from a finalized plan to start training")).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to plans" })).toHaveAttribute("href", "/plans");
  });

  test("blocks scheduling until a plan is finalized", async ({ page }) => {
    await page.goto("/workouts");

    await expect(page.getByText("Finalize a plan to schedule a workout")).toBeVisible();
    await expect(page.getByRole("button", { name: "New workout" })).toBeDisabled();
  });

  test("hides the history filters", async ({ page }) => {
    await page.goto("/workouts");

    await expect(page.getByLabel("Period")).toBeHidden();
  });
});

test.describe("Workouts - active", () => {
  test.use({ storageState: ".auth/active.json" });

  test("shows the workout in progress", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await expect(page.getByText("In progress", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Complete" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Start" })).toBeHidden();
  });
});

test.describe("Workouts - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("allows scheduling", async ({ page }) => {
    await page.goto("/workouts");

    await expect(page.getByRole("button", { name: "New workout" })).toBeEnabled();
    await expect(page.getByText("No workouts yet")).toBeHidden();
  });

  test("filters the last week by default", async ({ page }) => {
    await page.goto("/workouts");

    await expect(page.getByLabel("Period")).toHaveValue("last_week");
    await expect(page.getByText("25 of 25")).toBeHidden();
  });

  test("lists all workouts for all time", async ({ page }) => {
    await page.goto("/workouts?filter=all_time");

    await expect(page.getByLabel("Period")).toHaveValue("all_time");
    await expect(page.getByText("25 of 25")).toBeVisible();
    await expect(page.locator(`a[href^="/workouts/${fixtures.athlete.scheduledWorkout.id}"]`)).toBeVisible();
  });

  test("changes the period", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByLabel("Period").selectOption("all_time");

    await expect(page).toHaveURL(/filter=all_time/);
    await expect(page.getByText("25 of 25")).toBeVisible();
  });

  test("filters by section and clears the filters", async ({ page }) => {
    await page.goto("/workouts?filter=all_time");

    await page.getByRole("button", { name: fixtures.athlete.plan.sections.push.name }).click();

    await expect(
      page.getByRole("button", { name: fixtures.athlete.plan.sections.push.name }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/^[89] of 25$/)).toBeVisible();

    await page.getByRole("button", { name: "Clear" }).click();

    await expect(page.getByLabel("Period")).toHaveValue("last_week");
    await expect(
      page.getByRole("button", { name: fixtures.athlete.plan.sections.push.name }),
    ).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByRole("button", { name: "Clear" })).toBeHidden();
  });

  test("opens the scheduled workout", async ({ page }) => {
    await page.goto("/workouts?filter=all_time");

    await page.locator(`a[href^="/workouts/${fixtures.athlete.scheduledWorkout.id}"]`).click();

    await expect(page).toHaveURL(new RegExp(`/workouts/${fixtures.athlete.scheduledWorkout.id}`));
    await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  });
});
