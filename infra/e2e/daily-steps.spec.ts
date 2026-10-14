// cSpell:ignore spinbutton
import { expect, test } from "./test";

test.describe("Daily steps - empty", () => {
  test.use({ storageState: ".auth/empty.json" });

  test("shows the daily steps empty state", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await expect(page.getByText("No steps yet")).toBeVisible();
    await expect(page.getByText("Log your daily steps to see them here")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log", exact: true })).toBeDisabled();
    await expect(page.getByRole("listitem", { name: "Latest steps" })).toBeHidden();
  });
});

test.describe("Daily steps - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("shows the daily steps stats", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await expect(page.getByRole("listitem", { name: "Latest steps" })).toBeVisible();
    await expect(page.getByRole("listitem", { name: "7-day average" })).toBeVisible();
    await expect(page.getByRole("listitem", { name: "30-day average" })).toBeVisible();
  });

  test("shows the latest steps as recorded yesterday", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    const context = page
      .getByRole("listitem", { name: "Latest steps" })
      .getByText("yesterday", { exact: true });

    await expect(context).toBeVisible();
    await expect(context).toHaveAttribute("title", /^\w{3} \d{1,2}, \d{4}$/);
  });

  test("shows a positive delta since the previous day", async ({ page }) => {
    const tile = page.getByRole("listitem", { name: "Latest steps" });

    await page.goto("/measurements/daily-steps");

    await expect(tile.getByRole("img", { name: "Increase" })).toBeVisible();
    await expect(tile.getByText("10,200 steps", { exact: true })).toBeVisible();
  });

  test("prefills the steps input with the latest count", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await expect(page.getByRole("spinbutton", { name: "Steps" })).toHaveValue("10200");
  });

  test("shows the progress chart in weekly granularity by default and changes it", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await expect(page.getByRole("heading", { name: "Progress" })).toBeVisible();
    await expect(page.getByRole("img", { name: "Progress" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Group by" })).toHaveValue("weekly");

    await page.getByRole("combobox", { name: "Group by" }).selectOption("daily");

    await expect(page).toHaveURL("/measurements/daily-steps?chart=daily");
    await expect(page.getByRole("combobox", { name: "Group by" })).toHaveValue("daily");
  });

  test("falls back to weekly granularity for an invalid chart", async ({ page }) => {
    await page.goto("/measurements/daily-steps?chart=no-such-granularity");

    await expect(page.getByRole("combobox", { name: "Group by" })).toHaveValue("weekly");
  });

  test("lists the daily steps history and filters it by month", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
    await expect(
      page.getByRole("combobox", { name: "Month" }).getByRole("option", { name: "All months" }),
    ).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Remove steps" }).first()).toBeVisible();

    await page.getByRole("combobox", { name: "Month" }).selectOption({ label: "All months" });

    await expect(page).toHaveURL("/measurements/daily-steps?month=all");
    await expect(page.getByRole("combobox", { name: "Month" })).toHaveValue("all");
  });

  test("falls back to the default month for an invalid month", async ({ page }) => {
    await page.goto("/measurements/daily-steps?month=2026-13");

    await expect(page.getByRole("combobox", { name: "Month" })).not.toHaveValue("2026-13");
    await expect(page.getByRole("combobox", { name: "Month" })).not.toHaveValue("all");
  });

  test("downloads the daily steps export", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("button", { name: "More actions" }).click();

    const download = page.waitForEvent("download");
    await page.getByRole("menuitem", { name: "Export" }).click();

    expect((await download).suggestedFilename()).toMatch(/\.csv$/);
  });

  test("downloads the daily steps import template", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Import steps" }).click();

    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: "CSV template" }).click();

    expect((await download).suggestedFilename()).toMatch(/\.csv$/);
  });

  test("shows the error when logging the steps fails", async ({ page }) => {
    await page.route("**/api/measurements/daily-steps/record", (route) => route.fulfill({ status: 500 }));
    await page.goto("/measurements/daily-steps");

    await page.getByRole("spinbutton", { name: "Steps" }).fill("12500");
    await page.getByRole("button", { name: "Log", exact: true }).click();

    await expect(page.getByText("Could not log the steps")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "12,500 steps", exact: true })).toBeHidden();
  });

  test("shows the error when correcting the steps fails", async ({ page }) => {
    await page.route("**/api/measurements/daily-steps/record", (route) => route.fulfill({ status: 500 }));
    await page.goto("/measurements/daily-steps");

    await page.getByRole("button", { name: "10,200 steps", exact: true }).click();
    await page
      .getByRole("form", { name: "Correct steps" })
      .getByRole("spinbutton", { name: "Steps" })
      .fill("12500");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Could not correct the steps")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "12,500 steps", exact: true })).toBeHidden();
  });
});
