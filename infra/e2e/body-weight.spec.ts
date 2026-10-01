// cSpell:ignore spinbutton
import { expect, test } from "./test";

test.describe("Body weight - empty", () => {
  test.use({ storageState: ".auth/empty.json" });

  test("shows the body weight empty state", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByText("No measurements logged yet")).toBeVisible();
    await expect(page.getByText("Log your body weight to track progress here")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log" })).toBeDisabled();
    await expect(page.getByRole("listitem", { name: "Latest weight" })).toBeHidden();
  });
});

test.describe("Body weight - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("shows the body weight stats with the bulk reference", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByRole("listitem", { name: "Latest weight" })).toBeVisible();
    await expect(page.getByRole("listitem", { name: "7-day average" })).toBeVisible();
    await expect(page.getByRole("listitem", { name: "Since reference" })).toBeVisible();
    await expect(page.getByText(/^Bulk since /)).toBeVisible();
  });

  test("shows a positive delta since the bulk reference", async ({ page }) => {
    const tile = page.getByRole("listitem", { name: "Since reference" });

    await page.goto("/measurements/body-weight");

    await expect(tile.getByRole("img", { name: "Increase" })).toBeVisible();
    await expect(tile).toContainText(/\d kg/);
  });

  test("shows the progress chart in weekly granularity by default and changes it", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByRole("heading", { name: "Progress" })).toBeVisible();
    await expect(page.getByRole("img", { name: "Progress" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Granularity" })).toHaveValue("weekly");

    await page.getByRole("combobox", { name: "Granularity" }).selectOption("daily");

    await expect(page).toHaveURL("/measurements/body-weight?chart=daily");
    await expect(page.getByRole("combobox", { name: "Granularity" })).toHaveValue("daily");
  });

  test("lists the measurement history and filters it by month", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
    await expect(
      page.getByRole("combobox", { name: "Month" }).getByRole("option", { name: "All months" }),
    ).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Remove the measurement" }).first()).toBeVisible();

    await page.getByRole("combobox", { name: "Month" }).selectOption({ label: "All months" });

    await expect(page).toHaveURL("/measurements/body-weight?month=all");
    await expect(page.getByRole("combobox", { name: "Month" })).toHaveValue("all");
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
      .getByRole("form", { name: "Correct the measurement" })
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
      .getByRole("form", { name: "Use as the reference point" })
      .getByRole("button", { name: "Cut" })
      .click();
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not set the reference point")).toBeVisible();

    await page.reload();

    await expect(page.getByText(/^Bulk since /)).toBeVisible();
  });
});
