import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Measurements - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("links to body weight and body parts", async ({ page }) => {
    await page.goto("/measurements");

    await expect(page.getByRole("heading", { level: 1, name: "Measurements" })).toBeVisible();
    await expect(page.locator('a[href="/measurements/body-weight"]')).toBeVisible();
    await expect(page.locator('a[href="/measurements/body-parts"]')).toBeVisible();
  });

  test("shows the body weight stats with the bulk reference", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByText("Latest weight")).toBeVisible();
    await expect(page.getByText("7-day average")).toBeVisible();
    await expect(page.getByText("Since reference", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/^Bulk since /)).toBeVisible();
  });

  test("shows the progress chart in weekly granularity by default", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByRole("heading", { name: "Progress" })).toBeVisible();
    await expect(page.getByRole("img", { name: "Progress" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Granularity" })).toHaveValue("weekly");
  });

  test("changes the chart granularity", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("combobox", { name: "Granularity" }).selectOption("daily");

    await expect(page).toHaveURL(/\/measurements\/body-weight\?chart=daily/);
    await expect(page.getByRole("combobox", { name: "Granularity" })).toHaveValue("daily");
  });

  test("filters the history by month", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("combobox", { name: "Month" }).selectOption({ label: "All months" });

    await expect(page).toHaveURL(/\/measurements\/body-weight/);
    await expect(page.getByRole("combobox", { name: "Month" })).toHaveValue("all");
  });

  test("lists the measurement history with a month filter", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
    await expect(
      page.getByRole("combobox", { name: "Month" }).getByRole("option", { name: "All months" }),
    ).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Remove the measurement" }).first()).toBeVisible();
  });

  test("lists the defined body parts", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await expect(page.getByRole("heading", { level: 1, name: "Body parts" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.waist.name}` }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.chest.name}` }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.armRight.name}` }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.thighRight.name}` }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.calfRight.name}` }),
    ).toBeVisible();
  });

  test("marks the body part that was never measured", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await expect(page.getByText("Not measured yet").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.calfRight.name}` }),
    ).toBeVisible();
  });
});

test.describe("Measurements - empty", () => {
  test.use({ storageState: ".auth/empty.json" });

  test("shows the body weight empty state", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByText("No measurements logged yet")).toBeVisible();
    await expect(page.getByText("Log your body weight to track progress here")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log" })).toBeDisabled();
    await expect(page.getByText("Latest weight")).toBeHidden();
  });

  test("blocks importing body part measurements until a body part is defined", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await expect(page.getByText("Define a body part first")).toBeVisible();
    await expect(page.getByRole("button", { name: "Import body part measurements" })).toBeDisabled();
  });
});
