// cSpell:ignore unpresses
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

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

    await expect(page.getByRole("button", { name: "New workout" })).toHaveAccessibleDescription(
      "Finalize a plan to schedule a workout",
    );
    await expect(page.getByRole("button", { name: "New workout" })).toBeDisabled();
  });

  test("hides the history filters", async ({ page }) => {
    await page.goto("/workouts");

    await expect(page.getByLabel("Period")).toBeHidden();
  });
});

test.describe("Workouts - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("filters the last week by default and changes the period", async ({ page }) => {
    await page.goto("/workouts");

    await expect(page.getByLabel("Period")).toHaveValue("last_week");
    await expect(page.getByText("25 of 25")).toBeHidden();

    await page.getByLabel("Period").selectOption("all_time");

    await expect(page).toHaveURL("/workouts?filter=all_time");
    await expect(page.getByText("25 of 25")).toBeVisible();
  });

  test("lists all workouts for all time", async ({ page }) => {
    await page.goto("/workouts?filter=all_time");

    await expect(page.getByLabel("Period")).toHaveValue("all_time");
    await expect(page.getByText("25 of 25")).toBeVisible();
    await expect(page.locator(`a[href^="/workouts/${fixtures.athlete.scheduledWorkout.id}"]`)).toBeVisible();
  });

  test("filters by section, unpresses it and clears the filters", async ({ page }) => {
    await page.goto("/workouts?filter=all_time");

    await page.getByRole("button", { name: fixtures.athlete.plan.sections.push.name }).click();

    await expect(
      page.getByRole("button", { name: fixtures.athlete.plan.sections.push.name }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/^[89] of 25$/)).toBeVisible();

    await page.getByRole("button", { name: fixtures.athlete.plan.sections.push.name }).click();

    await expect(page.getByText("25 of 25")).toBeVisible();
    await expect(
      page.getByRole("button", { name: fixtures.athlete.plan.sections.push.name }),
    ).toHaveAttribute("aria-pressed", "false");

    await page.getByRole("button", { name: fixtures.athlete.plan.sections.push.name }).click();
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

    await expect(page).toHaveURL(`/workouts/${fixtures.athlete.scheduledWorkout.id}?filter=all_time`);
    await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  });

  test("allows scheduling", async ({ page }) => {
    await page.goto("/workouts");

    await expect(page.getByRole("button", { name: "New workout" })).toBeEnabled();
    await expect(page.getByText("No workouts yet")).toBeHidden();
  });

  test("offers every plan section and a date when scheduling", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();

    const dialog = page.getByRole("dialog", { name: "New workout" });

    await expect(dialog.getByRole("radio")).toHaveCount(3);
    await expect(dialog.getByRole("radio").first()).toBeChecked();
    await expect(dialog.getByRole("textbox", { name: "Date" })).toBeHidden();

    await dialog.getByRole("button", { name: "Tomorrow" }).click();

    await expect(dialog.getByRole("button", { name: "Tomorrow" })).toHaveAttribute("aria-pressed", "true");

    await dialog.getByRole("button", { name: "Pick" }).click();

    await expect(dialog.getByRole("textbox", { name: "Date" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Tomorrow" })).toHaveAttribute("aria-pressed", "false");
  });

  test("shows the error when scheduling the workout fails", async ({ page }) => {
    await page.route("**/api/workouts/create", (route) => route.fulfill({ status: 500 }));
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();
    await page.getByRole("button", { name: "Schedule", exact: true }).click();

    await expect(page.getByText("Could not schedule the workout")).toBeVisible();
    await expect(page).toHaveURL("/workouts");
  });
});

test.describe("Workouts - active", () => {
  test.use({ storageState: ".auth/active.json" });

  test("shows the empty state when no workout matches", async ({ page }) => {
    await page.goto(`/workouts?section=${fixtures.active.plan.sections.pull.id}`);

    await expect(page.getByText("No workouts match the filters")).toBeVisible();
    await expect(page.getByText("Try another section or clear the filters")).toBeVisible();
  });
});
