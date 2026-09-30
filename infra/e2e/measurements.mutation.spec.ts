// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Measurements - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });
  test.describe.configure({ mode: "serial" });

  test("rejects a body weight out of range", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("501");

    await expect(page.locator('input[type="number"]:invalid')).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("button", { name: "501 kg" })).toBeHidden();
  });

  test("rejects a body weight date in the future", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("81.5");
    await page.locator('input[type="date"]').fill("2099-01-01");

    await expect(page.locator('input[type="date"]:invalid')).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeHidden();
  });

  test("logs a body weight measurement", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("81.5");
    await page.getByRole("button", { name: "Log", exact: true }).click();
    await page.reload();

    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeVisible();
  });

  test("rejects a body weight correction out of range", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "81.5 kg" }).click();
    await page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Cancel" }) })
      .getByRole("spinbutton", { name: "Weight (kg)" })
      .fill("501");

    await expect(page.locator('form input[type="number"]:invalid')).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeVisible();
  });

  test("corrects the body weight measurement", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "81.5 kg" }).click();
    await page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Cancel" }) })
      .getByRole("spinbutton", { name: "Weight (kg)" })
      .fill("82");
    await page.getByRole("button", { name: "Save" }).click();
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
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Cancel" }) })
      .getByRole("button", { name: "Cut" })
      .click();
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.getByText(/^Cut since /)).toBeVisible();
  });

  test("rejects a body part measurement out of range", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.calfRight.name}` }).click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("301");

    await expect(page.locator('input[type="number"]:invalid')).toHaveCount(1);

    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athlete.bodyParts.calfRight.name })
        .getByText("Not measured yet")
        .first(),
    ).toBeVisible();
  });

  test("measures the body part that was never measured", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.calfRight.name}` }).click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("38.5");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athlete.bodyParts.calfRight.name })
        .getByText("38.5 cm")
        .first(),
    ).toBeVisible();
  });

  test("rejects a body part correction out of range", async ({ page }) => {
    await page.goto("/measurements/body-parts");
    await page
      .getByRole("listitem")
      .filter({ hasText: fixtures.athlete.bodyParts.calfRight.name })
      .getByRole("button")
      .first()
      .click();

    await page.getByTitle("Correct the measurement").click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("0");

    await expect(page.locator('input[type="number"]:invalid')).toHaveCount(1);

    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athlete.bodyParts.calfRight.name })
        .getByText("38.5 cm")
        .first(),
    ).toBeVisible();
  });

  test("corrects the body part measurement", async ({ page }) => {
    await page.goto("/measurements/body-parts");
    await page
      .getByRole("listitem")
      .filter({ hasText: fixtures.athlete.bodyParts.calfRight.name })
      .getByRole("button")
      .first()
      .click();

    await page.getByTitle("Correct the measurement").click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("39.5");
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athlete.bodyParts.calfRight.name })
        .getByText("39.5 cm")
        .first(),
    ).toBeVisible();
  });

  test("removes the body part measurement", async ({ page }) => {
    await page.goto("/measurements/body-parts");
    await page
      .getByRole("listitem")
      .filter({ hasText: fixtures.athlete.bodyParts.calfRight.name })
      .getByRole("button")
      .first()
      .click();

    await page.getByTitle("Remove the measurement").click();
    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athlete.bodyParts.calfRight.name })
        .getByText("Not measured yet")
        .first(),
    ).toBeVisible();
  });
});

test.describe("Measurements - empty", () => {
  test.use({ storageState: ".auth/empty.json" });
  test.describe.configure({ mode: "serial" });

  test("logs the first body weight measurement", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("70");
    await page.getByRole("button", { name: "Log", exact: true }).click();

    await expect(page.getByText("Latest weight")).toBeVisible();
    await expect(page.getByText("No measurements logged yet")).toBeHidden();
  });

  test("rejects an invalid body weight import", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("button", { name: "Import measurements" }).click();
    await page.locator('input[type="file"]').setInputFiles({
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
    await page.locator('input[type="file"]').setInputFiles({
      name: "body-weight.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("id,weight,measuredOn\n,80250,2025-01-01\n,80750,2025-01-02\n"),
    });
    await page.getByRole("button", { name: "Import", exact: true }).click();
    await page.reload();
    await page.getByRole("combobox", { name: "Month" }).selectOption({ index: 0 });

    await expect(page.getByRole("button", { name: "80.25 kg" })).toBeVisible();
    await expect(page.getByRole("button", { name: "80.75 kg" })).toBeVisible();
  });

  test("rejects a too long body part name", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();
    await page.getByLabel("Body part name").fill("a".repeat(65));
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByLabel("Body part name").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByText("Define a body part first")).toBeVisible();
  });

  test("blocks defining a body part with an empty name", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();

    await expect(page.getByRole("button", { name: "Add", exact: true })).toBeDisabled();
  });

  test("defines a body part", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();
    await page.getByLabel("Body part name").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Define a body part first")).toBeHidden();
    await expect(page.getByRole("button", { name: "Measure Neck" })).toBeVisible();
  });

  test("rejects a body part import with an unknown body part", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Import body part measurements" }).click();
    await page.locator('input[type="file"]').setInputFiles({
      name: "body-parts.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("id,bodyPartName,value,measuredOn\n,Unknown,385,2025-01-01\n"),
    });
    await page.getByRole("button", { name: "Import", exact: true }).click();

    await expect(page.getByText("Could not import the measurements")).toBeVisible();
  });

  test("imports body part measurements", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Import body part measurements" }).click();
    await page.locator('input[type="file"]').setInputFiles({
      name: "body-parts.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("id,bodyPartName,value,measuredOn\n,Neck,385,2025-01-01\n,Neck,391,2025-01-08\n"),
    });
    await page.getByRole("button", { name: "Import", exact: true }).click();
    await page.reload();

    await expect(
      page.getByRole("listitem").filter({ hasText: "Neck" }).getByText("39.1 cm").first(),
    ).toBeVisible();
  });

  test("rejects a too long new body part name", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();
    await page.getByRole("button", { name: "Neck", exact: true }).click();
    await page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Cancel" }) })
      .getByLabel("Body part name")
      .fill("a".repeat(65));
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(
      page
        .locator("form")
        .filter({ has: page.getByRole("button", { name: "Cancel" }) })
        .locator("input:invalid"),
    ).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("button", { name: "Measure Neck", exact: true })).toBeVisible();
  });

  test("renames the body part", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();
    await page.getByRole("button", { name: "Neck", exact: true }).click();
    await page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Cancel" }) })
      .getByLabel("Body part name")
      .fill("Neck girth");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page.reload();

    await expect(page.getByRole("button", { name: "Measure Neck girth" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Measure Neck", exact: true })).toBeHidden();
  });

  test("deletes the body part", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();
    await page.getByRole("button", { name: "Delete Neck girth" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await page.reload();

    await expect(page.getByText("Define a body part first")).toBeVisible();
    await expect(page.getByRole("button", { name: "Measure Neck girth" })).toBeHidden();
  });
});
