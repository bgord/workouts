// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Body parts - empty-mutation", () => {
  test.use({ storageState: ".auth/empty-mutation.json" });
  test.describe.configure({ mode: "serial" });

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

  test("rejects a duplicate body part name", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();
    await page.getByLabel("Body part name").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Could not add the body part")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Measure Neck" })).toHaveCount(1);
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
    await expect(page.getByRole("dialog")).toBeHidden();

    await expect(async () => {
      await page.reload();
      await expect(
        page.getByRole("listitem").filter({ hasText: "Neck" }).getByText("39.1 cm").first(),
      ).toBeVisible({ timeout: 1000 });
    }).toPass();
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

test.describe("Body parts - athlete-mutation", () => {
  test.use({ storageState: ".auth/athlete-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("rejects a body part measurement out of range", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page
      .getByRole("button", { name: `Measure ${fixtures.athleteMutation.bodyParts.calfRight.name}` })
      .click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("301");

    await expect(page.locator('input[type="number"]:invalid')).toHaveCount(1);

    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athleteMutation.bodyParts.calfRight.name })
        .getByText("Not measured yet")
        .first(),
    ).toBeVisible();
  });

  test("rejects a body part measurement date in the future", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page
      .getByRole("button", { name: `Measure ${fixtures.athleteMutation.bodyParts.calfRight.name}` })
      .click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("38.5");
    await page.getByRole("textbox", { name: "Date" }).fill("2099-01-01");

    await expect(page.getByRole("textbox", { name: "Date" }).and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athleteMutation.bodyParts.calfRight.name })
        .getByText("Not measured yet")
        .first(),
    ).toBeVisible();
  });

  test("measures the body part that was never measured", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page
      .getByRole("button", { name: `Measure ${fixtures.athleteMutation.bodyParts.calfRight.name}` })
      .click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("38.5");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athleteMutation.bodyParts.calfRight.name })
        .getByText("38.5 cm")
        .first(),
    ).toBeVisible();
  });

  test("rejects a body part correction out of range", async ({ page }) => {
    await page.goto("/measurements/body-parts");
    await page
      .getByRole("button", {
        name: `Details: ${fixtures.athleteMutation.bodyParts.calfRight.name}`,
        exact: true,
      })
      .click();

    await page.getByTitle("Correct the measurement").click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("0");

    await expect(page.locator('input[type="number"]:invalid')).toHaveCount(1);

    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athleteMutation.bodyParts.calfRight.name })
        .getByText("38.5 cm")
        .first(),
    ).toBeVisible();
  });

  test("corrects the body part measurement", async ({ page }) => {
    await page.goto("/measurements/body-parts");
    await page
      .getByRole("button", {
        name: `Details: ${fixtures.athleteMutation.bodyParts.calfRight.name}`,
        exact: true,
      })
      .click();

    await page.getByTitle("Correct the measurement").click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("39.5");
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athleteMutation.bodyParts.calfRight.name })
        .getByText("39.5 cm")
        .first(),
    ).toBeVisible();
  });

  test("removes the body part measurement", async ({ page }) => {
    await page.goto("/measurements/body-parts");
    await page
      .getByRole("button", {
        name: `Details: ${fixtures.athleteMutation.bodyParts.calfRight.name}`,
        exact: true,
      })
      .click();

    await page.getByTitle("Remove the measurement").click();
    await page.reload();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: fixtures.athleteMutation.bodyParts.calfRight.name })
        .getByText("Not measured yet")
        .first(),
    ).toBeVisible();
  });
});
