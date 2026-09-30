import { expect, test } from "@playwright/test";

import * as fixtures from "../../scripts/seed/fixtures";

test.describe("Plans - builder", () => {
  test.use({ storageState: ".auth/builder.json" });
  test.describe.configure({ mode: "serial" });

  test("renames the draft plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await page.getByRole("heading", { level: 1 }).getByRole("button").click();
    await page.getByLabel("Plan name").fill("PPL v2");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "PPL v2" })).toBeVisible();
  });

  test("finalizes the draft plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await page.getByRole("button", { name: "Finalize" }).click();

    await expect(page.getByText("Finalized", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Finalize" })).toBeHidden();
  });

  test("enables editing of the finalized plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await page.getByRole("button", { name: "Edit" }).click();

    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Finalize" })).toBeVisible();
  });

  test("archives the plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builder.plan.id}`);

    await page.getByRole("button", { name: "Archive", exact: true }).click();
    await page.getByRole("button", { name: "Archive", exact: true }).last().click();

    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Restore" })).toBeEnabled();
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
});

test.describe("Plans - archivist", () => {
  test.use({ storageState: ".auth/archivist.json" });
  test.describe.configure({ mode: "serial" });

  test("archives the draft plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.archivist.plan.id}`);

    await page.getByRole("button", { name: "Archive", exact: true }).click();
    await page.getByRole("button", { name: "Archive", exact: true }).last().click();

    await expect(page.getByText("Archived", { exact: true })).toBeVisible();
  });

  test("restores the archived plan", async ({ page }) => {
    await page.goto(`/plans/${fixtures.archivist.archivedPlan.id}`);

    await page.getByRole("button", { name: "Restore" }).click();

    await expect(page.getByText("Archived", { exact: true })).toBeHidden();
    await expect(page.getByRole("button", { name: "Restore" })).toBeHidden();
  });
});
