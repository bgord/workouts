// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Workout - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("shows the previous session of every exercise on the scheduled workout", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await expect(page.getByRole("note", { name: "Last session" }).first()).toBeVisible();
    await expect(page.getByRole("note", { name: "Last session" })).toHaveCount(
      await page.getByRole("button", { name: "Set target", exact: true }).count(),
    );
  });

  test("shows the error when changing the date fails", async ({ page }) => {
    const scheduledFor = page.getByLabel("Scheduled for");

    await page.route("**/api/workouts/*/scheduled-for", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await page.getByRole("button", { name: /^Change date/ }).click();
    await scheduledFor.fill((await scheduledFor.getAttribute("min")) ?? "");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not change the date")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: /^Change date/ })).toBeVisible();
  });

  test("lists the actions of the scheduled workout", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();

    await expect(page.getByRole("menuitem", { name: "Add note" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Discard" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Reorder exercises" })).toBeHidden();
    await expect(page.getByRole("menuitem", { name: "Copy workout" })).toBeHidden();
  });

  test("shows the error when discarding the workout fails", async ({ page }) => {
    await page.route(`**/api/workouts/${fixtures.athlete.scheduledWorkout.id}`, (route) =>
      route.request().method() === "DELETE" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Discard" }).click();
    await page
      .getByRole("dialog", { name: "Discard workout" })
      .getByRole("button", { name: "Discard", exact: true })
      .click();

    await expect(page.getByText("Could not discard the workout")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Scheduled", { exact: true })).toBeVisible();
  });

  test("shows the error when setting a target fails", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.pullUp.name, exact: true });

    await page.route("**/api/workouts/*/exercise/*/target", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await row.getByRole("button", { name: "Set target", exact: true }).click();
    await row.getByRole("spinbutton", { name: "Reps" }).fill("5");
    await row.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not set the target")).toBeVisible();

    await page.reload();

    await expect(row.getByRole("button", { name: "Set target", exact: true })).toBeVisible();
  });
});

test.describe("Workout - active", () => {
  test.use({ storageState: ".auth/active.json" });

  test("shows the workout in progress", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await expect(page.getByText("In progress", { exact: true })).toBeVisible();
    await expect(page.getByText("2 of 6 exercises", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Complete" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Start", exact: true })).toBeHidden();
    await expect(page.getByRole("button", { name: /^Change date/ })).toBeHidden();
  });

  test("lists the actions of the workout in progress", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();

    await expect(page.getByRole("menuitem", { name: "Add note" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Reorder exercises" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Discard" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Copy workout" })).toBeHidden();
  });

  test("hides the reorder action while reordering", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Reorder exercises" }).click();

    await page.getByRole("button", { name: "More actions" }).click();

    await expect(page.getByRole("menuitem", { name: "Discard" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Reorder exercises" })).toBeHidden();
  });

  test("switches exercises from the log panel rail", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });
    const rail = panel.getByRole("group", { name: "Exercises" });
    const current = rail.getByRole("button", {
      name: `3. ${fixtures.exercises.tricepsPushDownBar.name}`,
      exact: true,
    });
    const next = rail.getByRole("button", {
      name: `4. ${fixtures.exercises.pecFlyMachine.name}`,
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(panel.getByText(fixtures.exercises.tricepsPushDownBar.name, { exact: true })).toBeVisible();
    await expect(current).toHaveAttribute("aria-current", "step");
    await expect(next).not.toHaveAttribute("aria-current", "step");

    await next.click();

    await expect(panel.getByText(fixtures.exercises.pecFlyMachine.name, { exact: true })).toBeVisible();
    await expect(panel.getByText(fixtures.exercises.tricepsPushDownBar.name, { exact: true })).toBeHidden();
    await expect(next).toHaveAttribute("aria-current", "step");
    await expect(current).not.toHaveAttribute("aria-current", "step");
    await expect(panel.getByText("4 of 6", { exact: true })).toBeVisible();
  });

  test("shows the position, target and progress in the log panel head", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });
    const head = panel.getByRole("group", { name: fixtures.exercises.tricepsPushDownBar.name, exact: true });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(head.getByText("3 of 6", { exact: true })).toBeVisible();
    await expect(head.getByText("3×8 25 kg", { exact: true })).toBeVisible();
    await expect(head.getByRole("img", { name: "0 / 3" })).toBeVisible();
  });

  test("lists every exercise with its progress in the log panel rail", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });
    const rail = panel.getByRole("group", { name: "Exercises" });
    const completed = rail.getByRole("button", {
      name: `1. ${fixtures.exercises.superHorizontalBenchPress.name}`,
      exact: true,
    });
    const started = rail.getByRole("button", {
      name: `2. ${fixtures.exercises.overheadPressSeatedDumbbells.name}`,
      exact: true,
    });
    const current = rail.getByRole("button", {
      name: `3. ${fixtures.exercises.tricepsPushDownBar.name}`,
      exact: true,
    });
    const untouched = rail.getByRole("button", {
      name: `4. ${fixtures.exercises.pecFlyMachine.name}`,
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(rail.getByRole("button")).toHaveCount(6);
    await expect(completed.getByRole("img", { name: "4 / 4" })).toBeVisible();
    await expect(started.getByRole("img", { name: "1 / 3" })).toBeVisible();
    await expect(current.getByRole("img", { name: "0 / 3" })).toBeVisible();
    await expect(untouched.getByRole("img", { name: "0 / 3" })).toBeVisible();
    await expect(completed).toHaveCSS("opacity", "1");
    await expect(started).toHaveCSS("opacity", "1");
    await expect(current).toHaveCSS("opacity", "1");
    await expect(untouched).not.toHaveCSS("opacity", "1");
  });

  test("closes the log panel with the close button", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();

    await panel
      .getByRole("button", { name: `Close panel: ${fixtures.exercises.tricepsPushDownBar.name}` })
      .click();

    await expect(panel).toBeHidden();
  });

  test("switches exercises in the log panel rail with the keyboard", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });
    const rail = panel.getByRole("group", { name: "Exercises" });
    const current = rail.getByRole("button", {
      name: `3. ${fixtures.exercises.tricepsPushDownBar.name}`,
      exact: true,
    });
    const next = rail.getByRole("button", {
      name: `4. ${fixtures.exercises.pecFlyMachine.name}`,
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();
    await current.focus();
    await page.keyboard.press("Tab");

    await expect(next).toBeFocused();

    await page.keyboard.press("Enter");

    await expect(next).toHaveAttribute("aria-current", "step");
    await expect(panel.getByText("4 of 6", { exact: true })).toBeVisible();
  });

  test("resets the log form when switching exercises in the log panel", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });
    const rail = panel.getByRole("group", { name: "Exercises" });
    const reps = panel.getByRole("spinbutton", { name: "Reps" });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();
    await reps.fill("9");

    await expect(reps).toHaveValue("9");

    await rail
      .getByRole("button", { name: `4. ${fixtures.exercises.pecFlyMachine.name}`, exact: true })
      .click();

    await expect(reps).toHaveValue("10");

    await rail
      .getByRole("button", { name: `3. ${fixtures.exercises.tricepsPushDownBar.name}`, exact: true })
      .click();

    await expect(reps).toHaveValue("8");
  });

  test("enables the log form after switching away from a set being corrected in the log panel", async ({
    page,
  }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });
    const rail = panel.getByRole("group", { name: "Exercises" });
    const log = panel.getByRole("form", { name: "Log set" });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();
    await rail
      .getByRole("button", { name: `1. ${fixtures.exercises.superHorizontalBenchPress.name}`, exact: true })
      .click();
    await panel.getByRole("button", { name: "Correct set 1" }).click();

    await expect(panel.getByRole("form", { name: "Correct set 1" })).toBeVisible();
    await expect(log.getByRole("spinbutton", { name: "Reps" })).toBeDisabled();

    await rail
      .getByRole("button", {
        name: `2. ${fixtures.exercises.overheadPressSeatedDumbbells.name}`,
        exact: true,
      })
      .click();

    await expect(panel.getByRole("form", { name: "Correct set 1" })).toBeHidden();
    await expect(log.getByRole("spinbutton", { name: "Reps" })).toBeEnabled();
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
    const panel = page.getByRole("dialog", { name: "Logging panel" });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();
    await panel
      .getByRole("group", { name: "Exercises" })
      .getByRole("button", { name: `4. ${fixtures.exercises.pecFlyMachine.name}`, exact: true })
      .click();
    await page.reload();

    await expect(panel.getByText(fixtures.exercises.pecFlyMachine.name, { exact: true })).toBeVisible();
  });

  test("stops reordering the exercises", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Reorder exercises" }).click();

    await page.getByRole("button", { name: "Done reordering" }).click();

    await expect(page.getByText("Reordering exercises", { exact: true })).toBeHidden();
    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.superHorizontalBenchPress.name} down` }),
    ).toBeHidden();
  });

  test("blocks moving the first exercise up and the last exercise down", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Reorder exercises" }).click();

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

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Add note" }).click();
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
    await page.getByRole("spinbutton", { name: "Max reps", exact: true }).fill("15");
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

  test("closes the add exercise dialog with a single Escape after picking an exercise", async ({ page }) => {
    const dialog = page.getByRole("dialog", { name: "Add exercise" });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByRole("radio", { name: fixtures.exercises.facePull.name }).click();
    await page.keyboard.press("Escape");

    await expect(dialog).toBeHidden();
  });

  test("offers only the applicable progressions for a bodyweight exercise", async ({ page }) => {
    const progression = page.getByRole("combobox", { name: "Progression" });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Add exercise" }).click();
    await progression.selectOption("linear_progression");
    await page.getByRole("searchbox", { name: "Exercise" }).fill(fixtures.exercises.hangingLegRaise.name);
    await page
      .getByRole("radio", {
        name: `${fixtures.exercises.hangingLegRaise.name} ${fixtures.categories.abs.name}`,
        exact: true,
      })
      .click();

    await expect(progression).toHaveValue("double_progression");
    await expect(progression.getByRole("option")).toHaveText([
      "Double progression",
      "Rep progression",
      "No progression",
    ]);
  });

  test("raises the max reps to the min reps when leaving AMRAP", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByRole("button", { name: "AMRAP", exact: true }).click();
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("15");
    await page.getByRole("button", { name: "AMRAP", exact: true }).click();

    await expect(page.getByRole("spinbutton", { name: "Max reps", exact: true })).toHaveValue("15");
  });

  test("shows the error when moving an exercise fails", async ({ page }) => {
    await page.route("**/api/workouts/*/exercise/*/position", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Reorder exercises" }).click();
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

    await page.getByRole("button", { name: "Continue" }).click();
    await page
      .getByRole("dialog", { name: "Logging panel" })
      .getByRole("button", { name: "Log set · RIR 1" })
      .click();

    await expect(page.getByText("Could not log the set")).toBeVisible();
  });

  test("drops the optimistic set when logging fails", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.tricepsPushDownBar.name, exact: true });
    const panel = page.getByRole("dialog", { name: "Logging panel" });
    const head = panel.getByRole("group", { name: fixtures.exercises.tricepsPushDownBar.name, exact: true });
    const current = panel
      .getByRole("group", { name: "Exercises" })
      .getByRole("button", { name: `3. ${fixtures.exercises.tricepsPushDownBar.name}`, exact: true });

    await page.route("**/api/workouts/*/exercise/*/set", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();
    await expect(row.getByRole("button", { name: "Log set", exact: true })).toBeVisible();
    await expect(row.getByRole("button", { name: /^Remove set / })).toHaveCount(0);

    await page.getByRole("button", { name: "Continue" }).click();
    await panel.getByRole("button", { name: "Log set · RIR 1" }).click();
    await expect(page.getByText("Could not log the set")).toBeVisible();
    await expect(head.getByRole("img", { name: "0 / 3" })).toBeVisible();
    await expect(current.getByRole("img", { name: "0 / 3" })).toBeVisible();
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

  test("disables the log form while a set is being corrected, one set at a time", async ({ page }) => {
    const row = page.getByRole("listitem", {
      name: fixtures.exercises.superHorizontalBenchPress.name,
      exact: true,
    });
    const log = row.getByRole("form", { name: "Log set" });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();

    await expect(log.getByRole("spinbutton", { name: "Reps" })).toBeEnabled();

    await row.getByRole("button", { name: "Correct set 1" }).click();

    await expect(row.getByRole("form", { name: "Correct set 1" })).toBeVisible();
    await expect(log.getByRole("spinbutton", { name: "Reps" })).toBeDisabled();

    await row.getByRole("button", { name: "Correct set 2" }).click();

    await expect(row.getByRole("form", { name: "Correct set 2" })).toBeVisible();
    await expect(row.getByRole("form", { name: "Correct set 1" })).toBeHidden();
    await expect(log.getByRole("spinbutton", { name: "Reps" })).toBeDisabled();

    await row.getByRole("button", { name: "Cancel" }).click();

    await expect(log.getByRole("spinbutton", { name: "Reps" })).toBeEnabled();
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

    await expect(page.getByRole("button", { name: "Start", exact: true })).toHaveAccessibleDescription(
      "Complete the workout in progress first",
    );
    await expect(page.getByRole("button", { name: "Start", exact: true })).toBeDisabled();
  });
});
