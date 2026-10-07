// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Plans - builder-mutation", () => {
  test.use({ storageState: ".auth/builder-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("rejects a too short plan name", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builderMutation.plan.id}`);

    await page.getByRole("button", { name: `Rename ${fixtures.builderMutation.plan.name}` }).click();
    await page.getByLabel("Plan name").fill("ab");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByLabel("Plan name").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(
      page.getByRole("heading", { level: 1, name: fixtures.builderMutation.plan.name }),
    ).toBeVisible();
  });

  test("renames the draft plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builderMutation.plan.id}`);

    await page.getByRole("button", { name: `Rename ${fixtures.builderMutation.plan.name}` }).click();
    await page.getByLabel("Plan name").fill("PPL v2");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("heading", { level: 1, name: "PPL v2" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { level: 1, name: "PPL v2" })).toBeVisible();
  });

  test("finalizes the draft plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builderMutation.plan.id}`);

    await page.getByRole("button", { name: "Finalize" }).click();

    await expect(page.getByText("Finalized", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Finalize" })).toBeHidden();
  });

  test("enables editing of the finalized plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builderMutation.plan.id}`);

    await page.getByRole("button", { name: "Edit" }).click();

    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Finalize" })).toBeVisible();
  });

  test("archives the plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builderMutation.plan.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Archive" }).click();
    await page.getByRole("dialog", { name: "Archive plan" }).getByRole("button", { name: "Archive" }).click();

    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Restore" })).toBeEnabled();
  });

  test("rejects a too short new plan name", async ({ page }) => {
    await page.goto("/plans");

    await page.getByRole("button", { name: "New plan" }).click();
    await page.getByLabel("Plan name").fill("ab");
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page.getByLabel("Plan name").and(page.locator(":invalid"))).toHaveCount(1);
    await expect(page).toHaveURL("/plans");
  });

  test("creates a new plan once the previous one is archived", async ({ page }) => {
    await page.goto("/plans");

    await page.getByRole("button", { name: "New plan" }).click();
    await page.getByLabel("Plan name").fill("Upper lower");
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page).toHaveURL(/\/plans\/[0-9a-f-]{36}$/);
    await expect(page.getByRole("heading", { level: 1, name: "Upper lower" })).toBeVisible();
    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  });

  test("blocks finalizing a plan with no sections", async ({ page }) => {
    await page.goto("/plans");

    await page.getByRole("link", { name: "Upper lower" }).click();

    await expect(page.getByRole("button", { name: "Finalize" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Finalize" })).toHaveAccessibleDescription(
      "Add a section first",
    );
  });

  test("blocks finalizing a plan with an empty section", async ({ page }) => {
    await page.goto("/plans");

    await page.getByRole("link", { name: "Upper lower" }).click();
    await page.getByRole("button", { name: "New section" }).click();
    await page.getByLabel("New section").fill("Upper");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Upper", exact: true })).toBeVisible();
    await page.reload();

    await expect(page.getByRole("button", { name: "Finalize" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Finalize" })).toHaveAccessibleDescription(
      "Add an exercise to every section first",
    );
  });
});

test.describe("Plans - drafter", () => {
  test.use({ storageState: ".auth/drafter.json" });
  test.describe.configure({ mode: "serial" });

  test("edits the plan description", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: fixtures.drafter.plan.description }).click();
    await page.getByLabel("Description").fill("Upper body twice, legs once.");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Upper body twice, legs once." })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Upper body twice, legs once." })).toBeVisible();
    await expect(page.getByText(fixtures.drafter.plan.description)).toBeHidden();
  });

  test("clears the plan description", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "Upper body twice, legs once." }).click();
    await page.getByLabel("Description").fill("");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Add a description…" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Add a description…" })).toBeVisible();
    await expect(page.getByText("Upper body twice, legs once.")).toBeHidden();
  });

  test("rejects a too short section name", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "Rename Push", exact: true }).click();
    await page.getByLabel("Section name").fill("ab");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByLabel("Section name").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Push", exact: true })).toBeVisible();
  });

  test("renames a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "Rename Push", exact: true }).click();
    await page.getByLabel("Section name").fill("Push A");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("heading", { level: 2, name: "Push A", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Push", exact: true })).toBeHidden();

    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Push A", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Push", exact: true })).toBeHidden();
  });

  test("rejects a too short new section name", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "New section" }).click();
    await page.getByLabel("New section").fill("ab");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByLabel("New section").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "ab", exact: true })).toBeHidden();
  });

  test("rejects a duplicate section name", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "New section" }).click();
    await page.getByLabel("New section").fill(fixtures.drafter.plan.sections.pull.name.toUpperCase());
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not create a section")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", { level: 2, name: fixtures.drafter.plan.sections.pull.name, exact: true }),
    ).toHaveCount(1);
  });

  test("rejects a blank new section name", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "New section" }).click();
    await page.getByLabel("New section").fill("   ");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not create a section")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(3);
  });

  test("adds a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "New section" }).click();
    await page.getByLabel("New section").fill("  Arms  ");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("heading", { level: 2, name: "Arms", exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Arms", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Details: Arms", exact: true }).click();

    await expect(page.getByRole("button", { name: "Add exercise" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Exercises" })).toBeHidden();
  });

  test("removes a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "Remove Arms", exact: true }).click();
    await page.getByRole("button", { name: "Remove", exact: true }).click();

    await expect(page.getByRole("heading", { level: 2, name: "Arms", exact: true })).toBeHidden();
    await expect(page.getByRole("heading", { level: 2, name: "Push A", exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Arms", exact: true })).toBeHidden();
    await expect(page.getByRole("heading", { level: 2, name: "Push A", exact: true })).toBeVisible();
  });

  test("edits the warm-up of a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await page.getByRole("button", { name: "Warm-up" }).click();
    await page.getByLabel("Warm-up").fill("5 minutes on the rower");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "5 minutes on the rower" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "5 minutes on the rower" })).toBeVisible();
    await expect(page.getByText("10x Arm Circles forward")).toBeHidden();
  });

  test("clears the warm-up of a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await page.getByRole("button", { name: "5 minutes on the rower" }).click();
    await page.getByLabel("Warm-up").fill("");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Add a warm-up…" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Add a warm-up…" })).toBeVisible();
    await expect(page.getByText("5 minutes on the rower")).toBeHidden();
  });

  test("sets the cool-down of a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await page.getByRole("button", { name: "Cool-down" }).click();
    await page.getByLabel("Cool-down").fill("Chest and lat stretch, 2 minutes each");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Chest and lat stretch, 2 minutes each" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Chest and lat stretch, 2 minutes each" })).toBeVisible();
  });

  test("clears the cool-down of a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await page.getByRole("button", { name: "Chest and lat stretch, 2 minutes each" }).click();
    await page.getByLabel("Cool-down").fill("");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Add a cool-down…" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Add a cool-down…" })).toBeVisible();
    await expect(page.getByText("Chest and lat stretch, 2 minutes each")).toBeHidden();
  });

  test("rejects an exercise instruction with invalid sets and reps range", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

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
      page.getByRole("listitem", { name: "Push A", exact: true }).getByText("6 exercises", { exact: true }),
    ).toBeVisible();
  });

  test("adds an exercise instruction", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByRole("searchbox", { name: "Exercise" }).fill(fixtures.exercises.facePull.name);
    await page.getByRole("radio", { name: fixtures.exercises.facePull.name }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("12");
    await page.getByRole("spinbutton", { name: "Max reps", exact: true }).fill("15");
    await page.getByRole("combobox", { name: "Progression" }).selectOption("linear_progression");
    await page
      .getByRole("dialog", { name: "Add exercise" })
      .getByRole("button", { name: "Add exercise" })
      .click();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("listitem", { name: "Push A", exact: true }).getByText("7 exercises", { exact: true }),
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("listitem", { name: "Push A", exact: true }).getByText("7 exercises", { exact: true }),
    ).toBeVisible();
  });

  test("blocks saving an exercise instruction edit with no sets", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.facePull.name, exact: true });

    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await row.getByRole("button", { name: "Edit exercise" }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("0");

    await expect(
      page.getByRole("dialog", { name: "Edit exercise" }).getByRole("button", { name: "Save", exact: true }),
    ).toBeDisabled();

    await page.reload();

    await expect(row.getByText("3×12-15", { exact: true })).toBeVisible();
  });

  test("edits the exercise instruction", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.facePull.name, exact: true });

    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await row.getByRole("button", { name: "Edit exercise" }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("5");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("6");
    await page.getByRole("spinbutton", { name: "Max reps", exact: true }).fill("8");
    await page.getByRole("combobox", { name: "Progression" }).selectOption("double_progression");
    await page
      .getByRole("dialog", { name: "Edit exercise" })
      .getByRole("button", { name: "Save", exact: true })
      .click();

    await expect(row.getByText("5×6-8", { exact: true })).toBeVisible();
    await expect(row.getByRole("note", { name: "Double progression" })).toBeVisible();

    await page.reload();

    await expect(row.getByText("5×6-8", { exact: true })).toBeVisible();
    await expect(row.getByRole("note", { name: "Double progression" })).toBeVisible();
  });

  test("changes the exercise of the instruction", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await page
      .getByRole("listitem", { name: fixtures.exercises.facePull.name, exact: true })
      .getByRole("button", { name: "Edit exercise" })
      .click();
    await page.getByRole("button", { name: `Change exercise: ${fixtures.exercises.facePull.name}` }).click();
    await page.getByRole("searchbox", { name: "Exercise" }).fill(fixtures.exercises.pecDeck.name);
    await page.getByRole("radio", { name: fixtures.exercises.pecDeck.name }).click();
    await page
      .getByRole("dialog", { name: "Edit exercise" })
      .getByRole("button", { name: "Save", exact: true })
      .click();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.pecDeck.name, exact: true }),
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.pecDeck.name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeHidden();
  });

  test("moves the exercise instruction up", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.pecDeck.name} down` }),
    ).toBeDisabled();

    await page.getByRole("button", { name: `Move ${fixtures.exercises.pecDeck.name} up` }).click();

    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.pecDeck.name} down` }),
    ).toBeEnabled();

    await page.reload();

    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.pecDeck.name} down` }),
    ).toBeEnabled();
  });

  test("removes the exercise instruction", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await page
      .getByRole("button", { name: `Remove ${fixtures.exercises.pecDeck.name}`, exact: true })
      .click();

    await expect(page.getByRole("link", { name: fixtures.exercises.pecDeck.name, exact: true })).toBeHidden();
    await expect(
      page.getByRole("listitem", { name: "Push A", exact: true }).getByText("6 exercises", { exact: true }),
    ).toBeVisible();

    await page.reload();

    await expect(page.getByRole("link", { name: fixtures.exercises.pecDeck.name, exact: true })).toBeHidden();
    await expect(
      page.getByRole("listitem", { name: "Push A", exact: true }).getByText("6 exercises", { exact: true }),
    ).toBeVisible();
  });

  test("changes the exercise of a linear instruction to a bodyweight one", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.hangingLegRaise.name, exact: true });

    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Pull", exact: true }).click();

    await page
      .getByRole("listitem", { name: fixtures.exercises.pullUp.name, exact: true })
      .getByRole("button", { name: "Edit exercise" })
      .click();
    await page.getByRole("button", { name: `Change exercise: ${fixtures.exercises.pullUp.name}` }).click();
    await page.getByRole("searchbox", { name: "Exercise" }).fill(fixtures.exercises.hangingLegRaise.name);
    await page
      .getByRole("radio", {
        name: `${fixtures.exercises.hangingLegRaise.name} ${fixtures.categories.abs.name}`,
        exact: true,
      })
      .click();

    await expect(page.getByRole("combobox", { name: "Progression" })).toHaveValue("double_progression");

    await page
      .getByRole("dialog", { name: "Edit exercise" })
      .getByRole("button", { name: "Save", exact: true })
      .click();

    await expect(row.getByRole("note", { name: "Double progression" })).toBeVisible();
    await expect(row.getByText("Bodyweight", { exact: true })).toBeVisible();

    await page.reload();

    await expect(row.getByRole("note", { name: "Double progression" })).toBeVisible();
    await expect(row.getByText("Bodyweight", { exact: true })).toBeVisible();
  });

  test("sets the exercise instruction to AMRAP", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.hangingLegRaise.name, exact: true });

    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Pull", exact: true }).click();

    await row.getByRole("button", { name: "Edit exercise" }).click();
    await page.getByRole("button", { name: "AMRAP", exact: true }).click();

    await expect(page.getByRole("spinbutton", { name: "Max reps", exact: true })).toBeHidden();
    await expect(page.getByRole("combobox", { name: "Progression" })).toHaveValue("rep_progression");

    await page
      .getByRole("dialog", { name: "Edit exercise" })
      .getByRole("button", { name: "Save", exact: true })
      .click();

    await expect(row.getByText("4×4+", { exact: true })).toBeVisible();
    await expect(row.getByRole("note", { name: "Rep progression" })).toBeVisible();

    await page.reload();

    await expect(row.getByText("4×4+", { exact: true })).toBeVisible();
    await expect(row.getByRole("note", { name: "Rep progression" })).toBeVisible();
  });

  test("sets the AMRAP exercise instruction back to a range", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.hangingLegRaise.name, exact: true });
    const save = page
      .getByRole("dialog", { name: "Edit exercise" })
      .getByRole("button", { name: "Save", exact: true });

    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page.getByRole("button", { name: "Details: Pull", exact: true }).click();

    await row.getByRole("button", { name: "Edit exercise" }).click();

    await expect(page.getByRole("button", { name: "AMRAP", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(save).toBeDisabled();

    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("15");
    await page.getByRole("button", { name: "AMRAP", exact: true }).click();

    await expect(page.getByRole("spinbutton", { name: "Max reps", exact: true })).toHaveValue("15");

    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("4");
    await page.getByRole("spinbutton", { name: "Max reps", exact: true }).fill("6");
    await page.getByRole("button", { name: "AMRAP", exact: true }).click();

    await expect(save).toBeDisabled();

    await page.getByRole("button", { name: "AMRAP", exact: true }).click();
    await save.click();

    await expect(row.getByText("4×4-6", { exact: true })).toBeVisible();
    await expect(row.getByRole("note", { name: "Rep progression" })).toBeVisible();

    await page.reload();

    await expect(row.getByText("4×4-6", { exact: true })).toBeVisible();
    await expect(row.getByRole("note", { name: "Rep progression" })).toBeVisible();
  });

  test("finalizes the plan with the edits", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "Finalize" }).click();

    await expect(page.getByText("Finalized", { exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByText("Finalized", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Push A", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "New section" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Edit" })).toBeEnabled();
    await expect(page.getByText("Add a description…")).toBeHidden();

    await page.getByRole("button", { name: "Details: Push A", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Warm-up" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "Cool-down" })).toBeHidden();
    await expect(page.getByText("Add a warm-up…")).toBeHidden();
    await expect(page.getByText("Add a cool-down…")).toBeHidden();
  });
});

test.describe("Plans - archivist-mutation", () => {
  test.use({ storageState: ".auth/archivist-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("archives the draft plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.archivistMutation.plan.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Archive" }).click();
    await page.getByRole("dialog", { name: "Archive plan" }).getByRole("button", { name: "Archive" }).click();

    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
  });

  test("shows the error when restoring the plan fails", async ({ page }) => {
    await page.route("**/api/plans/*/restore", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.archivistMutation.archivedPlan.id}`);

    await page.getByRole("button", { name: "Restore" }).click();

    await expect(page.getByText("Could not restore the plan")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
  });

  test("restores the archived plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.archivistMutation.archivedPlan.id}`);

    await page.getByRole("button", { name: "Restore" }).click();

    await expect(page.getByText("Archived", { exact: true })).toBeHidden();
    await expect(page.getByRole("button", { name: "Restore" })).toBeHidden();
  });

  test("shows the error when deleting the plan fails", async ({ page }) => {
    await page.route(`**/api/plans/${fixtures.archivistMutation.plan.id}`, (route) =>
      route.request().method() === "DELETE" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/plans/${fixtures.archivistMutation.plan.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page
      .getByRole("dialog", { name: "Delete plan" })
      .getByRole("button", { name: "Delete", exact: true })
      .click();

    await expect(page.getByText("Could not delete the plan")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
  });

  test("deletes the archived plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.archivistMutation.plan.id}`);

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page
      .getByRole("dialog", { name: "Delete plan" })
      .getByRole("button", { name: "Delete", exact: true })
      .click();

    await expect(page).toHaveURL("/plans");

    await page.reload();

    await expect(page.getByRole("link", { name: fixtures.archivistMutation.plan.name })).toBeHidden();
    await expect(
      page.getByRole("link", { name: fixtures.archivistMutation.archivedPlan.name }),
    ).toBeVisible();
  });
});
