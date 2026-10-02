// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Workout - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("shows the previous session of every exercise on the scheduled workout", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await expect(page.getByRole("note", { name: "Previous session" }).first()).toBeVisible();
    await expect(page.getByRole("note", { name: "Previous session" })).toHaveCount(
      await page.getByRole("button", { name: "Set target" }).count(),
    );
  });

  test("shows the error when changing the date fails", async ({ page }) => {
    const scheduledFor = page.getByLabel("Scheduled for");

    await page.route("**/api/workouts/*/scheduled-for", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await page.getByRole("button", { name: /^Change the date/ }).click();
    await scheduledFor.fill((await scheduledFor.getAttribute("min")) ?? "");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not change the date")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: /^Change the date/ })).toBeVisible();
  });

  test("shows the error when discarding the workout fails", async ({ page }) => {
    await page.route(`**/api/workouts/${fixtures.athlete.scheduledWorkout.id}`, (route) =>
      route.request().method() === "DELETE" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Discard" }).click();
    await page
      .getByRole("dialog", { name: "Discard workout" })
      .getByRole("button", { name: "Discard" })
      .click();

    await expect(page.getByText("Could not discard the workout")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  });

  test("shows the error when setting a target fails", async ({ page }) => {
    const row = page.getByRole("list", { name: "Exercises" }).getByRole("listitem").first();

    await page.route("**/api/workouts/*/exercise/*/target", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await row.getByRole("button", { name: "Set target" }).click();
    await row.getByRole("spinbutton", { name: "Reps" }).fill("5");
    await row.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not set the target")).toBeVisible();

    await page.reload();

    await expect(row.getByRole("button", { name: "Set target" })).toBeVisible();
  });
});

test.describe("Workout - active", () => {
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

  test("keeps the warm-up expanded and collapsed after reload", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Warm-up" }).click();
    await page.reload();

    await expect(page.getByText("10x Arm Circles forward")).toBeVisible();

    await page.getByRole("button", { name: "Warm-up" }).click();
    await page.reload();

    await expect(page.getByText("10x Arm Circles forward")).toBeHidden();
  });

  test("keeps the cool-down expanded and collapsed after reload", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Cool-down" }).click();
    await page.reload();

    await expect(page.getByText("Doorway chest stretch, 2 minutes each side")).toBeVisible();

    await page.getByRole("button", { name: "Cool-down" }).click();
    await page.reload();

    await expect(page.getByText("Doorway chest stretch, 2 minutes each side")).toBeHidden();
  });

  test("keeps the exercise row expanded and collapsed after reload", async ({ page }) => {
    const row = page.getByRole("listitem", {
      name: fixtures.exercises.overheadPressSeatedDumbbells.name,
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await row.getByRole("button", { name: /^Details: / }).click();
    await page.reload();

    await expect(row.getByRole("button", { name: "Remove set 1" })).toBeVisible();

    await row.getByRole("button", { name: /^Details: / }).click();
    await page.reload();

    await expect(row.getByRole("button", { name: "Remove set 1" })).toBeHidden();
  });

  test("reopens the log panel on the same exercise after reload", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page
      .getByRole("button", { name: `Open panel: ${fixtures.exercises.overheadPressSeatedDumbbells.name}` })
      .click();
    await page.reload();

    await expect(
      page
        .getByRole("dialog", { name: "Logging panel" })
        .getByText(fixtures.exercises.overheadPressSeatedDumbbells.name, { exact: true }),
    ).toBeVisible();
  });

  test("blocks moving the first exercise up and the last exercise down", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Reorder exercises" }).click();

    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.superHorizontalBenchPress.name} up` }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.superHorizontalBenchPress.name} up` }),
    ).toHaveAttribute("title", "Already the first exercise");
    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.superHorizontalBenchPress.name} down` }),
    ).toBeEnabled();
    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.lateralRaiseDumbbells.name} down` }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.lateralRaiseDumbbells.name} down` }),
    ).toHaveAttribute("title", "Already the last exercise");
    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.lateralRaiseDumbbells.name} up` }),
    ).toBeEnabled();
  });

  test("shows the error when saving the note fails", async ({ page }) => {
    await page.route("**/api/workouts/*/note", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "How did it go?" }).click();
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
    await page.getByRole("searchbox", { name: "Exercise" }).fill(fixtures.exercises.facePull.name);
    await page.getByRole("radio", { name: fixtures.exercises.facePull.name }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("12");
    await page.getByRole("spinbutton", { name: "Reps max", exact: true }).fill("15");
    await page
      .getByRole("dialog", { name: "Add exercise" })
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

    await expect(page.getByRole("list", { name: "Exercises" }).getByRole("link").first()).toHaveText(
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

    await expect(page.getByText("Could not remove the exercise")).toBeVisible();

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
    await page
      .getByRole("dialog", { name: "Logging panel" })
      .getByRole("button", { name: "Log set · RIR 1" })
      .click();

    await expect(page.getByText("Could not log the set")).toBeVisible();
  });

  test("drops the optimistic set when logging fails", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.tricepsPushDownBar.name, exact: true });

    await page.route("**/api/workouts/*/exercise/*/set", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();
    await expect(row.getByRole("button", { name: "Log set", exact: true })).toBeVisible();
    await expect(row.getByRole("button", { name: /^Remove set / })).toHaveCount(0);

    await page
      .getByRole("button", { name: `Open panel: ${fixtures.exercises.tricepsPushDownBar.name}` })
      .click();
    await page
      .getByRole("dialog", { name: "Logging panel" })
      .getByRole("button", { name: "Log set · RIR 1" })
      .click();
    await expect(page.getByText("Could not log the set")).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(row.getByRole("button", { name: /^Remove set / })).toHaveCount(0);
  });

  test("shows the error when correcting a set fails", async ({ page }) => {
    const row = page.getByRole("listitem", {
      name: fixtures.exercises.overheadPressSeatedDumbbells.name,
      exact: true,
    });
    const form = row.getByRole("form", { name: "Correct set 1" });

    await page.route("**/api/workouts/*/exercise/*/set/*", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();

    await row.getByRole("button", { name: "Correct set 1" }).click();
    await form.getByRole("spinbutton", { name: "Reps" }).fill("9");
    await form.getByRole("button", { name: "Log set", exact: true }).click();

    await expect(page.getByText("Could not correct the set")).toBeVisible();

    await page.reload();

    await expect(row).not.toContainText("9×");
  });

  test("shows the error when removing a set fails", async ({ page }) => {
    const row = page.getByRole("listitem", {
      name: fixtures.exercises.superHorizontalBenchPress.name,
      exact: true,
    });

    await page.route("**/api/workouts/*/exercise/*/set/*", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();

    await row.getByRole("button", { name: "Remove set 4" }).click();

    await expect(page.getByText("Could not remove the set")).toBeVisible();

    await page.reload();

    await expect(row.getByRole("button", { name: "Remove set 4" })).toBeVisible();
  });

  test("shows the error when completing the workout fails", async ({ page }) => {
    await page.route("**/api/workouts/*/complete", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Complete" }).click();

    await expect(page.getByText("Could not complete the workout")).toBeVisible();

    await page.reload();

    await expect(page.getByText("In progress", { exact: true })).toBeVisible();
  });
});

test.describe("Workout - hoarder", () => {
  test.use({ storageState: ".auth/hoarder.json" });

  test("blocks adding an exercise at the limit", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.hoarder.activeWorkout.id}`);

    await expect(page.getByRole("button", { name: "Add exercise" })).toHaveAccessibleDescription(
      "Remove an exercise to add a new one",
    );
    await expect(page.getByRole("button", { name: "Add exercise" })).toBeDisabled();
  });

  test("blocks starting a second workout", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.hoarder.draftWorkouts.today.id}`);

    await expect(page.getByRole("button", { name: "Start" })).toHaveAccessibleDescription(
      "Finish the workout in progress first",
    );
    await expect(page.getByRole("button", { name: "Start" })).toBeDisabled();
  });
});
