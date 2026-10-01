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
  test("shows the exercise details", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    await expect(
      page.getByRole("heading", { level: 1, name: fixtures.exercises.superHorizontalBenchPress.name }),
    ).toBeVisible();
    await expect(page.getByText(fixtures.exercises.superHorizontalBenchPress.description)).toBeVisible();
    await expect(page.getByText(fixtures.categories.chest.name, { exact: true })).toBeVisible();
    await expect(page.getByText(fixtures.categories.shoulders.name, { exact: true })).toBeVisible();
    await expect(page.getByText(fixtures.categories.triceps.name, { exact: true })).toBeVisible();
  });

  test("shows the exercise stats", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    await expect(page.getByRole("listitem").filter({ hasText: "Sessions" })).toContainText("8");
    await expect(page.getByRole("listitem").filter({ hasText: "Best volume" })).toContainText("kg");
    await expect(page.getByRole("listitem").filter({ hasText: "1RM" })).toContainText("kg");
  });

  test("shows the exercise progress chart", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    const chart = page.getByRole("img", { name: "Progress" });

    await expect(chart).toBeVisible();
    await expect(chart.getByRole("link")).toHaveCount(8);
  });

  test("lists the exercise history with the record session", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    const history = page.getByRole("heading", { name: "History" }).locator("..");

    await expect(history.getByRole("link")).toHaveCount(8);
    await expect(history.getByRole("img", { name: "1RM" })).toHaveCount(1);
  });

  test("expands a history session to its sets", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    const history = page.getByRole("heading", { name: "History" }).locator("..");

    await expect(history.getByRole("listitem")).toHaveCount(8);

    await history.getByRole("button").first().click();

    await expect(history.getByRole("listitem")).not.toHaveCount(8);
  });

  test("keeps the history session expanded and collapsed after reload", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    const history = page.getByRole("heading", { name: "History" }).locator("..");

    await history.getByRole("button").first().click();
    await page.reload();

    await expect(history.getByRole("listitem")).not.toHaveCount(8);

    await history.getByRole("button").first().click();
    await page.reload();

    await expect(history.getByRole("listitem")).toHaveCount(8);
  });

  test("shows the empty state for an exercise that was never trained", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.bicepsCurlBarStraight.id}`);

    await expect(page.getByText("No sessions logged yet")).toBeVisible();
    await expect(page.getByRole("img", { name: "Progress" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "History" })).toBeHidden();
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

  test("blocks deleting an exercise used in a plan", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    await expect(page.getByText("Remove the exercise from plans").locator("visible=true")).toBeVisible();
    await expect(page.getByRole("button", { name: "Delete" })).toBeDisabled();
  });

  test("blocks assigning a fifth category", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.latPullDownCable.id}`);

    await expect(page.getByText("Up to 4 categories available")).toBeVisible();
    await expect(page.getByRole("button", { name: "Assign", exact: true })).toBeDisabled();
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

  test("shows the error when assigning a category fails", async ({ page }) => {
    await page.route("**/api/exercises/category/assign", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    await page.getByRole("button", { name: "Assign", exact: true }).click();
    await page.getByLabel("Category to assign").selectOption({ label: "Abs" });
    await page.getByRole("button", { name: "Assign", exact: true }).last().click();

    await expect(page.getByText("Could not change the categories")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Abs", { exact: true })).toBeHidden();
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

  test("shows the error when renaming an exercise fails", async ({ page }) => {
    await page.route("**/api/exercises/*", (route) =>
      route.request().method() === "PATCH" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/catalog/exercise/${fixtures.exercises.pecDeck.id}`);

    await page.getByRole("heading", { level: 1 }).getByRole("button").click();
    await page.getByLabel("Exercise name").fill("Pec deck fly");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not update the exercise")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", { level: 1, name: fixtures.exercises.pecDeck.name }),
    ).toBeVisible();
  });

  test("shows the error when editing the description fails", async ({ page }) => {
    await page.route("**/api/exercises/*", (route) =>
      route.request().method() === "PATCH" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/catalog/exercise/${fixtures.exercises.pecDeck.id}`);

    await page.getByTitle("Edit the description").click();
    await page.getByLabel("Description").fill("Seated fly on the machine, squeeze at the front.");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not update the exercise")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Seated fly on the machine, squeeze at the front.")).toBeHidden();
  });

  test("shows the error when changing the image fails", async ({ page }) => {
    const image = page.getByRole("img", { name: fixtures.exercises.pecDeck.name }).first();

    await page.route("**/api/exercises/*/image", (route) => route.fulfill({ status: 500 }));
    await page.goto(`/catalog/exercise/${fixtures.exercises.pecDeck.id}`);
    const before = await image.getAttribute("src");

    await page.getByRole("button", { name: "Change image", exact: true }).click();
    await page
      .locator('input[type="file"]')
      .setInputFiles(`scripts/seed/assets/${fixtures.exercises.facePull.image}`);
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not change the image")).toBeVisible();

    await page.reload();

    await expect(image).toHaveAttribute("src", before ?? "");
  });

  test("shows the error when deleting an exercise fails", async ({ page }) => {
    await page.route("**/api/exercises/*", (route) =>
      route.request().method() === "DELETE" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/catalog/exercise/${fixtures.exercises.pecDeck.id}`);

    await page.getByRole("button", { name: `Delete ${fixtures.exercises.pecDeck.name}` }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByText("Could not delete the exercise")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", { level: 1, name: fixtures.exercises.pecDeck.name }),
    ).toBeVisible();
  });
});
