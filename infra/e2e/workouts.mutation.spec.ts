import { expect, test } from "@playwright/test";

import * as fixtures from "../../scripts/seed/fixtures";

test.describe("Workouts - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });
  test.describe.configure({ mode: "serial" });

  test("schedules a workout", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();
    await page.getByRole("button", { name: "Schedule", exact: true }).click();

    await expect(page).toHaveURL(/\/workouts\/(?!84d48b25)[0-9a-f-]{36}/);
    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  });

  test("discards the scheduled workout", async ({ page }) => {
    await page.goto("/workouts");
    await page.getByRole("link", { name: /Draft$/ }).first().click();

    await page.getByRole("button", { name: "Discard" }).click();
    await page.getByRole("button", { name: "Discard", exact: true }).last().click();

    await expect(page).toHaveURL(/\/workouts$/);
  });

  test("blocks starting until every exercise has a target", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await expect(page.getByText("Set a target for every exercise")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start" })).toBeDisabled();
  });

  test("starts the workout once every exercise has a target", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    for (let exercise = 0; exercise < 6; exercise++) {
      await page.getByText("Set target").first().click();
      await page.getByRole("button", { name: "Last", exact: true }).click();
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByRole("button", { name: "Save" })).toBeHidden();
    }
    await page.getByRole("button", { name: "Start" }).click();

    await expect(page.getByText("In progress", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Start" })).toBeHidden();
  });

  test("blocks completing until a set is logged", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await expect(page.getByText("Log at least one set first")).toBeVisible();
    await expect(page.getByRole("button", { name: "Complete" })).toBeDisabled();
  });

  test("logs a set and completes the workout", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await page.getByRole("button", { name: /^Open panel: / }).first().click();
    await page.getByRole("dialog").getByRole("button", { name: "Log set", exact: true }).click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Complete" }).click();

    await expect(page.getByText("Completed", { exact: true })).toBeVisible();
  });
});

test.describe("Workouts - active", () => {
  test.use({ storageState: ".auth/active.json" });
  test.describe.configure({ mode: "serial" });

  test("completes the workout in progress", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Complete" }).click();

    await expect(page.getByText("Completed", { exact: true })).toBeVisible();
  });

  test("moves the completed workout to the dashboard", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Last completed" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "In progress" })).toBeHidden();
    await expect(page.getByText("Nothing scheduled")).toBeHidden();
  });
});
