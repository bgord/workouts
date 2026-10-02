// cSpell:ignore unpresses
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Catalog - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("lists the whole catalog", async ({ page }) => {
    await page.goto("/catalog");

    await expect(page.getByText("32 of 32")).toBeVisible();
    await expect(
      page.getByRole("link", { name: fixtures.exercises.superHorizontalBenchPress.name }),
    ).toBeVisible();
  });

  test("searches by name", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("textbox", { name: "Search by name" }).fill(fixtures.exercises.facePull.name);

    await expect(page.getByText("1 of 32")).toBeVisible();
    await expect(page.getByRole("link", { name: fixtures.exercises.facePull.name })).toBeVisible();
    await expect(
      page.getByRole("link", { name: fixtures.exercises.superHorizontalBenchPress.name }),
    ).toBeHidden();
  });

  test("filters by category, unpresses it and clears the filters", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }).click();

    await expect(page.getByText("6 of 32")).toBeVisible();
    await expect(
      page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }).click();

    await expect(page.getByText("32 of 32")).toBeVisible();
    await expect(
      page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }),
    ).toHaveAttribute("aria-pressed", "false");

    await page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }).click();
    await page.getByRole("button", { name: "Clear" }).click();

    await expect(page.getByText("32 of 32")).toBeVisible();
  });

  test("combines the search and the category", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }).click();
    await page.getByRole("textbox", { name: "Search by name" }).fill("Pec");

    await expect(page.getByText("3 of 32")).toBeVisible();
  });

  test("shows more and less categories", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "+8 more" }).click();

    await expect(page.getByRole("button", { name: fixtures.categories.lowerBack.name })).toBeVisible();
    await expect(page.getByRole("button", { name: "Show less" })).toBeVisible();

    await page.getByRole("button", { name: "Show less" }).click();

    await expect(page.getByRole("button", { name: "+8 more" })).toBeVisible();
    await expect(page.getByRole("button", { name: fixtures.categories.lowerBack.name })).toBeHidden();
  });

  test("keeps a hidden selected category visible", async ({ page }) => {
    await page.goto(`/catalog?category=${fixtures.categories.lowerBack.id}`);

    await expect(page.getByRole("button", { name: fixtures.categories.lowerBack.name })).toBeVisible();
    await expect(page.getByRole("button", { name: fixtures.categories.lowerBack.name })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("shows the empty state for a malformed category", async ({ page }) => {
    await page.goto("/catalog?category=not-a-uuid");

    await expect(page.getByText("No exercises match the filters")).toBeVisible();
  });

  test("shows the empty state when nothing matches", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("textbox", { name: "Search by name" }).fill("no such exercise");

    await expect(page.getByText("No exercises match the filters")).toBeVisible();
    await expect(page.getByText("Try another name or category")).toBeVisible();
  });

  test("hides the catalog management", async ({ page }) => {
    await page.goto("/catalog");

    await expect(page.getByRole("button", { name: "New exercise" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Categories", exact: true })).toBeHidden();
  });

  test("restores the catalog category filter on browser back", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }).click();
    await expect(page).toHaveURL(`/catalog?category=${fixtures.categories.chest.id}`);
    await page.getByRole("list", { name: "Catalog" }).getByRole("link").first().click();
    await expect(page).toHaveURL(`/catalog/exercise/${fixtures.exercises.hammerStrengthIncline.id}`);

    await page.goBack();

    await expect(page).toHaveURL(`/catalog?category=${fixtures.categories.chest.id}`);
    await expect(page.getByText("6 of 32")).toBeVisible();
    await expect(
      page.getByRole("button", { name: fixtures.categories.chest.name, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
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
    const dialog = page.getByRole("dialog", { name: "Categories" });

    await page.route("**/api/exercises/category", (route) => route.fulfill({ status: 500 }));
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("Category name").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Could not add the category")).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(dialog.getByText("Neck", { exact: true })).toBeHidden();
  });

  test("shows the error when renaming a category fails", async ({ page }) => {
    await page.route("**/api/exercises/category/*", (route) =>
      route.request().method() === "PATCH" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByRole("button", { name: "Rename Abs" }).click();
    await page.getByRole("form", { name: "Rename Abs" }).getByLabel("Category name").fill("Abs and core");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not rename the category")).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Abs" })).toBeVisible();
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
    await page.getByLabel("Select image").setInputFiles("scripts/seed/assets/exercise.webp");
    await page.getByLabel("Exercise name").fill("Neck curl");
    await page
      .getByLabel("Description")
      .fill("Lie on your back, curl the head up with a plate on the forehead.");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Could not add the exercise")).toBeVisible();

    await page.reload();

    await expect(page.getByText("32 of 32")).toBeVisible();
  });
});
