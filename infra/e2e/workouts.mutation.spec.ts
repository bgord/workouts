// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Workouts - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });
  test.describe.configure({ mode: "serial" });

  test("schedules a workout", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();
    await page.getByRole("button", { name: "Schedule", exact: true }).click();
    await expect(page).toHaveURL(/\/workouts\/(?!84d48b25)[0-9a-f-]{36}/);
    await page.reload();

    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  });

  test("discards the scheduled workout", async ({ page }) => {
    await page.goto("/workouts");
    await page
      .locator(`a[href^="/workouts/"]:not([href^="/workouts/${fixtures.athlete.scheduledWorkout.id}"])`, {
        hasText: /Draft$/,
      })
      .click();

    await page.getByRole("button", { name: "Discard" }).click();
    await page.getByRole("button", { name: "Discard", exact: true }).last().click();
    await expect(page).toHaveURL(/\/workouts$/);
    await page.reload();

    await expect(
      page.locator(`a[href^="/workouts/"]:not([href^="/workouts/${fixtures.athlete.scheduledWorkout.id}"])`, {
        hasText: /Draft$/,
      }),
    ).toHaveCount(0);
  });

  test("schedules a workout for a chosen section and day", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();
    await page
      .locator("#workout-create")
      .getByText(fixtures.athlete.plan.sections.legs.name, { exact: true })
      .click();
    await page.getByRole("button", { name: "Tomorrow" }).click();
    await page.getByRole("button", { name: "Schedule", exact: true }).click();
    await expect(page).toHaveURL(/\/workouts\/(?!84d48b25)[0-9a-f-]{36}/);
    await page.reload();

    await expect(
      page.getByRole("heading", { level: 1, name: `PPL – ${fixtures.athlete.plan.sections.legs.name}` }),
    ).toBeVisible();
    await expect(page.getByText("Draft", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Discard" }).click();
    await page.getByRole("button", { name: "Discard", exact: true }).last().click();

    await expect(page).toHaveURL(/\/workouts$/);
  });

  test("blocks starting until every exercise has a target", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await expect(page.getByText("Set a target for every exercise")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start" })).toBeDisabled();
  });

  test("sets a target from the progression suggestion", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);
    const exercises = await page.getByRole("button", { name: "Set target" }).count();

    await page.getByRole("button", { name: "Set target" }).first().click();

    const last = page.getByRole("button", { name: "Last", exact: true });
    const progress = page
      .getByTitle(/^Based on the previous session/)
      .getByRole("button")
      .last();

    await expect(last).toHaveAttribute("aria-pressed", "true");
    await expect(progress).toHaveAttribute("aria-pressed", "false");

    await progress.click();

    await expect(progress).toHaveAttribute("aria-pressed", "true");
    await expect(last).toHaveAttribute("aria-pressed", "false");

    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.getByText("Set target")).toHaveCount(exercises - 1);
  });

  test("edits the target with the steppers", async ({ page }) => {
    const row = page.getByRole("listitem").first();

    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await row.getByTitle("Set target").click();
    await row.getByRole("spinbutton", { name: "Reps" }).fill("5");
    await row.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(row.getByTitle("Set target")).toContainText("×5 ");
  });

  test("starts the workout once every exercise has a target", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);
    const exercises = await page.getByText("Set target").count();

    for (let exercise = 0; exercise < exercises; exercise++) {
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

    await page
      .getByRole("button", { name: /^Open panel: / })
      .first()
      .click();
    await page.getByRole("dialog").getByRole("button", { name: "Log set", exact: true }).click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Complete" }).click();

    await expect(page.getByText("Completed", { exact: true })).toBeVisible();
  });

  test("corrects the set of the completed workout", async ({ page }) => {
    const row = page.getByRole("listitem").first();

    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);
    await row.getByRole("button").first().click();

    await row.getByRole("button", { name: "Correct set 1" }).click();
    await row.locator('input[name^="corrected-reps-"]').fill("7");
    await row.locator('input[name^="corrected-load-"]').fill("30");
    await row
      .locator("form")
      .filter({ has: page.locator('input[name^="corrected-reps-"]') })
      .getByRole("button", { name: "Log set", exact: true })
      .click();
    await page.reload();

    await expect(row).toContainText("7×30 kg");
  });

  test("blocks removing the last set of the completed workout", async ({ page }) => {
    const row = page.getByRole("listitem").first();

    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);
    await row.getByRole("button").first().click();

    await expect(row.getByRole("button", { name: "Remove set 1" })).toBeDisabled();
    await expect(page.getByText("A completed workout keeps at least one set")).toBeVisible();
  });

  test("copies the completed workout to the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Copy workout" }).click();

    await expect(page.getByRole("button", { name: "Copy workout" })).toHaveAttribute(
      "title",
      "Copied to the clipboard",
    );

    const copied = await page.evaluate(() => navigator.clipboard.readText());

    expect(copied).toContain(`Workout id: ${fixtures.athlete.scheduledWorkout.id}`);
    expect(copied).toContain("Logged sets: 1");
    expect(copied).toContain("| 1 | 7 | 30 | not recorded |");
  });

  test("removes a set of a past workout", async ({ page }) => {
    const row = page.getByRole("listitem").first();

    await page.goto("/workouts?filter=all_time");
    await page.locator('a[href^="/workouts/"]').nth(1).click();
    await row.getByRole("button").first().click();

    await row.getByRole("button", { name: "Remove set 4" }).click();
    await page.getByRole("button", { name: "Remove", exact: true }).click();
    await page.reload();

    await expect(row.getByRole("button", { name: "Remove set 4" })).toBeHidden();
    await expect(row.getByRole("button", { name: "Remove set 3" })).toBeVisible();
  });
});

test.describe("Workouts - active", () => {
  test.use({ storageState: ".auth/active.json" });
  test.describe.configure({ mode: "serial" });

  test("corrects a logged set", async ({ page }) => {
    const row = page.getByRole("listitem").filter({
      has: page.getByRole("link", {
        name: fixtures.exercises.overheadPressSeatedDumbbells.name,
        exact: true,
      }),
    });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button").first().click();

    await row.getByRole("button", { name: "Correct set 1" }).click();
    await row.locator('input[name^="corrected-reps-"]').fill("9");
    await row.locator('input[name^="corrected-load-"]').fill("22.5");
    await row
      .locator("form")
      .filter({ has: page.locator('input[name^="corrected-reps-"]') })
      .getByRole("button", { name: "Log set", exact: true })
      .click();
    await page.reload();

    await expect(row).toContainText("9×22.5 kg");
  });

  test("removes a logged set", async ({ page }) => {
    const row = page.getByRole("listitem").filter({
      has: page.getByRole("link", { name: fixtures.exercises.superHorizontalBenchPress.name, exact: true }),
    });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button").first().click();

    await row.getByRole("button", { name: "Remove set 4" }).click();
    await page.reload();

    await expect(row.getByRole("button", { name: "Remove set 4" })).toBeHidden();
    await expect(row.getByRole("button", { name: "Remove set 3" })).toBeVisible();
  });

  test("logs a set with reps in reserve", async ({ page }) => {
    const row = page.getByRole("listitem").filter({
      has: page.getByRole("link", { name: fixtures.exercises.tricepsPushDownBar.name, exact: true }),
    });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page
      .getByRole("button", { name: `Open panel: ${fixtures.exercises.tricepsPushDownBar.name}` })
      .click();
    await page.getByRole("dialog").getByRole("button", { name: "Log set · RIR 1" }).click();
    await page.keyboard.press("Escape");
    await page.reload();
    await row.getByRole("button").first().click();

    await expect(row.getByText("RIR 1")).toBeVisible();
  });

  test("adds a note", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Description..." }).click();
    await page.getByLabel("Note").fill("Shoulder felt tight on the last set.");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page.reload();

    await expect(page.getByText("Shoulder felt tight on the last set.")).toBeVisible();
  });

  test("adds an exercise", async ({ page }) => {
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
    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeVisible();
  });

  test("reorders the added exercise", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Reorder exercises" }).click();
    await page.getByRole("button", { name: `Move ${fixtures.exercises.facePull.name} up` }).click();
    await page.reload();

    await expect(page.locator('a[href^="/catalog/exercise/"]').nth(5)).toHaveText(
      fixtures.exercises.facePull.name,
    );
  });

  test("removes an exercise with logged sets", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page
      .getByRole("button", {
        name: `Remove ${fixtures.exercises.overheadPressSeatedDumbbells.name}`,
        exact: true,
      })
      .click();
    await page.getByRole("button", { name: "Remove", exact: true }).click();
    await page.reload();

    await expect(
      page.getByRole("link", {
        name: fixtures.exercises.overheadPressSeatedDumbbells.name,
        exact: true,
      }),
    ).toBeHidden();
  });

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
