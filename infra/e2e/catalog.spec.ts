// cSpell:ignore unpresses
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Catalog - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("lists the whole catalog", async ({ page }) => {
    await page.goto("/catalog");

    await expect(page.getByText("32 of 32")).toBeVisible();
    await expect(
      page.locator(`a[href="/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}"]`),
    ).toBeVisible();
  });

  test("searches by name", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByPlaceholder("Search by name").fill(fixtures.exercises.facePull.name);

    await expect(page.getByText("1 of 32")).toBeVisible();
    await expect(page.locator(`a[href="/catalog/exercise/${fixtures.exercises.facePull.id}"]`)).toBeVisible();
    await expect(
      page.locator(`a[href="/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}"]`),
    ).toBeHidden();
  });

  test("filters by category and clears the filters", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }).click();

    await expect(page.getByText("6 of 32")).toBeVisible();
    await expect(
      page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Clear" }).click();

    await expect(page.getByText("32 of 32")).toBeVisible();
  });

  test("shows the empty state when nothing matches", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByPlaceholder("Search by name").fill("no such exercise");

    await expect(page.getByText("No exercises match the filters")).toBeVisible();
    await expect(page.getByText("Try another name or category")).toBeVisible();
  });

  test("shows more categories on demand", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByText("+8 more").click();

    await expect(page.getByRole("button", { name: fixtures.categories.lowerBack.name })).toBeVisible();
    await expect(page.getByText("Show less")).toBeVisible();
  });

  test("shows less categories", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByText("+8 more").click();
    await page.getByText("Show less").click();

    await expect(page.getByText("+8 more")).toBeVisible();
    await expect(page.getByRole("button", { name: fixtures.categories.lowerBack.name })).toBeHidden();
  });

  test("unpresses the category", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }).click();
    await page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }).click();

    await expect(page.getByText("32 of 32")).toBeVisible();
    await expect(
      page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  test("combines the search and the category", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }).click();
    await page.getByPlaceholder("Search by name").fill("Pec");

    await expect(page.getByText("3 of 32")).toBeVisible();
  });

  test("keeps a hidden selected category visible", async ({ page }) => {
    await page.goto(`/catalog?category=${fixtures.categories.lowerBack.id}`);

    await expect(page.getByRole("button", { name: fixtures.categories.lowerBack.name })).toBeVisible();
    await expect(page.getByRole("button", { name: fixtures.categories.lowerBack.name })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("hides the catalog management", async ({ page }) => {
    await page.goto("/catalog");

    await expect(page.getByRole("button", { name: "New exercise" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Categories", exact: true })).toBeHidden();
  });
});

test.describe("Catalog - admin", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("shows the catalog management", async ({ page }) => {
    await page.goto("/catalog");

    await expect(page.getByRole("button", { name: "New exercise" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Categories", exact: true })).toBeEnabled();
  });

  test("shows the error when adding a category fails", async ({ page }) => {
    await page.route("**/api/exercises/category", (route) => route.fulfill({ status: 500 }));
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("Category name").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Could not add the category")).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByText("Neck", { exact: true })).toBeHidden();
  });

  test("shows the error when renaming a category fails", async ({ page }) => {
    await page.route("**/api/exercises/category/*", (route) =>
      route.request().method() === "PATCH" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByTitle("Rename the category").filter({ hasText: /^Abs$/ }).click();
    await page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Cancel" }) })
      .getByLabel("Category name")
      .fill("Abs and core");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not rename the category")).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByTitle("Rename the category").filter({ hasText: /^Abs$/ })).toBeVisible();
  });

  test("shows the error when deleting a category fails", async ({ page }) => {
    await page.route("**/api/exercises/category/*", (route) =>
      route.request().method() === "DELETE" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByRole("button", { name: "Delete Abs" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByText("Could not delete the category")).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByRole("button", { name: "Delete Abs" })).toBeVisible();
  });

  test("shows the error when adding an exercise fails", async ({ page }) => {
    await page.route("**/api/exercises/add", (route) => route.fulfill({ status: 500 }));
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

    await expect(page.getByText("Could not add the exercise")).toBeVisible();

    await page.reload();

    await expect(page.getByText("32 of 32")).toBeVisible();
  });
});
