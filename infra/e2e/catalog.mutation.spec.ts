import { expect, test } from "@playwright/test";
import * as fixtures from "../../scripts/seed/fixtures";

test.describe("Catalog - admin", () => {
  test.use({ storageState: ".auth/admin.json" });
  test.describe.configure({ mode: "serial" });

  test("adds a category", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("Category name").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Neck", { exact: true })).toBeVisible();
  });

  test("adds an exercise", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "New exercise" }).click();
    await page
      .locator('input[type="file"]')
      .setInputFiles(`scripts/seed/assets/${fixtures.exercises.facePull.image}`);
    await page.getByPlaceholder("Bench Press Horizontal").fill("Neck curl");
    await page
      .getByLabel("Description")
      .fill("Lie on your back, curl the head up with a plate on the forehead.");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("33 of 33")).toBeVisible();
  });

  test("renames the exercise", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByPlaceholder("Search by name").fill("Neck curl");
    await page.getByRole("link", { name: /Neck curl/ }).click();

    await page.getByRole("heading", { level: 1 }).getByRole("button").click();
    await page.getByLabel("Exercise name").fill("Neck flexion");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Neck flexion" })).toBeVisible();
  });

  test("assigns the category to the exercise", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByPlaceholder("Search by name").fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await page.getByRole("button", { name: "Assign" }).click();
    await page.getByLabel("Category to assign").selectOption({ label: "Neck" });
    await page.getByRole("button", { name: "Assign" }).click();

    await expect(page.getByText("Neck", { exact: true })).toBeVisible();
  });

  test("deletes the unused exercise", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByPlaceholder("Search by name").fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await page.getByRole("button", { name: "Delete Neck flexion" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page).toHaveURL(/\/catalog/);
    await expect(page.getByText("32 of 32")).toBeVisible();
  });
});
