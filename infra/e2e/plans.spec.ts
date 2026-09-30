import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Plans - empty", () => {
  test.use({ storageState: ".auth/empty.json" });

  test("shows the empty state", async ({ page }) => {
    await page.goto("/plans");

    await expect(page.getByText("No plans created yet")).toBeVisible();
    await expect(page.getByText("Create a plan to schedule your workouts")).toBeVisible();
    await expect(page.getByRole("button", { name: "New plan" })).toBeEnabled();
  });

  test("shows the error when creating the plan fails", async ({ page }) => {
    await page.route("**/api/plans/create", (route) => route.fulfill({ status: 500 }));
    await page.goto("/plans");

    await page.getByRole("button", { name: "New plan" }).click();
    await page.getByLabel("Plan name").fill("Upper lower");
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page.getByText("Could not create a plan")).toBeVisible();
    await expect(page.getByLabel("Plan name")).toHaveValue("Upper lower");

    await page.reload();

    await expect(page.getByText("No plans created yet")).toBeVisible();
  });
});

test.describe("Plans - builder", () => {
  test.use({ storageState: ".auth/builder.json" });

  test("lists the draft plan as active", async ({ page }) => {
    await page.goto("/plans");

    await expect(page.getByRole("heading", { name: "Active" })).toBeVisible();
    await expect(page.locator(`a[href="/plans/${fixtures.builder.plan.id}"]`)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Archived" })).toBeHidden();
  });

  test("blocks creating a second plan", async ({ page }) => {
    await page.goto("/plans");

    await expect(page.getByText("Archive the current plan first")).toBeVisible();
    await expect(page.getByRole("button", { name: "New plan" })).toBeDisabled();
  });

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

    await page.getByRole("heading", { level: 1 }).getByRole("button").click();
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

    await page.getByRole("heading", { level: 2, name: "Push", exact: true }).getByRole("button").click();
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
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    await page.getByTitle("Warm-up").click();
    await page.getByLabel("Warm-up").fill("5 minutes on the rower");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not save the warm-up")).toBeVisible();

    await page.reload();

    await expect(page.getByText("5 minutes on the rower")).toBeHidden();
  });

  test("shows the error when saving the cool-down fails", async ({ page }) => {
    await page.route("**/api/plans/*/section/*/cooldown", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { level: 2, name: "Push", exact: true }) })
      .getByRole("button")
      .first()
      .click();

    await page.getByTitle("Cool-down").click();
    await page.getByLabel("Cool-down").fill("Chest and lat stretch, 2 minutes each");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not save the cool-down")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Chest and lat stretch, 2 minutes each")).toBeHidden();
  });
});

test.describe("Plans - athlete", () => {
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
    await page.getByRole("button", { name: "Archive", exact: true }).last().click();

    await expect(page.getByText("Could not archive the plan")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Finalized", { exact: true })).toBeVisible();
  });
});

test.describe("Plans - archivist", () => {
  test.use({ storageState: ".auth/archivist.json" });

  test("lists the draft plan as active and the archived plan", async ({ page }) => {
    await page.goto("/plans");

    await expect(page.getByRole("heading", { name: "Active" })).toBeVisible();
    await expect(page.locator(`a[href="/plans/${fixtures.archivist.plan.id}"]`)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Archived" })).toBeVisible();
    await expect(page.locator(`a[href="/plans/${fixtures.archivist.archivedPlan.id}"]`)).toBeVisible();
  });

  test("blocks restoring the archived plan while another plan is editable", async ({ page }) => {
    await page.goto(`/plans/${fixtures.archivist.archivedPlan.id}`);

    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
    await expect(page.getByText("Archive the current plan first")).toBeVisible();
    await expect(page.getByRole("button", { name: "Restore" })).toBeDisabled();
  });
});
