// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Mobile - pocket", () => {
  test.use({ storageState: ".auth/pocket.json" });
  test.describe.configure({ mode: "serial" });

  test("sets every target", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.pocket.scheduledWorkout.id}`);
    await expect(page.getByRole("button", { name: "Set target" }).first()).toBeVisible();
    const exercises = await page.getByRole("button", { name: "Set target" }).count();

    for (let exercise = 0; exercise < exercises; exercise++) {
      await page.getByRole("button", { name: "Set target" }).first().tap();
      await page.getByRole("spinbutton", { name: "Load (kg)" }).fill("20");
      await page.getByRole("button", { name: "Save" }).tap();
      await expect(page.getByRole("button", { name: "Set target" })).toHaveCount(exercises - exercise - 1);
    }

    await expect(page.getByRole("button", { name: "Start" })).toBeEnabled();
  });

  test("starts the workout", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.pocket.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Start" }).tap();

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

  test("adds a note", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.pocket.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "How did it go?" }).tap();
    await page.getByLabel("Note").fill("Shoulder felt tight on the last set.");
    await page.getByRole("button", { name: "Save", exact: true }).tap();
    await page.reload();

    await expect(page.getByText("Shoulder felt tight on the last set.")).toBeVisible();
  });

  test("completes the workout", async ({ page }) => {
    const bench = page.getByRole("listitem").filter({
      has: page.getByRole("link", { name: fixtures.exercises.superHorizontalBenchPress.name, exact: true }),
    });

    await page.goto(`/workouts/${fixtures.pocket.scheduledWorkout.id}`);

    await page.getByRole("button", { name: "Complete" }).tap();

    await expect(page.getByText("Completed", { exact: true })).toBeVisible();

    await expect(async () => {
      await page.reload();
      await bench.getByRole("button", { name: /^Details: / }).tap();
      await expect(bench.getByRole("button", { name: "Correct set 1" })).toBeVisible({ timeout: 1000 });
      await expect(bench.getByRole("button", { name: "Correct set 2" })).toBeVisible({ timeout: 1000 });
    }).toPass();
  });
});
