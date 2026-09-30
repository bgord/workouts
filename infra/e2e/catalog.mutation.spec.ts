// cSpell:ignore unassigns
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Catalog - admin", () => {
  test.use({ storageState: ".auth/admin.json" });
  test.describe.configure({ mode: "serial" });

  test("adds a category", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("Category name").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

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
    await page.reload();

    await expect(page.getByRole("heading", { level: 1, name: "Neck flexion" })).toBeVisible();
  });

  test("assigns the category to the exercise", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByPlaceholder("Search by name").fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await page.getByRole("button", { name: "Assign" }).click();
    await page.getByLabel("Category to assign").selectOption({ label: "Neck" });
    await page.getByRole("button", { name: "Assign" }).click();
    await page.reload();

    await expect(page.getByText("Neck", { exact: true })).toBeVisible();
  });

  test("renames the category", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page
      .getByTitle("Rename the category")
      .filter({ hasText: /^Neck$/ })
      .click();
    await page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Cancel" }) })
      .getByLabel("Category name")
      .fill("Neck and traps");
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();
    await page.getByPlaceholder("Search by name").fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await expect(page.getByText("Neck and traps", { exact: true }).first()).toBeVisible();
  });

  test("edits the exercise description", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByPlaceholder("Search by name").fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await page.getByTitle("Edit the description").click();
    await page.getByLabel("Description").fill("Lie on your back, curl the head up against a light plate.");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page.reload();

    await expect(page.getByText("Lie on your back, curl the head up against a light plate.")).toBeVisible();
  });

  test("changes the exercise image", async ({ page }) => {
    const image = page.getByRole("img", { name: "Neck flexion" }).first();

    await page.goto("/catalog");
    await page.getByPlaceholder("Search by name").fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();
    const before = await image.getAttribute("src");

    await page.getByRole("button", { name: "Change image", exact: true }).click();
    await page
      .locator('input[type="file"]')
      .setInputFiles(`scripts/seed/assets/${fixtures.exercises.pecDeck.image}`);
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(async () => {
      await page.reload();
      await expect(image).not.toHaveAttribute("src", before ?? "", { timeout: 1000 });
    }).toPass();
  });

  test("unassigns the category from the exercise", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByPlaceholder("Search by name").fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await page.getByTitle("Unassign Neck and traps").click();
    await page.reload();

    await expect(page.getByText("No categories assigned")).toBeVisible();
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

  test("deletes the unused category", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByRole("button", { name: "Delete Neck and traps" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await page.reload();

    await expect(page.getByText("Neck and traps")).toBeHidden();
  });
});
