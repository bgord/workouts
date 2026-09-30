import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Measurements - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });
  test.describe.configure({ mode: "serial" });

  test("logs a body weight measurement", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page.getByRole("spinbutton", { name: "Weight (kg)" }).fill("81.5");
    await page.getByRole("button", { name: "Log", exact: true }).click();

    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeVisible();
  });

  test("removes the body weight measurement", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await page
      .getByRole("listitem")
      .filter({ has: page.getByRole("button", { name: "81.5 kg" }) })
      .getByRole("button", { name: "Remove the measurement" })
      .click();

    await expect(page.getByRole("button", { name: "81.5 kg" })).toBeHidden();
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
});
