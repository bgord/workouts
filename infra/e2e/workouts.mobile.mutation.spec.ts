// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Mobile - pocket", () => {
  test.use({ storageState: ".auth/pocket.json" });
  test.describe.configure({ mode: "serial" });

  test("sets every target", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.pocket.scheduledWorkout.id}`);
    await expect(page.getByRole("button", { name: "Set target", exact: true }).first()).toBeVisible();
    const exercises = await page.getByRole("button", { name: "Set target", exact: true }).count();

    for (let exercise = 0; exercise < exercises; exercise++) {
      await page.getByRole("button", { name: "Set target", exact: true }).first().tap();
      await page.getByRole("spinbutton", { name: "Load (kg)" }).fill("20");
      await page.getByRole("button", { name: "Save", exact: true }).tap();
      await expect(page.getByRole("button", { name: "Set target", exact: true })).toHaveCount(
        exercises - exercise - 1,
      );
    }

    await expect(page.getByRole("button", { name: "Start", exact: true })).toBeEnabled();
  });

  test("starts the workout", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.pocket.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Start", exact: true }).tap();

    await expect(page.getByText("In progress", { exact: true })).toBeVisible();
  });

  test("logs sets from the log panel", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });

    await page.goto(`/workouts/${fixtures.pocket.scheduledWorkout.id}`);
    await page
      .getByRole("button", { name: `Open panel: ${fixtures.exercises.superHorizontalBenchPress.name}` })
      .tap();
    await panel.getByRole("spinbutton", { name: "Reps" }).tap();
    await expect(panel.getByRole("button", { name: "Log set", exact: true })).toBeInViewport();
    await panel.getByRole("button", { name: "Reps +1" }).tap();
    await panel.getByRole("button", { name: "Load (kg) +0.5" }).tap();
    await panel.getByRole("button", { name: "Log set", exact: true }).tap();
    await panel.getByRole("button", { name: "Log set · RIR 1" }).tap();
    await panel
      .getByRole("button", { name: `Next: ${fixtures.exercises.overheadPressSeatedDumbbells.name}` })
      .tap();
    await panel.getByRole("button", { name: "Log set", exact: true }).tap();

    await panel
      .getByRole("button", { name: `Close panel: ${fixtures.exercises.overheadPressSeatedDumbbells.name}` })
      .tap();

    await expect(panel).toBeHidden();
  });

  test("logs a single set on a double tap", async ({ page }) => {
    const panel = page.getByRole("dialog", { name: "Logging panel" });

    await page.goto(`/workouts/${fixtures.pocket.scheduledWorkout.id}`);
    await page
      .getByRole("button", { name: `Open panel: ${fixtures.exercises.tricepsPushDownBar.name}` })
      .tap();
    await panel.getByRole("button", { name: "Log set", exact: true }).dblclick();

    await expect(panel.getByRole("button", { name: "Remove set 1" })).toBeVisible();
    await expect(panel.getByRole("button", { name: "Remove set 2" })).toBeHidden();
    await expect(panel.getByText("Could not log the set")).toBeHidden();

    await page.reload();

    await expect(panel.getByRole("button", { name: "Remove set 1" })).toBeVisible();
    await expect(panel.getByRole("button", { name: "Remove set 2" })).toBeHidden();
  });

  test("adds a note", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.pocket.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Add a note…" }).tap();
    await page.getByLabel("Note").fill("Shoulder felt tight on the last set.");
    await page.getByRole("button", { name: "Save", exact: true }).tap();

    await expect(page.getByRole("button", { name: "Shoulder felt tight on the last set." })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Shoulder felt tight on the last set." })).toBeVisible();
  });

  test("completes the workout", async ({ page }) => {
    const bench = page.getByRole("listitem", {
      name: fixtures.exercises.superHorizontalBenchPress.name,
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.pocket.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Complete" }).tap();

    await expect(page.getByRole("img", { name: "Completed" })).toBeVisible();

    await page.reload();
    await bench.getByRole("button", { name: /^Details: / }).tap();

    await expect(bench.getByRole("button", { name: "Correct set 1" })).toBeVisible();
    await expect(bench.getByRole("button", { name: "Correct set 2" })).toBeVisible();
  });
});
