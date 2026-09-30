// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Measurements - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });
  test.describe.configure({ mode: "serial" });

  test("logs a body weight measurement", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("81.5");
    await page.getByRole("button", { name: "Log", exact: true }).click();
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

  test("defines a body part", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "Manage" }).click();
    await page.getByLabel("Body part name").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Define a body part first")).toBeHidden();
    await expect(page.getByRole("button", { name: "Measure Neck" })).toBeVisible();
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
