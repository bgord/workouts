// cSpell:ignore spinbutton
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

  test("steps between exercises in the log panel", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page
      .getByRole("button", { name: `Open panel: ${fixtures.exercises.overheadPressSeatedDumbbells.name}` })
      .click();

    const panel = page.getByRole("dialog", { name: "Logging panel" });

    await expect(
      panel.getByText(fixtures.exercises.overheadPressSeatedDumbbells.name, { exact: true }),
    ).toBeVisible();
    await expect(
      panel.getByRole("button", { name: `Previous: ${fixtures.exercises.superHorizontalBenchPress.name}` }),
    ).toBeEnabled();

    await panel.getByRole("button", { name: /^Next: / }).click();

    await expect(
      panel.getByRole("button", {
        name: `Previous: ${fixtures.exercises.overheadPressSeatedDumbbells.name}`,
      }),
    ).toBeEnabled();
    await expect(
      panel.getByText(fixtures.exercises.overheadPressSeatedDumbbells.name, { exact: true }),
    ).toBeHidden();
  });

  test("shows the error when completing the workout fails", async ({ page }) => {
    await page.route("**/api/workouts/*/complete", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Complete" }).click();

    await expect(page.getByText("Could not complete the workout")).toBeVisible();

    await page.reload();

    await expect(page.getByText("In progress", { exact: true })).toBeVisible();
  });

  test("shows the error when saving the note fails", async ({ page }) => {
    await page.route("**/api/workouts/*/note", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Description..." }).click();
    await page.getByLabel("Note").fill("Shoulder felt tight on the last set.");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not save the note")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Shoulder felt tight on the last set.")).toBeHidden();
  });

  test("shows the error when adding an exercise fails", async ({ page }) => {
    await page.route("**/api/workouts/*/exercise", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByPlaceholder("Search exercises").fill(fixtures.exercises.facePull.name);
    await page.getByRole("list", { name: "Exercise" }).getByText(fixtures.exercises.facePull.name).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("12");
    await page.getByRole("spinbutton", { name: "Reps max", exact: true }).fill("15");
    await page
      .locator("form")
      .filter({ has: page.getByRole("spinbutton", { name: "Sets", exact: true }) })
      .getByRole("button", { name: "Add exercise" })
      .click();

    await expect(page.getByText("Could not add the exercise")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeHidden();
  });

  test("shows the error when moving an exercise fails", async ({ page }) => {
    await page.route("**/api/workouts/*/exercise/*/position", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Reorder exercises" }).click();
    await page
      .getByRole("button", { name: `Move ${fixtures.exercises.overheadPressSeatedDumbbells.name} up` })
      .click();

    await expect(page.getByText("Could not move the exercise")).toBeVisible();

    await page.reload();

    await expect(page.locator('a[href^="/catalog/exercise/"]').first()).toHaveText(
      fixtures.exercises.superHorizontalBenchPress.name,
    );
  });

  test("shows the error when removing an exercise fails", async ({ page }) => {
    await page.route("**/api/workouts/*/exercise/*", (route) =>
      route.request().method() === "DELETE" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page
      .getByRole("button", {
        name: `Remove ${fixtures.exercises.overheadPressSeatedDumbbells.name}`,
        exact: true,
      })
      .click();
    await page.getByRole("button", { name: "Remove", exact: true }).click();

    await expect(page.getByText("Could not remove the exercise").first()).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.overheadPressSeatedDumbbells.name, exact: true }),
    ).toBeVisible();
  });

  test("shows the error when logging a set fails", async ({ page }) => {
    await page.route("**/api/workouts/*/exercise/*/set", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page
      .getByRole("button", { name: `Open panel: ${fixtures.exercises.tricepsPushDownBar.name}` })
      .click();
    await page.getByRole("dialog").getByRole("button", { name: "Log set · RIR 1" }).click();

    await expect(page.getByText("Could not log the set")).toBeVisible();
  });

  test("drops the optimistic set when logging fails", async ({ page }) => {
    const row = page.getByRole("listitem").filter({
      has: page.getByRole("link", {
        name: fixtures.exercises.overheadPressSeatedDumbbells.name,
        exact: true,
      }),
    });

    await page.route("**/api/workouts/*/exercise/*/set", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button").first().click();
    await expect(row.getByRole("button", { name: "Remove set 1" })).toBeVisible();
    const before = await row.getByRole("button", { name: /^Remove set / }).count();

    await page
      .getByRole("button", { name: `Open panel: ${fixtures.exercises.overheadPressSeatedDumbbells.name}` })
      .click();
    await page.getByRole("dialog").getByRole("button", { name: "Log set · RIR 1" }).click();
    await expect(page.getByText("Could not log the set")).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(row.getByRole("button", { name: /^Remove set / })).toHaveCount(before);
  });

  test("shows the error when correcting a set fails", async ({ page }) => {
    const row = page.getByRole("listitem").filter({
      has: page.getByRole("link", {
        name: fixtures.exercises.overheadPressSeatedDumbbells.name,
        exact: true,
      }),
    });

    await page.route("**/api/workouts/*/exercise/*/set/*", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button").first().click();

    await row.getByRole("button", { name: "Correct set 1" }).click();
    await row.locator('input[name^="corrected-reps-"]').fill("9");
    await row
      .locator("form")
      .filter({ has: page.locator('input[name^="corrected-reps-"]') })
      .getByRole("button", { name: "Log set", exact: true })
      .click();

    await expect(page.getByText("Could not correct the set")).toBeVisible();

    await page.reload();

    await expect(row).not.toContainText("9×");
  });

  test("shows the error when removing a set fails", async ({ page }) => {
    const row = page.getByRole("listitem").filter({
      has: page.getByRole("link", { name: fixtures.exercises.superHorizontalBenchPress.name, exact: true }),
    });

    await page.route("**/api/workouts/*/exercise/*/set/*", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button").first().click();

    await row.getByRole("button", { name: "Remove set 4" }).click();

    await expect(page.getByText("Could not remove the set").first()).toBeVisible();

    await page.reload();

    await expect(row.getByRole("button", { name: "Remove set 4" })).toBeVisible();
  });

  test("blocks moving the first exercise up", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Reorder exercises" }).click();

    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.superHorizontalBenchPress.name} up` }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.superHorizontalBenchPress.name} down` }),
    ).toBeEnabled();
  });

  test("blocks moving the last exercise down", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Reorder exercises" }).click();

    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.lateralRaiseDumbbells.name} down` }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.lateralRaiseDumbbells.name} up` }),
    ).toBeEnabled();
  });

  test("shows the warm-up of the section", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByTitle("Toggle warm-up").click();

    await expect(page.getByText("10x Arm Circles forward")).toBeVisible();
  });

  test("shows the cool-down of the section", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByTitle("Toggle cool-down").click();

    await expect(page.getByText("Doorway chest stretch, 2 minutes each side")).toBeVisible();
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

  test("shows the previous session of every exercise on the scheduled workout", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await expect(page.getByTitle("Previous session").first()).toBeVisible();
    await expect(page.getByTitle("Previous session")).toHaveCount(
      await page.getByRole("button", { name: "Set target" }).count(),
    );
  });

  test("offers every plan section and a date when scheduling", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();

    const dialog = page.locator("#workout-create");

    await expect(dialog.getByRole("radio")).toHaveCount(3);
    await expect(dialog.getByRole("radio").first()).toBeChecked();
    await expect(dialog.locator('input[type="date"]')).toBeHidden();

    await dialog.getByRole("button", { name: "Tomorrow" }).click();

    await expect(dialog.getByRole("button", { name: "Tomorrow" })).toHaveAttribute("aria-pressed", "true");

    await dialog.getByRole("button", { name: "Pick" }).click();

    await expect(dialog.locator('input[type="date"]')).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Tomorrow" })).toHaveAttribute("aria-pressed", "false");
  });

  test("shows the error when scheduling the workout fails", async ({ page }) => {
    await page.route("**/api/workouts/create", (route) => route.fulfill({ status: 500 }));
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();
    await page.getByRole("button", { name: "Schedule", exact: true }).click();

    await expect(page.getByText("Could not schedule the workout")).toBeVisible();
    await expect(page).toHaveURL(/\/workouts$/);
  });

  test("shows the error when changing the date fails", async ({ page }) => {
    const scheduledFor = page.getByLabel("Scheduled for");

    await page.route("**/api/workouts/*/scheduled-for", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await page.getByTitle("Change the date").click();
    await scheduledFor.fill((await scheduledFor.getAttribute("min")) ?? "");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not change the date")).toBeVisible();

    await page.reload();

    await expect(page.getByTitle("Change the date")).toBeVisible();
  });

  test("shows the error when discarding the workout fails", async ({ page }) => {
    await page.route(`**/api/workouts/${fixtures.athlete.scheduledWorkout.id}`, (route) =>
      route.request().method() === "DELETE" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Discard" }).click();
    await page.getByRole("button", { name: "Discard", exact: true }).last().click();

    await expect(page.getByText("Could not discard the workout")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  });

  test("shows the error when setting a target fails", async ({ page }) => {
    const row = page.getByRole("listitem").first();

    await page.route("**/api/workouts/*/exercise/*/target", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await row.getByTitle("Set target").click();
    await row.getByRole("spinbutton", { name: "Reps" }).fill("5");
    await row.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not set the target")).toBeVisible();

    await page.reload();

    await expect(row.getByTitle("Set target")).toContainText("Set target");
  });
});
