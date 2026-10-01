// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Plans - builder-mutation", () => {
  test.use({ storageState: ".auth/builder-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("rejects a too short plan name", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builderMutation.plan.id}`);

    await page.getByRole("heading", { level: 1 }).getByRole("button").click();
    await page.getByLabel("Plan name").fill("ab");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.locator("form input:invalid")).toHaveCount(1);

    await page.reload();

    await expect(
      page.getByRole("heading", { level: 1, name: fixtures.builderMutation.plan.name }),
    ).toBeVisible();
  });

  test("renames the draft plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builderMutation.plan.id}`);

    await page.getByRole("heading", { level: 1 }).getByRole("button").click();
    await page.getByLabel("Plan name").fill("PPL v2");
    await page.getByRole("button", { name: "Save" }).click();
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

    await page.getByRole("button", { name: "Archive", exact: true }).click();
    await page.getByRole("button", { name: "Archive", exact: true }).last().click();

    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Restore" })).toBeEnabled();
  });

  test("rejects a too short new plan name", async ({ page }) => {
    await page.goto("/plans");

    await page.getByRole("button", { name: "New plan" }).click();
    await page.getByLabel("Plan name").fill("ab");
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page.locator("form input:invalid")).toHaveCount(1);
    await expect(page).toHaveURL(/\/plans$/);
  });

  test("creates a new plan once the previous one is archived", async ({ page }) => {
    await page.goto("/plans");

    await page.getByRole("button", { name: "New plan" }).click();
    await page.getByLabel("Plan name").fill("Upper lower");
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page).toHaveURL(/\/plans\/(?!500f8ed2)[0-9a-f-]{36}$/);
    await expect(page.getByRole("heading", { level: 1, name: "Upper lower" })).toBeVisible();
    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  });

  test("blocks finalizing a plan with no sections", async ({ page }) => {
    await page.goto("/plans");

    await page.getByRole("link", { name: "Upper lower" }).click();

    await expect(page.getByRole("button", { name: "Finalize" })).toBeDisabled();
    await expect(page.getByText("Add a section first")).toBeVisible();
  });

  test("blocks finalizing a plan with an empty section", async ({ page }) => {
    await page.goto("/plans");

    await page.getByRole("link", { name: "Upper lower" }).click();
    await page.getByRole("button", { name: "New section" }).click();
    await page.getByLabel("New section").fill("Upper");
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.getByRole("button", { name: "Finalize" })).toBeDisabled();
    await expect(page.getByText("Add an exercise to all sections first")).toBeVisible();
  });
});

test.describe("Plans - drafter", () => {
  test.use({ storageState: ".auth/drafter.json" });
  test.describe.configure({ mode: "serial" });

  test("rejects an empty plan description", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: fixtures.drafter.plan.description }).click();
    await page.getByLabel("Description").fill("");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.locator("form textarea:invalid")).toHaveCount(1);

    await page.reload();

    await expect(page.getByText(fixtures.drafter.plan.description)).toBeVisible();
  });

  test("edits the plan description", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: fixtures.drafter.plan.description }).click();
    await page.getByLabel("Description").fill("Upper body twice, legs once.");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page.reload();

    await expect(page.getByText("Upper body twice, legs once.")).toBeVisible();
    await expect(page.getByText(fixtures.drafter.plan.description)).toBeHidden();
  });

  test("rejects a too short section name", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("heading", { level: 2, name: "Push", exact: true }).getByRole("button").click();
    await page.getByLabel("Section name").fill("ab");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.locator("form input:invalid")).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Push", exact: true })).toBeVisible();
  });

  test("renames a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("heading", { level: 2, name: "Push", exact: true }).getByRole("button").click();
    await page.getByLabel("Section name").fill("Push A");
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Push A", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Push", exact: true })).toBeHidden();
  });

  test("rejects a too short new section name", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "New section" }).click();
    await page.getByLabel("New section").fill("ab");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.locator("form input:invalid")).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "ab", exact: true })).toBeHidden();
  });

  test("rejects a duplicate section name", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "New section" }).click();
    await page.getByLabel("New section").fill(fixtures.drafter.plan.sections.pull.name);
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not create a section")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", { level: 2, name: fixtures.drafter.plan.sections.pull.name, exact: true }),
    ).toHaveCount(1);
  });

  test("adds a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "New section" }).click();
    await page.getByLabel("New section").fill("Arms");
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Arms", exact: true })).toBeVisible();
  });

  test("removes a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "Remove Arms", exact: true }).click();
    await page.getByRole("button", { name: "Remove", exact: true }).click();
    await page.reload();

    await expect(page.getByRole("heading", { level: 2, name: "Arms", exact: true })).toBeHidden();
    await expect(page.getByRole("heading", { level: 2, name: "Push A", exact: true })).toBeVisible();
  });

  test("edits the warm-up of a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push A", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    await page.getByTitle("Warm-up").click();
    await page.getByLabel("Warm-up").fill("5 minutes on the rower");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page.reload();

    await expect(page.getByText("5 minutes on the rower")).toBeVisible();
    await expect(page.getByText("10x Arm Circles forward")).toBeHidden();
  });

  test("sets the cool-down of a section", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push A", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    await page.getByTitle("Cool-down").click();
    await page.getByLabel("Cool-down").fill("Chest and lat stretch, 2 minutes each");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page.reload();

    await expect(page.getByText("Chest and lat stretch, 2 minutes each")).toBeVisible();
  });

  test("rejects an exercise instruction with invalid sets and reps range", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push A", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByPlaceholder("Search exercises").fill(fixtures.exercises.facePull.name);
    await page.getByRole("list", { name: "Exercise" }).getByText(fixtures.exercises.facePull.name).click();

    const form = page
      .locator("form")
      .filter({ has: page.getByRole("spinbutton", { name: "Sets", exact: true }) });

    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("21");
    await form.getByRole("button", { name: "Add exercise" }).click();

    await expect(form.locator('input[name="sets"]:invalid')).toHaveCount(1);

    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("12");
    await page.getByRole("spinbutton", { name: "Reps max", exact: true }).fill("8");
    await form.getByRole("button", { name: "Add exercise" }).click();

    await expect(form.locator('input[name="repsMax"]:invalid')).toHaveCount(1);

    await page.reload();

    await expect(page.getByText("6 exercises").first()).toBeVisible();
  });

  test("adds an exercise instruction", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push A", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByPlaceholder("Search exercises").fill(fixtures.exercises.facePull.name);
    await page.getByRole("list", { name: "Exercise" }).getByText(fixtures.exercises.facePull.name).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("12");
    await page.getByRole("spinbutton", { name: "Reps max", exact: true }).fill("15");
    await page.getByRole("combobox", { name: "Progression" }).selectOption("linear_progression");
    await page
      .locator("form")
      .filter({ has: page.getByRole("spinbutton", { name: "Sets", exact: true }) })
      .getByRole("button", { name: "Add exercise" })
      .click();
    await page.reload();

    await expect(
      page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }),
    ).toBeVisible();
    await expect(page.getByText("7 exercises")).toBeVisible();
  });

  test("blocks saving an exercise instruction edit with no sets", async ({ page }) => {
    const row = page
      .getByRole("listitem")
      .filter({ has: page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }) })
      .last();

    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push A", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    await row.getByRole("button", { name: "Edit exercise" }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("0");

    await expect(
      page
        .locator("form")
        .filter({ has: page.getByRole("spinbutton", { name: "Sets", exact: true }) })
        .getByRole("button", { name: "Save", exact: true }),
    ).toBeDisabled();

    await page.reload();

    await expect(row).toContainText("3×12-15");
  });

  test("edits the exercise instruction", async ({ page }) => {
    const row = page
      .getByRole("listitem")
      .filter({ has: page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }) })
      .last();

    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push A", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    await row.getByRole("button", { name: "Edit exercise" }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("5");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("6");
    await page.getByRole("spinbutton", { name: "Reps max", exact: true }).fill("8");
    await page.getByRole("combobox", { name: "Progression" }).selectOption("double_progression");
    await page
      .locator("form")
      .filter({ has: page.getByRole("spinbutton", { name: "Sets", exact: true }) })
      .getByRole("button", { name: "Save", exact: true })
      .click();
    await page.reload();

    await expect(row).toContainText("5×6-8");
    await expect(row).toContainText("Double progression");
  });

  test("changes the exercise of the instruction", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push A", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("link", { name: fixtures.exercises.facePull.name, exact: true }) })
      .last()
      .getByRole("button", { name: "Edit exercise" })
      .click();
    await page.getByRole("img", { name: fixtures.exercises.facePull.name }).click();
    await page.getByPlaceholder("Search exercises").fill(fixtures.exercises.pecDeck.name);
    await page.getByRole("list", { name: "Exercise" }).getByText(fixtures.exercises.pecDeck.name).click();
    await page
      .locator("form")
      .filter({ has: page.getByRole("spinbutton", { name: "Sets", exact: true }) })
      .getByRole("button", { name: "Save", exact: true })
      .click();
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
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push A", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.pecDeck.name} down` }),
    ).toBeDisabled();

    await page.getByRole("button", { name: `Move ${fixtures.exercises.pecDeck.name} up` }).click();
    await page.reload();

    await expect(
      page.getByRole("button", { name: `Move ${fixtures.exercises.pecDeck.name} down` }),
    ).toBeEnabled();
  });

  test("removes the exercise instruction", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push A", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    const removed = page.waitForResponse((response) => response.request().method() === "DELETE");
    await page
      .getByRole("button", { name: `Remove ${fixtures.exercises.pecDeck.name}`, exact: true })
      .click();
    await removed;

    await expect(async () => {
      await page.reload();
      await expect(page.getByRole("link", { name: fixtures.exercises.pecDeck.name, exact: true })).toBeHidden(
        {
          timeout: 1000,
        },
      );
      await expect(page.getByText("6 exercises").first()).toBeVisible({ timeout: 1000 });
    }).toPass();
  });

  test("finalizes the plan with the edits", async ({ page }) => {
    await page.goto(`/plans/${fixtures.drafter.plan.id}`);

    await page.getByRole("button", { name: "Finalize" }).click();
    await page.reload();

    await expect(page.getByText("Finalized", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Push A", exact: true })).toBeVisible();
    await expect(page.getByText("Upper body twice, legs once.")).toBeVisible();
    await expect(page.getByRole("button", { name: "New section" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Edit" })).toBeEnabled();
  });
});

test.describe("Plans - archivist-mutation", () => {
  test.use({ storageState: ".auth/archivist-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("archives the draft plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.archivistMutation.plan.id}`);

    await page.getByRole("button", { name: "Archive", exact: true }).click();
    await page.getByRole("button", { name: "Archive", exact: true }).last().click();

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

    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).last().click();

    await expect(page.getByText("Could not delete the plan")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
  });

  test("deletes the archived plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.archivistMutation.plan.id}`);

    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).last().click();

    await expect(page).toHaveURL("/plans");

    await page.reload();

    await expect(page.locator(`a[href="/plans/${fixtures.archivistMutation.plan.id}"]`)).toBeHidden();
    await expect(
      page.locator(`a[href="/plans/${fixtures.archivistMutation.archivedPlan.id}"]`),
    ).toBeVisible();
  });
});
