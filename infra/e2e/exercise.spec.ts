import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Exercise - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("shows the empty state for an exercise that was never trained", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.bicepsCurlBarStraight.id}`);

    await expect(page.getByText("No sessions logged yet")).toBeVisible();
    await expect(page.getByRole("img", { name: "Progress" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "History" })).toBeHidden();
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

  test("keeps the history session expanded and collapsed after reload", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`);

    const history = page.getByRole("heading", { name: "History" }).locator("..");

    await history
      .getByRole("button", { name: /^Details: / })
      .first()
      .click();
    await page.reload();

    await expect(history.getByRole("listitem")).not.toHaveCount(8);

    await history
      .getByRole("button", { name: /^Details: / })
      .first()
      .click();
    await page.reload();

    await expect(history.getByRole("listitem")).toHaveCount(8);
  });
});

test.describe("Exercise - admin", () => {
  test.use({ storageState: ".auth/admin.json" });

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

  test("shows the error when renaming an exercise fails", async ({ page }) => {
    await page.route("**/api/exercises/*", (route) =>
      route.request().method() === "PATCH" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto(`/catalog/exercise/${fixtures.exercises.pecDeck.id}`);

    await page.getByRole("button", { name: `Rename ${fixtures.exercises.pecDeck.name}` }).click();
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
      .getByLabel("Select an image")
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
