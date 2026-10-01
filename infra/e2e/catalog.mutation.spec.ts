// cSpell:ignore unassigns
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Catalog - admin", () => {
  test.use({ storageState: ".auth/admin.json" });
  test.describe.configure({ mode: "serial" });

  test("rejects a too short category name", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("Category name").fill("ab");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByLabel("Category name").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByText("ab", { exact: true })).toBeHidden();
  });

  test("adds a category", async ({ page }) => {
    const dialog = page.getByRole("dialog", { name: "Categories" });

    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    const added = page.waitForResponse("**/api/exercises/category");
    await page.getByLabel("Category name").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await added;

    await expect(async () => {
      await page.reload();
      await page.getByRole("button", { name: "Categories", exact: true }).click();
      await expect(dialog.getByText("Neck", { exact: true })).toBeVisible({ timeout: 1000 });
    }).toPass();
  });

  test("rejects a duplicate category name", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("Category name").fill(fixtures.categories.abs.name);
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Could not add the category")).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Abs" })).toHaveCount(1);
  });

  test("rejects a too short exercise name and description", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "New exercise" }).click();
    await page.getByLabel("Select an image").setInputFiles("scripts/seed/assets/exercise.webp");
    await page.getByLabel("Exercise name").fill("ab");
    await page.getByLabel("Description").fill("ab");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByLabel("Exercise name").and(page.locator(":invalid"))).toHaveCount(1);
    await expect(page.getByLabel("Description").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByText("32 of 32")).toBeVisible();
  });

  test("rejects a duplicate exercise name", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "New exercise" }).click();
    await page.getByLabel("Select an image").setInputFiles("scripts/seed/assets/exercise.webp");
    await page.getByLabel("Exercise name").fill(fixtures.exercises.facePull.name);
    await page
      .getByLabel("Description")
      .fill("Lie on your back, curl the head up with a plate on the forehead.");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Could not add the exercise")).toBeVisible();

    await page.reload();

    await expect(page.getByText("32 of 32")).toBeVisible();
  });

  test("adds an exercise", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "New exercise" }).click();
    await page.getByLabel("Select an image").setInputFiles("scripts/seed/assets/exercise.webp");
    await page.getByLabel("Exercise name").fill("Neck curl");
    await page
      .getByLabel("Description")
      .fill("Lie on your back, curl the head up with a plate on the forehead.");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("33 of 33")).toBeVisible();
  });

  test("rejects a too short new exercise name", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck curl");
    await page.getByRole("link", { name: /Neck curl/ }).click();

    await page.getByRole("button", { name: "Rename Neck curl" }).click();
    await page.getByLabel("Exercise name").fill("ab");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByLabel("Exercise name").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("heading", { level: 1, name: "Neck curl" })).toBeVisible();
  });

  test("renames the exercise", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck curl");
    await page.getByRole("link", { name: /Neck curl/ }).click();

    await page.getByRole("button", { name: "Rename Neck curl" }).click();
    await page.getByLabel("Exercise name").fill("Neck flexion");
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.getByRole("heading", { level: 1, name: "Neck flexion" })).toBeVisible();
  });

  test("assigns the category to the exercise", async ({ page }) => {
    const categories = page.getByRole("list", { name: "Categories" });

    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await page.getByRole("button", { name: "Assign" }).click();
    await page.getByLabel("Category to assign").selectOption({ label: "Neck" });
    await page.getByRole("button", { name: "Assign" }).click();
    await page.reload();

    await expect(categories.getByText("Neck", { exact: true })).toBeVisible();
  });

  test("rejects a too short new category name", async ({ page }) => {
    const field = page.getByRole("form", { name: "Rename Neck" }).getByLabel("Category name");

    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByRole("button", { name: "Rename Neck" }).click();
    await field.fill("ab");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(field.and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Neck" })).toBeVisible();
  });

  test("renames the category", async ({ page }) => {
    const categories = page.getByRole("list", { name: "Categories" });

    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByRole("button", { name: "Rename Neck" }).click();
    await page.getByRole("form", { name: "Rename Neck" }).getByLabel("Category name").fill("Neck and traps");
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await expect(categories.getByText("Neck and traps", { exact: true })).toBeVisible();
  });

  test("rejects a too short exercise description", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await page
      .getByRole("button", { name: "Lie on your back, curl the head up with a plate on the forehead." })
      .click();
    await page.getByLabel("Description").fill("ab");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByLabel("Description").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(
      page.getByText("Lie on your back, curl the head up with a plate on the forehead."),
    ).toBeVisible();
  });

  test("edits the exercise description", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await page
      .getByRole("button", { name: "Lie on your back, curl the head up with a plate on the forehead." })
      .click();
    await page.getByLabel("Description").fill("Lie on your back, curl the head up against a light plate.");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page.reload();

    await expect(page.getByText("Lie on your back, curl the head up against a light plate.")).toBeVisible();
  });

  test("changes the exercise image", async ({ page }) => {
    const image = page.getByRole("img", { name: "Neck flexion" }).first();

    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();
    const before = await image.getAttribute("src");

    await page.getByRole("button", { name: "Change image", exact: true }).click();
    await page.getByLabel("Select an image").setInputFiles("scripts/seed/assets/exercise-alternative.webp");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(async () => {
      await page.reload();
      await expect(image).not.toHaveAttribute("src", before ?? "", { timeout: 1000 });
    }).toPass();
  });

  test("unassigns the category from the exercise", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: /Neck flexion/ }).click();

    await page.getByRole("button", { name: "Unassign Neck and traps" }).click();
    await page.reload();

    await expect(page.getByText("No categories assigned")).toBeVisible();
  });

  test("deletes the unused exercise", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
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

  test("deletes a category assigned to an exercise", async ({ page }) => {
    const categories = page.getByRole("list", { name: "Categories" });

    await page.goto("/catalog");
    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("Category name").fill("Grip");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await page.goto(`/catalog/exercise/${fixtures.exercises.hammerCurlDumbbells.id}`);
    await page.getByRole("button", { name: "Assign", exact: true }).click();
    await page.getByLabel("Category to assign").selectOption({ label: "Grip" });
    await page.getByRole("button", { name: "Assign", exact: true }).click();
    await page.reload();

    await page.goto("/catalog");
    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByRole("button", { name: "Delete Grip" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await page.goto(`/catalog/exercise/${fixtures.exercises.hammerCurlDumbbells.id}`);

    await expect(categories.getByText("Grip", { exact: true })).toBeHidden();
    await expect(categories.getByText("Biceps", { exact: true })).toBeVisible();
    await expect(categories.getByText("Forearms", { exact: true })).toBeVisible();
  });
});
