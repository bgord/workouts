// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Workouts - athlete-mutation", () => {
  test.use({ storageState: ".auth/athlete-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("rejects a date beyond the scheduling horizon", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();
    await page.getByRole("button", { name: "Other" }).click();
    await page.getByRole("textbox", { name: "Date" }).fill("2099-01-01");
    await page.getByRole("button", { name: "Schedule", exact: true }).click();

    await expect(page.getByRole("textbox", { name: "Date" }).and(page.locator(":invalid"))).toHaveCount(1);
    await expect(page).toHaveURL("/workouts");
  });

  test("schedules a workout", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();
    await page.getByRole("button", { name: "Schedule", exact: true }).click();
    await expect(page).toHaveURL(/\/workouts\/[0-9a-f-]{36}/);
    await page.reload();

    await expect(page.getByText("Scheduled", { exact: true })).toBeVisible();
  });

  test("schedules a workout for a chosen section and day", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();
    await page
      .getByRole("dialog", { name: "New workout" })
      .getByText(fixtures.athleteMutation.plan.sections.legs.name, { exact: true })
      .click();
    await page.getByRole("button", { name: "Tomorrow" }).click();
    await page.getByRole("button", { name: "Schedule", exact: true }).click();
    await expect(page).toHaveURL(/\/workouts\/[0-9a-f-]{36}/);
    await page.reload();

    await expect(
      page.getByRole("heading", { level: 1, name: fixtures.athleteMutation.plan.sections.legs.name }),
    ).toBeVisible();
    await expect(page.getByText("Scheduled", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Discard" }).click();
    await page
      .getByRole("dialog", { name: "Discard workout" })
      .getByRole("button", { name: "Discard", exact: true })
      .click();

    await expect(page).toHaveURL("/workouts");
  });

  test("summarizes the previous session with identical reps", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();
    await page
      .getByRole("dialog", { name: "New workout" })
      .getByText(fixtures.athleteMutation.plan.sections.pull.name, { exact: true })
      .click();
    await page.getByRole("button", { name: "Tomorrow" }).click();
    await page.getByRole("button", { name: "Schedule", exact: true }).click();
    await expect(page).toHaveURL(/\/workouts\/[0-9a-f-]{36}/);

    await expect(
      page
        .getByRole("listitem", { name: fixtures.exercises.pullUp.name, exact: true })
        .getByRole("note", { name: "Last session" })
        .getByText("4×4 17.5 kg", { exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Discard" }).click();
    await page
      .getByRole("dialog", { name: "Discard workout" })
      .getByRole("button", { name: "Discard", exact: true })
      .click();

    await expect(page).toHaveURL("/workouts");
  });

  test("summarizes the previous unilateral session per side", async ({ page }) => {
    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();
    await page
      .getByRole("dialog", { name: "New workout" })
      .getByText(fixtures.athleteMutation.plan.sections.legs.name, { exact: true })
      .click();
    await page.getByRole("button", { name: "Tomorrow" }).click();
    await page.getByRole("button", { name: "Schedule", exact: true }).click();
    await expect(page).toHaveURL(/\/workouts\/[0-9a-f-]{36}/);

    await expect(
      page
        .getByRole("listitem", { name: fixtures.exercises.legExtensionSingleLeg.name, exact: true })
        .getByRole("note", { name: "Last session" })
        .getByText("10·10·9×25 kg / side", { exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Discard" }).click();
    await page
      .getByRole("dialog", { name: "Discard workout" })
      .getByRole("button", { name: "Discard", exact: true })
      .click();

    await expect(page).toHaveURL("/workouts");
  });

  test("blocks starting a workout with no exercises", async ({ page }) => {
    const links = page.getByRole("list", { name: "Exercises" }).getByRole("link");
    const draft = page
      .getByRole("link", { name: /Scheduled$/ })
      .and(page.locator(`:not([data-testid="workout-${fixtures.athleteMutation.scheduledWorkout.id}"])`));

    await page.goto("/workouts");
    await draft.click();
    await expect(links.first()).toBeVisible();
    const exercises = await links.count();

    for (let exercise = 0; exercise < exercises; exercise++) {
      await page
        .getByRole("button", { name: /^Remove / })
        .first()
        .click();
      await expect(links).toHaveCount(exercises - exercise - 1);
    }
    await page.reload();

    await expect(page.getByRole("button", { name: "Start", exact: true })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Start", exact: true })).toHaveAccessibleDescription(
      "Add an exercise first",
    );
    await expect(page.getByText("No exercises yet")).toBeVisible();
  });

  test("reschedules the draft workout", async ({ page }) => {
    const scheduledFor = page.getByLabel("Scheduled for");
    const draft = page
      .getByRole("link", { name: /Scheduled$/ })
      .and(page.locator(`:not([data-testid="workout-${fixtures.athleteMutation.scheduledWorkout.id}"])`));

    await page.goto("/workouts");
    await draft.click();
    await page.getByRole("button", { name: /^Change date/ }).click();
    const date = (await scheduledFor.getAttribute("max")) ?? "";

    await scheduledFor.fill(date);
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: /^Change date/ })).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: /^Change date/ }).click();

    await expect(scheduledFor).toHaveValue(date);
  });

  test("discards the scheduled workout", async ({ page }) => {
    const draft = page
      .getByRole("link", { name: /Scheduled$/ })
      .and(page.locator(`:not([data-testid="workout-${fixtures.athleteMutation.scheduledWorkout.id}"])`));

    await page.goto("/workouts");
    await draft.click();
    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Discard" }).click();
    await page
      .getByRole("dialog", { name: "Discard workout" })
      .getByRole("button", { name: "Discard", exact: true })
      .click();
    await expect(page).toHaveURL("/workouts");
    await page.reload();

    await expect(draft).toHaveCount(0);
  });

  test("blocks starting until every exercise has a target", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);

    await expect(page.getByRole("button", { name: "Start", exact: true })).toHaveAccessibleDescription(
      "Set every target first",
    );
    await expect(page.getByRole("button", { name: "Start", exact: true })).toBeDisabled();
  });

  test("rejects a target out of range", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.pullUp.name, exact: true });

    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);

    await row.getByRole("button", { name: "Set target", exact: true }).click();
    await row.getByRole("spinbutton", { name: "Reps" }).fill("101");
    await row.getByRole("button", { name: "Save", exact: true }).click();

    await expect(row.getByRole("spinbutton", { name: "Reps" }).and(page.locator(":invalid"))).toHaveCount(1);

    await row.getByRole("spinbutton", { name: "Reps" }).fill("5");
    await row.getByRole("spinbutton", { name: "Load (kg)" }).fill("10.25");
    await row.getByRole("button", { name: "Save", exact: true }).click();

    await expect(
      row.getByRole("spinbutton", { name: "Load (kg)" }).and(page.locator(":invalid")),
    ).toHaveCount(1);

    await page.reload();

    await expect(row.getByRole("button", { name: "Set target", exact: true })).toBeVisible();
  });

  test("sets a target from the progression suggestion", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);
    const exercises = await page.getByRole("button", { name: "Set target", exact: true }).count();

    await page
      .getByRole("listitem", { name: fixtures.exercises.pullUp.name, exact: true })
      .getByRole("button", { name: "Set target", exact: true })
      .click();

    const suggestion = page.getByRole("group", { name: /^Based on the last session/ });
    const last = suggestion.getByRole("button", { name: "Last", exact: true });
    const progress = suggestion.getByRole("button", { name: /^\+/ });

    await expect(last).toHaveAttribute("aria-pressed", "true");
    await expect(progress).toHaveAttribute("aria-pressed", "false");

    await progress.click();

    await expect(progress).toHaveAttribute("aria-pressed", "true");
    await expect(last).toHaveAttribute("aria-pressed", "false");

    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Set target", exact: true })).toHaveCount(exercises - 1);

    await page.reload();

    await expect(page.getByRole("button", { name: "Set target", exact: true })).toHaveCount(exercises - 1);
  });

  test("edits the target with the steppers", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.pullUp.name, exact: true });

    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);

    await row.getByRole("button", { name: /^Edit target/ }).click();
    await row.getByRole("spinbutton", { name: "Reps" }).fill("1");
    await row.getByRole("button", { name: "Save", exact: true }).click();

    await expect(row).toContainText("×1 ");

    await page.reload();

    await expect(row).toContainText("×1 ");
  });

  test("sets an AMRAP target from the rep progression suggestion", async ({ page }) => {
    const row = page.getByRole("listitem", {
      name: fixtures.exercises.lateralRaiseDumbbells.name,
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Add exercise" }).click();
    await page
      .getByRole("searchbox", { name: "Exercise" })
      .fill(fixtures.exercises.lateralRaiseDumbbells.name);
    await page.getByRole("radio", { name: fixtures.exercises.lateralRaiseDumbbells.name }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("8");
    await page.getByRole("button", { name: "AMRAP", exact: true }).click();
    await page
      .getByRole("group", { name: "Progression" })
      .getByText("Rep progression", { exact: true })
      .click();
    await page
      .getByRole("dialog", { name: "Add exercise" })
      .getByRole("button", { name: "Add exercise" })
      .click();
    await row.getByRole("button", { name: "Set target", exact: true }).click();
    await row
      .getByRole("group", { name: /^Based on the last session/ })
      .getByRole("button", { name: "+1 rep", exact: true })
      .click();

    await expect(row.getByRole("spinbutton", { name: "Min reps", exact: true })).toHaveValue("9");

    await row.getByRole("button", { name: "Save", exact: true }).click();

    await expect(row.getByRole("button", { name: "Edit target: 3×9+ 10.5 kg", exact: true })).toBeVisible();

    await page.reload();

    await expect(row.getByRole("button", { name: "Edit target: 3×9+ 10.5 kg", exact: true })).toBeVisible();
  });

  test("holds the progression when the last session was below the target RIR", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.pecFlyMachine.name, exact: true });
    const suggestion = row.getByRole("group", {
      name: "Based on the last session · Double progression",
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByRole("searchbox", { name: "Exercise" }).fill(fixtures.exercises.pecFlyMachine.name);
    await page.getByRole("radio", { name: fixtures.exercises.pecFlyMachine.name }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("10");
    await page.getByRole("spinbutton", { name: "Max reps", exact: true }).fill("12");
    await page
      .getByRole("group", { name: "Target RIR" })
      .getByRole("button", { name: "RIR 2", exact: true })
      .click();
    await page
      .getByRole("dialog", { name: "Add exercise" })
      .getByRole("button", { name: "Add exercise" })
      .click();

    await expect(row.getByText("3×10-12", { exact: true })).toBeVisible();
    await expect(row.getByTitle("Target RIR", { exact: true })).toHaveText("RIR 2");

    await row.getByRole("button", { name: "Set target", exact: true }).click();

    await expect(suggestion.getByText("Below RIR 2 last time, repeat it", { exact: true })).toBeVisible();
    await expect(suggestion.getByRole("button")).toHaveText(["−2.5 kg", "Last"]);

    await row.getByRole("button", { name: "Save", exact: true }).click();

    await expect(row.getByRole("button", { name: "Edit target: 3×9 45 kg", exact: true })).toBeVisible();

    await page.reload();

    await expect(row.getByRole("button", { name: "Edit target: 3×9 45 kg", exact: true })).toBeVisible();
  });

  test("shows the error when starting the workout fails", async ({ page }) => {
    await page.route("**/api/workouts/*/start", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);
    const exercises = await page.getByRole("button", { name: "Set target", exact: true }).count();

    for (let exercise = 0; exercise < exercises; exercise++) {
      await page.getByRole("button", { name: "Set target", exact: true }).first().click();
      await page.getByRole("button", { name: "Last", exact: true }).click();
      await page.getByRole("button", { name: "Save", exact: true }).click();
      await expect(page.getByRole("button", { name: "Set target", exact: true })).toHaveCount(
        exercises - exercise - 1,
      );
    }
    await page.getByRole("button", { name: "Start", exact: true }).click();

    await expect(page.getByText("Could not start the workout")).toBeVisible();
    await expect(page.getByText("In progress", { exact: true })).toBeHidden();
  });

  test("starts the workout once every exercise has a target", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);
    const exercises = await page.getByRole("button", { name: "Set target", exact: true }).count();

    for (let exercise = 0; exercise < exercises; exercise++) {
      await page.getByRole("button", { name: "Set target", exact: true }).first().click();
      await page.getByRole("button", { name: "Last", exact: true }).click();
      await page.getByRole("button", { name: "Save", exact: true }).click();
      await expect(page.getByRole("button", { name: "Set target", exact: true })).toHaveCount(
        exercises - exercise - 1,
      );
    }
    await page.getByRole("button", { name: "Start", exact: true }).click();

    await expect(page.getByText("In progress", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Start", exact: true })).toBeHidden();
  });

  test("blocks completing until a set is logged", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);

    await expect(page.getByRole("button", { name: "Complete" })).toHaveAccessibleDescription(
      "Log at least one set first",
    );
    await expect(page.getByRole("button", { name: "Complete" })).toBeDisabled();
  });

  test("logs a set and completes the workout", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Continue" }).click();
    await page
      .getByRole("dialog", { name: "Logging panel" })
      .getByRole("button", { name: "Log set", exact: true })
      .click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Complete" }).click();

    await expect(page.getByRole("img", { name: "Completed" })).toBeVisible();
  });

  test("rejects a set correction out of range", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.pullUp.name, exact: true });
    const form = row.getByRole("form", { name: "Correct set 1" });

    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();

    const before = await row.textContent();

    await row.getByRole("button", { name: "Correct set 1" }).click();
    await form.getByRole("spinbutton", { name: "Reps" }).fill("0");
    await form.getByRole("button", { name: "Log set", exact: true }).click();

    await expect(form.getByRole("spinbutton", { name: "Reps" }).and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(row).toHaveText(before ?? "");
  });

  test("corrects the set of the completed workout", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.pullUp.name, exact: true });
    const form = row.getByRole("form", { name: "Correct set 1" });

    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();

    await row.getByRole("button", { name: "Correct set 1" }).click();
    await form.getByRole("spinbutton", { name: "Reps" }).fill("7");
    await form.getByRole("spinbutton", { name: "Load (kg)" }).fill("30");
    await form.getByRole("button", { name: "Log set", exact: true }).click();

    await expect(row.getByText("7×30 kg", { exact: true })).toBeVisible();

    await page.reload();

    await expect(row.getByText("7×30 kg", { exact: true })).toBeVisible();
  });

  test("blocks removing the last set of the completed workout", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.pullUp.name, exact: true });

    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();

    await expect(row.getByRole("button", { name: "Remove set 1" })).toBeDisabled();
    await expect(row.getByRole("button", { name: "Remove set 1" })).toHaveAccessibleDescription(
      "A completed workout keeps at least one set",
    );
  });

  test("copies the completed workout to the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(`/workouts/${fixtures.athleteMutation.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Copy workout" }).click();

    await expect(page.getByRole("menuitem", { name: "Copied" })).toBeVisible();

    const copied = await page.evaluate(() => navigator.clipboard.readText());

    expect(copied).toContain(`Workout id: ${fixtures.athleteMutation.scheduledWorkout.id}`);
    expect(copied).toContain("Logged sets: 1");
    expect(copied).toContain("| 1 | 7 | 30 | both | not recorded |");
  });

  test("removes a set of a past workout", async ({ page }) => {
    const row = page.getByRole("list", { name: "Exercises" }).getByRole("listitem").first();

    await page.goto("/workouts?filter=all_time");
    await page.getByRole("list", { name: "Workouts" }).getByRole("link").nth(1).click();
    await row.getByRole("button", { name: /^Details: / }).click();

    await row.getByRole("button", { name: "Remove set 4" }).click();
    await page.getByRole("button", { name: "Remove", exact: true }).click();

    await expect(row.getByRole("button", { name: "Remove set 4" })).toBeHidden();
    await expect(row.getByRole("button", { name: "Remove set 3" })).toBeVisible();

    await page.reload();

    await expect(row.getByRole("button", { name: "Remove set 4" })).toBeHidden();
    await expect(row.getByRole("button", { name: "Remove set 3" })).toBeVisible();
  });

  test("blocks scheduling a fourth workout", async ({ page }) => {
    for (let draft = 0; draft < 3; draft++) {
      await page.goto("/workouts");
      await page.getByRole("button", { name: "New workout" }).click();
      await page.getByRole("button", { name: "Schedule", exact: true }).click();
      await expect(page).toHaveURL(/\/workouts\/[0-9a-f-]{36}/);
    }

    await page.goto("/workouts");

    await expect(page.getByRole("button", { name: "New workout" })).toHaveAccessibleDescription(
      "Start or discard a scheduled workout first",
    );
    await expect(page.getByRole("button", { name: "New workout" })).toBeDisabled();
  });
});

test.describe("Workouts - active-mutation", () => {
  test.use({ storageState: ".auth/active-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("blocks logging a set with reps missing or out of range", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();

    const panel = page.getByRole("dialog", { name: "Logging panel" });

    await panel.getByRole("spinbutton", { name: "Reps" }).fill("");

    await expect(panel.getByRole("button", { name: "Log set", exact: true })).toBeDisabled();

    await panel.getByRole("spinbutton", { name: "Reps" }).fill("101");

    await expect(panel.getByRole("button", { name: "Log set", exact: true })).toBeDisabled();
  });

  test("logs a set with reps in reserve", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.tricepsPushDownBar.name, exact: true });

    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();
    await page
      .getByRole("dialog", { name: "Logging panel" })
      .getByRole("button", { name: "Log set · RIR 1" })
      .click();
    await expect(page.locator("[aria-busy=true]")).toHaveCount(0);
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", { name: `Details: ${fixtures.exercises.tricepsPushDownBar.name}`, exact: true })
      .click();

    await expect(row.getByText("RIR 1")).toBeVisible();

    await page.reload();

    await expect(row.getByText("RIR 1")).toBeVisible();
  });

  test("unlocks scrolling after logging a set and closing the panel with Escape", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();
    await page
      .getByRole("dialog", { name: "Logging panel" })
      .getByRole("button", { name: "Log set", exact: true })
      .click();
    await expect(page.locator("[aria-busy=true]")).toHaveCount(0);
    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog", { name: "Logging panel" })).toBeHidden();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("unlocks scrolling after logging a set and closing the panel by clicking away", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();
    await page
      .getByRole("dialog", { name: "Logging panel" })
      .getByRole("button", { name: "Log set", exact: true })
      .click();
    await expect(page.locator("[aria-busy=true]")).toHaveCount(0);
    await page.mouse.click(1, 1);

    await expect(page.getByRole("dialog", { name: "Logging panel" })).toBeHidden();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("rejects a logged set correction out of range", async ({ page }) => {
    const row = page.getByRole("listitem", {
      name: fixtures.exercises.overheadPressSeatedDumbbells.name,
      exact: true,
    });
    const form = row.getByRole("form", { name: "Correct set 1" });

    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();

    const before = await row.textContent();

    await row.getByRole("button", { name: "Correct set 1" }).click();
    await form.getByRole("spinbutton", { name: "Load (kg)" }).fill("1001");
    await form.getByRole("button", { name: "Log set", exact: true }).click();

    await expect(
      form.getByRole("spinbutton", { name: "Load (kg)" }).and(page.locator(":invalid")),
    ).toHaveCount(1);

    await page.reload();

    await expect(row).toHaveText(before ?? "");
  });

  test("corrects a logged set", async ({ page }) => {
    const row = page.getByRole("listitem", {
      name: fixtures.exercises.overheadPressSeatedDumbbells.name,
      exact: true,
    });
    const form = row.getByRole("form", { name: "Correct set 1" });

    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();

    await row.getByRole("button", { name: "Correct set 1" }).click();
    await form.getByRole("spinbutton", { name: "Reps" }).fill("9");
    await form.getByRole("spinbutton", { name: "Load (kg)" }).fill("22.5");
    await form.getByRole("button", { name: "Log set", exact: true }).click();

    await expect(row.getByText("9×22.5 kg", { exact: true })).toBeVisible();

    await page.reload();

    await expect(row.getByText("9×22.5 kg", { exact: true })).toBeVisible();
  });

  test("removes a logged set", async ({ page }) => {
    const row = page.getByRole("listitem", {
      name: fixtures.exercises.superHorizontalBenchPress.name,
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);
    await row.getByRole("button", { name: /^Details: / }).click();

    await row.getByRole("button", { name: "Remove set 4" }).click();

    await expect(row.getByRole("button", { name: "Remove set 4" })).toBeHidden();
    await expect(row.getByRole("button", { name: "Remove set 3" })).toBeVisible();

    await page.reload();

    await expect(row.getByRole("button", { name: "Remove set 4" })).toBeHidden();
    await expect(row.getByRole("button", { name: "Remove set 3" })).toBeVisible();
  });

  test("corrects a logged set from the log panel", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });
    const rail = panel.getByRole("toolbar", { name: "Exercises" });
    const overhead = rail.getByRole("button", {
      name: `2. ${fixtures.exercises.overheadPressSeatedDumbbells.name}`,
      exact: true,
    });
    const form = panel.getByRole("form", { name: "Correct set 1" });

    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();
    await overhead.click();
    await panel.getByRole("button", { name: "Correct set 1" }).click();
    await form.getByRole("spinbutton", { name: "Reps" }).fill("10");
    await form.getByRole("button", { name: "Log set", exact: true }).click();

    await expect(panel.getByText("10×22.5 kg", { exact: true })).toBeVisible();

    await page.reload();

    await expect(panel.getByText("10×22.5 kg", { exact: true })).toBeVisible();
  });

  test("removes a logged set from the log panel", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });
    const rail = panel.getByRole("toolbar", { name: "Exercises" });
    const bench = rail.getByRole("button", {
      name: `1. ${fixtures.exercises.superHorizontalBenchPress.name}`,
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);
    await page.getByRole("button", { name: "Continue" }).click();
    await bench.click();
    await panel.getByRole("button", { name: "Remove set 3" }).click();

    await expect(panel.getByRole("button", { name: "Remove set 3" })).toBeHidden();
    await expect(panel.getByRole("button", { name: "Remove set 2" })).toBeVisible();

    await page.reload();

    await expect(panel.getByRole("button", { name: "Remove set 3" })).toBeHidden();
    await expect(panel.getByRole("button", { name: "Remove set 2" })).toBeVisible();
  });

  test("blocks saving an empty note", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Add note" }).click();

    await expect(page.getByLabel("Note")).toHaveValue("");
    await expect(page.getByRole("button", { name: "Save", exact: true })).toBeDisabled();
  });

  test("adds a note", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Add note" }).click();
    await page.getByLabel("Note").fill("Shoulder felt tight on the last set.");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Shoulder felt tight on the last set." })).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "More actions" }).click();

    await expect(page.getByRole("button", { name: "Shoulder felt tight on the last set." })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Edit note" })).toBeVisible();
  });

  test("clears the note", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

    await page.getByRole("button", { name: "Shoulder felt tight on the last set." }).click();
    await page.getByLabel("Note").fill("");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Shoulder felt tight on the last set.")).toBeHidden();

    await page.reload();
    await page.getByRole("button", { name: "More actions" }).click();

    await expect(page.getByRole("menuitem", { name: "Add note" })).toBeVisible();
    await expect(page.getByText("Shoulder felt tight on the last set.")).toBeHidden();
  });

  test("rejects an exercise with invalid sets and reps range", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByRole("searchbox", { name: "Exercise" }).fill(fixtures.exercises.facePull.name);
    await page.getByRole("radio", { name: fixtures.exercises.facePull.name }).click();

    const dialog = page.getByRole("dialog", { name: "Add exercise" });

    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("21");
    await dialog.getByRole("button", { name: "Add exercise" }).click();

    await expect(
      dialog.getByRole("spinbutton", { name: "Sets", exact: true }).and(page.locator(":invalid")),
    ).toHaveCount(1);

    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("12");
    await page.getByRole("spinbutton", { name: "Max reps", exact: true }).fill("8");
    await dialog.getByRole("button", { name: "Add exercise" }).click();

    await expect(
      dialog.getByRole("spinbutton", { name: "Max reps", exact: true }).and(page.locator(":invalid")),
    ).toHaveCount(1);

    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeHidden();
  });

  test("adds an exercise", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

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

    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeVisible();
  });

  test("reorders the added exercise", async ({ page }) => {
    const exercises = page.getByRole("list", { name: "Exercises" }).getByRole("link");

    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Reorder exercises" }).click();
    await page.getByRole("button", { name: `Move ${fixtures.exercises.facePull.name} up` }).click();

    await expect(exercises.nth(5)).toHaveText(fixtures.exercises.facePull.name);

    await page.reload();

    await expect(exercises.nth(5)).toHaveText(fixtures.exercises.facePull.name);
  });

  test("removes an exercise without logged sets", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

    await page
      .getByRole("button", { name: `Remove ${fixtures.exercises.facePull.name}`, exact: true })
      .click();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeHidden();

    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeHidden();
  });

  test("removes an exercise with logged sets", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

    await page
      .getByRole("button", {
        name: `Remove ${fixtures.exercises.overheadPressSeatedDumbbells.name}`,
        exact: true,
      })
      .click();
    await page.getByRole("button", { name: "Remove", exact: true }).click();

    await expect(
      page.getByRole("link", {
        name: fixtures.exercises.overheadPressSeatedDumbbells.name,
        exact: true,
      }),
    ).toBeHidden();

    await page.reload();

    await expect(
      page.getByRole("link", {
        name: fixtures.exercises.overheadPressSeatedDumbbells.name,
        exact: true,
      }),
    ).toBeHidden();
  });

  test("adds an AMRAP exercise", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.facePull.name, exact: true });

    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByRole("searchbox", { name: "Exercise" }).fill(fixtures.exercises.facePull.name);
    await page.getByRole("radio", { name: fixtures.exercises.facePull.name }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("12");
    await page.getByRole("button", { name: "AMRAP", exact: true }).click();

    await expect(
      page.getByRole("group", { name: "Progression" }).getByRole("radio", { name: "Linear progression" }),
    ).toBeChecked();

    await page
      .getByRole("dialog", { name: "Add exercise" })
      .getByRole("button", { name: "Add exercise" })
      .click();

    await expect(row.getByText("3×12+", { exact: true })).toBeVisible();

    await page.reload();

    await expect(row.getByText("3×12+", { exact: true })).toBeVisible();
  });

  test("shows the target RIR in the log panel head and marks a set below it", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });
    const head = panel.getByRole("group", { name: fixtures.exercises.pecDeck.name, exact: true });
    const row = page.getByRole("listitem", { name: fixtures.exercises.pecDeck.name, exact: true });

    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByRole("searchbox", { name: "Exercise" }).fill(fixtures.exercises.pecDeck.name);
    await page.getByRole("radio", { name: fixtures.exercises.pecDeck.name }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("10");
    await page.getByRole("spinbutton", { name: "Max reps", exact: true }).fill("12");
    await page
      .getByRole("group", { name: "Target RIR" })
      .getByRole("button", { name: "RIR 2", exact: true })
      .click();
    await page
      .getByRole("dialog", { name: "Add exercise" })
      .getByRole("button", { name: "Add exercise" })
      .click();
    await page.getByRole("button", { name: "Continue" }).click();
    await panel
      .getByRole("toolbar", { name: "Exercises" })
      .getByRole("button", { name: `7. ${fixtures.exercises.pecDeck.name}`, exact: true })
      .click();

    await expect(head.getByTitle("Target RIR", { exact: true })).toHaveText("RIR 2");

    await panel.getByRole("spinbutton", { name: "Reps" }).fill("10");
    await panel.getByRole("spinbutton", { name: "Load (kg)" }).fill("40");
    await panel.getByRole("button", { name: "Log set · RIR 1" }).click();

    await expect(panel.getByRole("img", { name: "Below target RIR 2", exact: true })).toBeVisible();

    await expect(page.locator("[aria-busy=true]")).toHaveCount(0);
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", { name: `Details: ${fixtures.exercises.pecDeck.name}`, exact: true })
      .click();
    await page.reload();

    await expect(row.getByRole("img", { name: "Below target RIR 2", exact: true })).toBeVisible();
  });

  test("completes the workout in progress", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.activeMutation.workout.id}`);

    await page.getByRole("button", { name: "Complete" }).click();

    await expect(page.getByRole("img", { name: "Completed" })).toBeVisible();
  });

  test("moves the completed workout to the dashboard", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Last completed" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "In progress" })).toBeHidden();
    await expect(page.getByText("Nothing scheduled")).toBeHidden();
  });

  test("shows the stats without the progress chart after the first session", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    await expect(
      page.getByRole("listitem", { name: "Sessions" }).getByText("1", { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: "Progress" })).toBeHidden();
    await expect(page.getByRole("list", { name: "History" }).getByRole("link")).toHaveCount(1);
  });
});

test.describe("Workouts - hanger", () => {
  test.use({ storageState: ".auth/hanger.json" });
  test.describe.configure({ mode: "serial" });

  test("summarizes the previous bodyweight session", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.hangingLegRaise.name, exact: true });

    await page.goto(`/workouts/${fixtures.hanger.scheduledWorkout.id}`);

    await expect(
      row.getByRole("note", { name: "Last session" }).getByText("3×15", { exact: true }),
    ).toBeVisible();
  });

  test("hides reordering for a single exercise", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.hanger.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();

    await expect(page.getByRole("menuitem", { name: "Discard" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Reorder exercises" })).toBeHidden();
  });

  test("lists the actions of the completed workout", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.hanger.completedWorkout.id}`);

    await page.getByRole("button", { name: "More actions" }).click();

    await expect(page.getByRole("menuitem", { name: "Copy workout" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Add note" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Discard" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Reorder exercises" })).toBeHidden();
  });

  test("sets a bodyweight target from the last session", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.hangingLegRaise.name, exact: true });
    const suggestion = row.getByRole("group", {
      name: "Based on the last session · Double progression",
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.hanger.scheduledWorkout.id}`);
    await row.getByRole("button", { name: "Set target", exact: true }).click();

    await expect(suggestion.getByRole("button")).toHaveText(["−1 rep", "Last"]);
    await expect(suggestion.getByRole("button", { name: "Last", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(row.getByRole("spinbutton", { name: "Load (kg)" })).toBeHidden();

    await row.getByRole("button", { name: "Save", exact: true }).click();

    await expect(row.getByRole("button", { name: "Edit target: 3×15", exact: true })).toBeVisible();

    await page.reload();

    await expect(row.getByRole("button", { name: "Edit target: 3×15", exact: true })).toBeVisible();
  });

  test("logs a bodyweight set", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.hangingLegRaise.name, exact: true });
    const panel = page.getByRole("dialog", { name: "Logging panel" });

    await page.goto(`/workouts/${fixtures.hanger.scheduledWorkout.id}`);
    await page.getByRole("button", { name: "Start", exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(panel.getByRole("spinbutton", { name: "Load (kg)" })).toBeHidden();

    await panel.getByRole("button", { name: "Log set", exact: true }).click();
    await expect(page.locator("[aria-busy=true]")).toHaveCount(0);
    await page.keyboard.press("Escape");
    await row
      .getByRole("button", { name: `Details: ${fixtures.exercises.hangingLegRaise.name}`, exact: true })
      .click();

    await expect(row.getByText("15", { exact: true })).toBeVisible();

    await page.reload();

    await expect(row.getByText("15", { exact: true })).toBeVisible();
  });

  test("corrects a bodyweight set", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.hangingLegRaise.name, exact: true });
    const form = row.getByRole("form", { name: "Correct set 1" });

    await page.goto(`/workouts/${fixtures.hanger.scheduledWorkout.id}`);
    await row
      .getByRole("button", { name: `Details: ${fixtures.exercises.hangingLegRaise.name}`, exact: true })
      .click();
    await row.getByRole("button", { name: "Correct set 1" }).click();

    await expect(form.getByRole("spinbutton", { name: "Load (kg)" })).toBeHidden();

    await form.getByRole("spinbutton", { name: "Reps" }).fill("12");
    await form.getByRole("button", { name: "Log set", exact: true }).click();

    await expect(row.getByText("12", { exact: true })).toBeVisible();

    await page.reload();

    await expect(row.getByText("12", { exact: true })).toBeVisible();
  });

  test("copies the completed bodyweight workout", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(`/workouts/${fixtures.hanger.scheduledWorkout.id}`);
    await page.getByRole("button", { name: "Complete" }).click();

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Copy workout" }).click();

    await expect(page.getByRole("menuitem", { name: "Copied" })).toBeVisible();

    const copied = await page.evaluate(() => navigator.clipboard.readText());

    expect(copied).toContain(
      `| ${fixtures.exercises.hangingLegRaise.name} | 1 | 12 | — | both | not recorded |`,
    );
  });
});
