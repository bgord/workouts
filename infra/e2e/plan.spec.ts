// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Plan - builder", () => {
  test.use({ storageState: ".auth/builder.json" });

  test("shows the draft plan with its sections", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await expect(page.getByRole("heading", { level: 1, name: fixtures.builder.plan.name })).toBeVisible();
    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
    await expect(page.getByText(fixtures.builder.plan.sections.push.name, { exact: true })).toBeVisible();
    await expect(page.getByText(fixtures.builder.plan.sections.pull.name, { exact: true })).toBeVisible();
    await expect(page.getByText(fixtures.builder.plan.sections.legs.name, { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Finalize" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Restore" })).toBeHidden();
  });

  test("keeps the section expanded and collapsed after reload", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    const toggle = page.getByRole("button", { name: "Details: Push", exact: true });

    await expect(page.getByRole("button", { name: "Add exercise" })).toBeHidden();

    await toggle.click();
    await page.reload();

    await expect(page.getByRole("button", { name: "Add exercise" })).toBeVisible();

    await toggle.click();
    await page.reload();

    await expect(page.getByRole("button", { name: "Add exercise" })).toBeHidden();
  });

  test("shows the empty state when no exercise matches", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();

    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByRole("searchbox", { name: "Exercise" }).fill("zzz");

    await expect(page.getByText("No exercises match", { exact: true })).toBeVisible();
  });

  test("blocks moving the first exercise instruction up and the last one down", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();

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

  test("shows the error when finalizing the plan fails", async ({ page }) => {
    await page.route("**/api/plans/*/finalize", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await page.getByRole("button", { name: "Finalize" }).click();

    await expect(page.getByText("Could not finalize the plan")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Finalize" })).toBeVisible();
  });

  test("shows the error when renaming the plan fails", async ({ page }) => {
    await page.route("**/api/plans/*/rename", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await page.getByRole("button", { name: `Rename ${fixtures.builder.plan.name}` }).click();
    await page.getByLabel("Plan name").fill("PPL v2");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not rename the plan")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { level: 1, name: fixtures.builder.plan.name })).toBeVisible();
  });

  test("shows the error when saving the plan description fails", async ({ page }) => {
    await page.route("**/api/plans/*/description", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await page.getByRole("button", { name: fixtures.builder.plan.description }).click();
    await page.getByLabel("Description").fill("Upper body twice, legs once.");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not save the description")).toBeVisible();

    await page.reload();

    await expect(page.getByText(fixtures.builder.plan.description)).toBeVisible();
    await expect(page.getByText("Upper body twice, legs once.")).toBeHidden();
  });

  test("shows the error when creating a section fails", async ({ page }) => {
    await page.route("**/api/plans/*/section", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await page.getByRole("button", { name: "New section" }).click();
    await page.getByLabel("New section").fill("Arms");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not create a section")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Arms", exact: true })).toBeHidden();
  });

  test("shows the error when renaming a section fails", async ({ page }) => {
    await page.route("**/api/plans/*/section/*/rename", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await page.getByRole("button", { name: "Rename Push", exact: true }).click();
    await page.getByLabel("Section name").fill("Push A");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not rename the section")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Push", exact: true })).toBeVisible();
  });

  test("shows the error when removing a section fails", async ({ page }) => {
    await page.route("**/api/plans/*/section/*", (route) =>
      route.request().method() === "DELETE" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await page.getByRole("button", { name: "Remove Push", exact: true }).click();
    await page.getByRole("button", { name: "Remove", exact: true }).click();

    await expect(page.getByText("Could not remove the section")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Push", exact: true })).toBeVisible();
  });

  test("shows the error when saving the warm-up fails", async ({ page }) => {
    await page.route("**/api/plans/*/section/*/warmup", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();

    await page.getByRole("button", { name: "Warm-up" }).click();
    await page.getByLabel("Warm-up").fill("5 minutes on the rower");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not save the warm-up")).toBeVisible();

    await page.reload();

    await expect(page.getByText("5 minutes on the rower")).toBeHidden();
  });

  test("shows the error when saving the cool-down fails", async ({ page }) => {
    await page.route("**/api/plans/*/section/*/cooldown", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();

    await page.getByRole("button", { name: "Cool-down" }).click();
    await page.getByLabel("Cool-down").fill("Chest and lat stretch, 2 minutes each");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not save the cool-down")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Chest and lat stretch, 2 minutes each")).toBeHidden();
  });

  test("shows the error when adding an exercise instruction fails", async ({ page }) => {
    await page.route("**/api/plans/*/section/*/exercise-instruction", (route) =>
      route.fulfill({ status: 500 }),
    );
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();

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

  test("shows the error when saving an exercise instruction fails", async ({ page }) => {
    await page.route("**/api/plans/*/section/*/exercise-instruction/*/instruction", (route) =>
      route.fulfill({ status: 500 }),
    );
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();

    await page
      .getByRole("listitem", { name: fixtures.exercises.superHorizontalBenchPress.name, exact: true })
      .getByRole("button", { name: "Edit exercise" })
      .click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("5");
    await page
      .getByRole("dialog", { name: "Edit exercise" })
      .getByRole("button", { name: "Save", exact: true })
      .click();

    await expect(page.getByText("Could not save the exercise")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("listitem", { name: fixtures.exercises.superHorizontalBenchPress.name, exact: true }),
    ).toContainText("4×5");
  });

  test("shows the error when changing the exercise of an instruction fails", async ({ page }) => {
    await page.route("**/api/plans/*/section/*/exercise-instruction/*/exercise", (route) =>
      route.fulfill({ status: 500 }),
    );
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();

    await page
      .getByRole("listitem", { name: fixtures.exercises.superHorizontalBenchPress.name, exact: true })
      .getByRole("button", { name: "Edit exercise" })
      .click();
    await page
      .getByRole("button", { name: `Change exercise: ${fixtures.exercises.superHorizontalBenchPress.name}` })
      .click();
    await page.getByRole("searchbox", { name: "Exercise" }).fill(fixtures.exercises.pecDeck.name);
    await page.getByRole("radio", { name: fixtures.exercises.pecDeck.name }).click();
    await page
      .getByRole("dialog", { name: "Edit exercise" })
      .getByRole("button", { name: "Save", exact: true })
      .click();

    await expect(page.getByText("Could not save the exercise")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.superHorizontalBenchPress.name, exact: true }),
    ).toBeVisible();
  });

  test("shows the error when moving an exercise instruction fails", async ({ page }) => {
    await page.route("**/api/plans/*/section/*/exercise-instruction/*/position", (route) =>
      route.fulfill({ status: 500 }),
    );
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();

    await page
      .getByRole("button", { name: `Move ${fixtures.exercises.overheadPressSeatedDumbbells.name} up` })
      .click();

    await expect(page.getByText("Could not move the exercise")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.superHorizontalBenchPress.name} up` }),
    ).toBeDisabled();
  });

  test("shows the error when removing an exercise instruction fails", async ({ page }) => {
    await page.route("**/api/plans/*/section/*/exercise-instruction/*", (route) =>
      route.request().method() === "DELETE" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();

    await page
      .getByRole("button", {
        name: `Remove ${fixtures.exercises.superHorizontalBenchPress.name}`,
        exact: true,
      })
      .click();

    await expect(page.getByText("Could not remove the exercise")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.superHorizontalBenchPress.name, exact: true }),
    ).toBeVisible();
  });
});

test.describe("Plan - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("shows the finalized plan as read-only", async ({ page }) => {
    await page.goto(`/plans/${fixtures.athlete.plan.id}`);

    await expect(page.getByText("Finalized", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Edit" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Finalize" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Restore" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Delete", exact: true })).toBeHidden();
  });

  test("shows the error when enabling editing fails", async ({ page }) => {
    await page.route("**/api/plans/*/editing/enable", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.athlete.plan.id}`);

    await page.getByRole("button", { name: "Edit" }).click();

    await expect(page.getByText("Could not enable editing")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Finalized", { exact: true })).toBeVisible();
  });

  test("shows the error when archiving the plan fails", async ({ page }) => {
    await page.route("**/api/plans/*/archive", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.athlete.plan.id}`);

    await page.getByRole("button", { name: "Archive", exact: true }).click();
    await page.getByRole("dialog", { name: "Archive plan" }).getByRole("button", { name: "Archive" }).click();

    await expect(page.getByText("Could not archive the plan")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Finalized", { exact: true })).toBeVisible();
  });
});

test.describe("Plan - archivist", () => {
  test.use({ storageState: ".auth/archivist.json" });

  test("blocks restoring the archived plan while another plan is editable", async ({ page }) => {
    await page.goto(`/plans/${fixtures.archivist.archivedPlan.id}`);

    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Restore" })).toHaveAccessibleDescription(
      "Archive the current plan first",
    );
    await expect(page.getByRole("button", { name: "Restore" })).toBeDisabled();
  });
});

test.describe("Plan - hoarder", () => {
  test.use({ storageState: ".auth/hoarder.json" });

  test("blocks adding a section at the limit", async ({ page }) => {
    await page.goto(`/plans/${fixtures.hoarder.plan.id}`);

    await expect(page.getByRole("button", { name: "New section" })).toHaveAccessibleDescription(
      "Remove a section to add a new one",
    );
    await expect(page.getByRole("button", { name: "New section" })).toBeDisabled();
  });

  test("blocks adding an exercise instruction at the limit", async ({ page }) => {
    await page.goto(`/plans/${fixtures.hoarder.plan.id}`);
    await page.getByRole("button", { name: "Details: Everything", exact: true }).click();

    await expect(page.getByRole("button", { name: "Add exercise" })).toHaveAccessibleDescription(
      "Remove an exercise to add a new one",
    );
    await expect(page.getByRole("button", { name: "Add exercise" })).toBeDisabled();
  });
});
