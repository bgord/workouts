// cSpell:ignore spinbutton
import { expect, test } from "./test";

test.describe("Body weight - empty-mutation", () => {
  test.use({ storageState: ".auth/empty-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("logs the first body weight measurement", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("70");
    await page.getByRole("button", { name: "Log", exact: true }).click();

    await expect(page.getByRole("listitem", { name: "Latest weight" })).toBeVisible();
    await expect(page.getByText("No measurements logged yet")).toBeHidden();
  });

  test("rejects an invalid body weight import", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "Import measurements" }).click();
    await page.getByLabel("Select CSV").setInputFiles({
      name: "body-weight.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("id,weight,measuredOn\n,not-a-number,2025-01-01\n"),
    });
    await page.getByRole("button", { name: "Import", exact: true }).click();

    await expect(page.getByText("Could not import the measurements")).toBeVisible();
  });

  test("imports body weight measurements", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "Import measurements" }).click();
    await page.getByLabel("Select CSV").setInputFiles({
      name: "body-weight.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("id,weight,measuredOn\n,80250,2025-01-01\n,80750,2025-01-02\n"),
    });
    await page.getByRole("button", { name: "Import", exact: true }).click();

    await expect(page.getByRole("dialog", { name: "Import measurements" })).toBeHidden();

    await page.getByRole("combobox", { name: "Month" }).selectOption({ index: 0 });

    await expect(page.getByRole("button", { name: "80.25 kg" })).toBeVisible();
    await expect(page.getByRole("button", { name: "80.75 kg" })).toBeVisible();

    await page.reload();
    await page.getByRole("combobox", { name: "Month" }).selectOption({ index: 0 });

    await expect(page.getByRole("button", { name: "80.25 kg" })).toBeVisible();
    await expect(page.getByRole("button", { name: "80.75 kg" })).toBeVisible();
  });
});

test.describe("Body weight - athlete-mutation", () => {
  test.use({ storageState: ".auth/athlete-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("rejects a body weight out of range", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("501");

    await expect(
      page.getByRole("spinbutton", { name: "Weight (kg)" }).and(page.locator(":invalid")),
    ).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("button", { name: "501 kg" })).toBeHidden();
  });

  test("rejects a body weight date in the future", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("81.5");
    await page.getByRole("textbox", { name: "Date" }).fill("2099-01-01");

    await expect(page.getByRole("textbox", { name: "Date" }).and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeHidden();
  });

  test("logs a body weight measurement", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("81.5");
    await page.getByRole("button", { name: "Log", exact: true }).click();

    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeVisible();
  });

  test("rejects a body weight correction out of range", async ({ page }) => {
    const field = page
      .getByRole("form", { name: "Correct the measurement" })
      .getByRole("spinbutton", { name: "Weight (kg)" });

    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "81.5 kg" }).click();
    await field.fill("501");

    await expect(field.and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeVisible();
  });

  test("corrects the body weight measurement", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "81.5 kg" }).click();
    await page
      .getByRole("form", { name: "Correct the measurement" })
      .getByRole("spinbutton", { name: "Weight (kg)" })
      .fill("82");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByRole("button", { name: "82 kg" })).toBeVisible();
    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeHidden();

    await page.reload();

    await expect(page.getByRole("button", { name: "82 kg" })).toBeVisible();
    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeHidden();
  });

  test("removes the body weight measurement", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("button", { name: "82 kg" }) })
      .getByRole("button", { name: "Remove the measurement" })
      .click();

    await expect(page.getByRole("button", { name: "82 kg" })).toBeHidden();
  });

  test("sets a new body weight reference and goal", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "Use as the reference point" }).first().click();
    await page
      .getByRole("form", { name: "Use as the reference point" })
      .getByRole("button", { name: "Cut" })
      .click();
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText(/^Cut since /)).toBeVisible();

    await page.reload();

    await expect(page.getByText(/^Cut since /)).toBeVisible();
  });
});
