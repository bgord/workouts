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
