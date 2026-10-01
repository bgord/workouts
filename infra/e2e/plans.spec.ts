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
});
