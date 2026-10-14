// cSpell:ignore spinbutton
import { expect, test } from "./test";

test.describe("Daily steps - empty-mutation", () => {
  test.use({ storageState: ".auth/empty-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("logs the first daily steps", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("spinbutton", { name: "Steps" }).fill("8000");
    await page.getByRole("button", { name: "Log", exact: true }).click();

    await expect(page.getByRole("listitem", { name: "Latest steps" })).toBeVisible();
    await expect(page.getByText("No steps yet")).toBeHidden();
  });

  test("sets the first daily goal", async ({ page }) => {
    const goal = page.getByRole("group", { name: "Daily goal" });
    const row = page
      .getByRole("listitem")
      .filter({ has: page.getByRole("button", { name: "8,000 steps", exact: true }) });

    await page.goto("/measurements/daily-steps");

    await expect(goal.getByText("No goal yet", { exact: true })).toBeVisible();

    await goal.getByRole("button", { name: "Set goal" }).click();
    await goal.getByRole("spinbutton", { name: "Daily goal" }).fill("9000");
    await goal.getByRole("button", { name: "Save", exact: true }).click();

    await expect(goal.getByText("9,000 steps", { exact: true })).toBeVisible();
    await expect(row.getByRole("img", { name: "Below goal of 9,000", exact: true })).toBeVisible();

    await page.reload();

    await expect(goal.getByText("9,000 steps", { exact: true })).toBeVisible();
    await expect(row.getByRole("img", { name: "Below goal of 9,000", exact: true })).toBeVisible();
  });

  test("overwrites the daily steps of an already logged day", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("spinbutton", { name: "Steps" }).fill("10000");
    await page.getByRole("button", { name: "Log", exact: true }).click();

    await expect(page.getByRole("button", { name: "10,000 steps", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "8,000 steps", exact: true })).toBeHidden();

    await page.reload();

    await expect(page.getByRole("button", { name: "10,000 steps", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "8,000 steps", exact: true })).toBeHidden();
  });

  test("rejects an invalid daily steps import", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Import steps" }).click();
    await page.getByLabel("Select CSV").setInputFiles({
      name: "daily-steps.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("day,count\n2025-01-01,not-a-number\n"),
    });
    await page.getByRole("button", { name: "Import", exact: true }).click();

    await expect(page.getByText("Could not import the steps")).toBeVisible();
  });

  test("imports daily steps", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Import steps" }).click();
    await page.getByLabel("Select CSV").setInputFiles({
      name: "daily-steps.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("day,count\n2025-01-01,8500\n2025-01-02,9500\n"),
    });
    await page.getByRole("button", { name: "Import", exact: true }).click();

    await expect(page.getByRole("dialog", { name: "Import steps" })).toBeHidden();

    await page.getByRole("combobox", { name: "Month" }).selectOption({ index: 0 });

    await expect(page.getByRole("button", { name: "8,500 steps", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "9,500 steps", exact: true })).toBeVisible();

    await page.reload();
    await page.getByRole("combobox", { name: "Month" }).selectOption({ index: 0 });

    await expect(page.getByRole("button", { name: "8,500 steps", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "9,500 steps", exact: true })).toBeVisible();
  });
});

test.describe("Daily steps - athlete-mutation", () => {
  test.use({ storageState: ".auth/athlete-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("rejects daily steps out of range", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("spinbutton", { name: "Steps" }).fill("100500");

    await expect(page.getByRole("spinbutton", { name: "Steps" }).and(page.locator(":invalid"))).toHaveCount(
      1,
    );

    await page.reload();

    await expect(page.getByRole("button", { name: "100,500 steps", exact: true })).toBeHidden();
  });

  test("rejects negative daily steps", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("spinbutton", { name: "Steps" }).fill("-500");

    await expect(page.getByRole("spinbutton", { name: "Steps" }).and(page.locator(":invalid"))).toHaveCount(
      1,
    );

    await page.reload();

    await expect(page.getByRole("button", { name: "-500 steps", exact: true })).toBeHidden();
  });

  test("rejects a daily steps date in the future", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("spinbutton", { name: "Steps" }).fill("12500");
    await page.getByRole("textbox", { name: "Date" }).fill("2099-01-01");

    await expect(page.getByRole("textbox", { name: "Date" }).and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("button", { name: "12,500 steps", exact: true })).toBeHidden();
  });

  test("logs daily steps", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("spinbutton", { name: "Steps" }).fill("12345");
    await page.getByRole("button", { name: "Log", exact: true }).click();

    await expect(page.getByRole("button", { name: "12,345 steps", exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "12,345 steps", exact: true })).toBeVisible();
  });

  test("rejects a daily steps correction out of range", async ({ page }) => {
    const field = page
      .getByRole("form", { name: "Correct steps" })
      .getByRole("spinbutton", { name: "Steps" });

    await page.goto("/measurements/daily-steps");

    await page.getByRole("button", { name: "12,345 steps", exact: true }).click();
    await field.fill("100500");

    await expect(field.and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("button", { name: "12,345 steps", exact: true })).toBeVisible();
  });

  test("corrects the daily steps", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page.getByRole("button", { name: "12,345 steps", exact: true }).click();
    await page
      .getByRole("form", { name: "Correct steps" })
      .getByRole("spinbutton", { name: "Steps" })
      .fill("13210");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "13,210 steps", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "12,345 steps", exact: true })).toBeHidden();
    await expect(page.getByRole("spinbutton", { name: "Steps" })).toHaveValue("13210");

    await page.reload();

    await expect(page.getByRole("button", { name: "13,210 steps", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "12,345 steps", exact: true })).toBeHidden();
  });

  test("removes the daily steps", async ({ page }) => {
    await page.goto("/measurements/daily-steps");

    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("button", { name: "13,210 steps", exact: true }) })
      .getByRole("button", { name: "Remove steps" })
      .click();

    await expect(page.getByRole("button", { name: "13,210 steps", exact: true })).toBeHidden();
  });

  test("rejects a daily goal out of range", async ({ page }) => {
    const goal = page.getByRole("group", { name: "Daily goal" });
    const field = goal.getByRole("spinbutton", { name: "Daily goal" });

    await page.goto("/measurements/daily-steps");

    await goal.getByRole("button", { name: "Edit goal" }).click();
    await field.fill("100500");

    await expect(field.and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(goal.getByText("10,000 steps", { exact: true })).toBeVisible();
  });

  test("changes the daily goal", async ({ page }) => {
    const goal = page.getByRole("group", { name: "Daily goal" });
    const row = page
      .getByRole("listitem")
      .filter({ has: page.getByRole("button", { name: "10,200 steps", exact: true }) });

    await page.goto("/measurements/daily-steps");

    await goal.getByRole("button", { name: "Edit goal" }).click();
    await goal.getByRole("spinbutton", { name: "Daily goal" }).fill("10750");
    await goal.getByRole("button", { name: "Save", exact: true }).click();

    await expect(goal.getByText("10,750 steps", { exact: true })).toBeVisible();
    await expect(row.getByRole("img", { name: "Below goal of 10,750", exact: true })).toBeVisible();

    await page.reload();

    await expect(goal.getByText("10,750 steps", { exact: true })).toBeVisible();
    await expect(row.getByRole("img", { name: "Below goal of 10,750", exact: true })).toBeVisible();
  });
});
