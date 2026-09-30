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

    await expect(page.getByRole("button", { name: fixtures.categories.upperMidBack.name })).toBeVisible();
    await expect(page.getByText("Show less")).toBeVisible();
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
});
