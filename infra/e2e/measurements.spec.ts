// cSpell:ignore spinbutton
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

  test("lists the history of a body part", async ({ page }) => {
    const row = page.getByRole("listitem").filter({ hasText: fixtures.athlete.bodyParts.waist.name });

    await page.goto("/measurements/body-parts");

    await row.getByRole("button").first().click();

    await expect(row.getByTitle("Correct the measurement")).toHaveCount(12);
    await expect(row.getByTitle("Correct the measurement").first()).toContainText("81.4 cm");
    await expect(row.getByTitle("Correct the measurement").last()).toContainText("82.0 cm");
  });

  test("marks the body part that was never measured", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await expect(page.getByText("Not measured yet").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.calfRight.name}` }),
    ).toBeVisible();
  });

  test("downloads the body weight export", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: "Export", exact: true }).click();

    expect((await download).suggestedFilename()).toMatch(/\.csv$/);
  });

  test("downloads the body weight import template", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "Import measurements" }).click();

    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: "CSV template" }).click();

    expect((await download).suggestedFilename()).toMatch(/\.csv$/);
  });

  test("downloads the body part export", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: "Export body part measurements" }).click();

    expect((await download).suggestedFilename()).toMatch(/\.csv$/);
  });

  test("downloads the body part import template", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Import body part measurements" }).click();

    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: "CSV template" }).click();

    expect((await download).suggestedFilename()).toMatch(/\.csv$/);
  });

  test("shows the error when logging the body weight fails", async ({ page }) => {
    await page.route("**/api/measurements/body-weight/measure", (route) => route.fulfill({ status: 500 }));
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("85");
    await page.getByRole("button", { name: "Log", exact: true }).click();

    await expect(page.getByText("Could not log the body weight")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "85 kg", exact: true })).toBeHidden();
  });

  test("shows the error when correcting the body weight fails", async ({ page }) => {
    await page.route("**/api/measurements/body-weight/measurement/*", (route) =>
      route.request().method() === "PATCH" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto("/measurements/body-weight");

    await page.getByRole("listitem").getByRole("button", { name: / kg$/ }).first().click();
    await page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Cancel" }) })
      .getByRole("spinbutton", { name: "Weight (kg)" })
      .fill("85");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not correct the measurement")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "85 kg", exact: true })).toBeHidden();
  });

  test("shows the error when setting the reference fails", async ({ page }) => {
    await page.route("**/api/measurements/body-weight/measurement/*/reference", (route) =>
      route.fulfill({ status: 500 }),
    );
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "Use as the reference point" }).first().click();
    await page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Cancel" }) })
      .getByRole("button", { name: "Cut" })
      .click();
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not set the reference point")).toBeVisible();

    await page.reload();

    await expect(page.getByText(/^Bulk since /)).toBeVisible();
  });

  test("shows the error when measuring a body part fails", async ({ page }) => {
    await page.route("**/api/measurements/body-part/*/measure", (route) => route.fulfill({ status: 500 }));
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.calfRight.name}` }).click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("38.5");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not save the measurement")).toBeVisible();

    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athlete.bodyParts.calfRight.name })
        .getByText("Not measured yet")
        .first(),
    ).toBeVisible();
  });

  test("shows the error when correcting a body part measurement fails", async ({ page }) => {
    await page.route("**/api/measurements/body-part/measurement/*", (route) =>
      route.request().method() === "PATCH" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto("/measurements/body-parts");
    await page
      .getByRole("listitem")
      .filter({ hasText: fixtures.athlete.bodyParts.waist.name })
      .getByRole("button")
      .first()
      .click();

    await page.getByTitle("Correct the measurement").first().click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("39.5");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not correct the measurement")).toBeVisible();

    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athlete.bodyParts.waist.name })
        .getByText("39.5 cm"),
    ).toBeHidden();
  });

  test("shows the error when renaming a body part fails", async ({ page }) => {
    await page.route("**/api/measurements/body-part/*", (route) =>
      route.request().method() === "PATCH" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();
    await page.getByRole("button", { name: fixtures.athlete.bodyParts.waist.name, exact: true }).click();
    await page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Cancel" }) })
      .getByLabel("Body part name")
      .fill("Waist girth");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not rename the body part")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.waist.name}` }),
    ).toBeVisible();
  });

  test("shows the error when deleting a body part fails", async ({ page }) => {
    await page.route("**/api/measurements/body-part/*", (route) =>
      route.request().method() === "DELETE" ? route.fulfill({ status: 500 }) : route.continue(),
    );
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();
    await page.getByRole("button", { name: `Delete ${fixtures.athlete.bodyParts.waist.name}` }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByText("Could not delete the body part")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.waist.name}` }),
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

  test("shows the error when defining a body part fails", async ({ page }) => {
    await page.route("**/api/measurements/body-part", (route) => route.fulfill({ status: 500 }));
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();
    await page.getByLabel("Body part name").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Could not add the body part")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Define a body part first")).toBeVisible();
  });
});
