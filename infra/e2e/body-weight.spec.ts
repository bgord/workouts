// cSpell:ignore spinbutton
import { expect, test } from "./test";

test.describe("Body weight - empty", () => {
  test.use({ storageState: ".auth/empty.json" });

  test("shows the body weight empty state", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByText("No measurements yet")).toBeVisible();
    await expect(page.getByText("Log your body weight to track progress here")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log", exact: true })).toBeDisabled();
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

  test("shows the latest weight as measured yesterday", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    const context = page
      .getByRole("listitem", { name: "Latest weight" })
      .getByText("Yesterday", { exact: true });

    await expect(context).toBeVisible();
    await expect(context).toHaveAttribute("title", /^\w{3}, \w{3} \d{1,2}, \d{4}$/);
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
    await expect(page.getByRole("combobox", { name: "Group by" })).toHaveValue("weekly");

    await page.getByRole("combobox", { name: "Group by" }).selectOption("daily");

    await expect(page).toHaveURL("/measurements/body-weight?chart=daily");
    await expect(page.getByRole("combobox", { name: "Group by" })).toHaveValue("daily");
  });

  test("falls back to weekly granularity for an invalid chart", async ({ page }) => {
    await page.goto("/measurements/body-weight?chart=no-such-granularity");

    await expect(page.getByRole("combobox", { name: "Group by" })).toHaveValue("weekly");
  });

  test("lists the measurement history and filters it by month", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
    await expect(
      page.getByRole("combobox", { name: "Month" }).getByRole("option", { name: "All months" }),
    ).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Remove measurement" }).first()).toBeVisible();

    await page.getByRole("combobox", { name: "Month" }).selectOption({ label: "All months" });

    await expect(page).toHaveURL("/measurements/body-weight?month=all");
    await expect(page.getByRole("combobox", { name: "Month" })).toHaveValue("all");
  });

  test("falls back to the default month for an invalid month", async ({ page }) => {
    await page.goto("/measurements/body-weight?month=2026-13");

    await expect(page.getByRole("combobox", { name: "Month" })).not.toHaveValue("2026-13");
    await expect(page.getByRole("combobox", { name: "Month" })).not.toHaveValue("all");
  });

  test("downloads the body weight export", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: "Export", exact: true }).click();

    expect((await download).suggestedFilename()).toMatch(/\.csv$/);
  });

  test("downloads the body weight import template", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "Import body weight" }).click();

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
      .getByRole("form", { name: "Correct measurement" })
      .getByRole("spinbutton", { name: "Weight (kg)" })
      .fill("85");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not correct the measurement")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "85 kg", exact: true })).toBeHidden();
  });

  test("shows the error when setting the reference fails", async ({ page }) => {
    await page.route("**/api/measurements/body-weight/measurement/*/reference", (route) =>
      route.fulfill({ status: 500 }),
    );
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "Set as reference" }).first().click();
    await page.getByRole("form", { name: "Set as reference" }).getByRole("button", { name: "Cut" }).click();
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not set the reference point")).toBeVisible();

    await page.reload();

    await expect(page.getByText(/^Bulk since /)).toBeVisible();
  });
});
