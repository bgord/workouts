// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Body parts - empty", () => {
  test.use({ storageState: ".auth/empty.json" });

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

test.describe("Body parts - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

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

  test("marks the body part that was never measured", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await expect(page.getByText("Not measured yet").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: `Measure ${fixtures.athlete.bodyParts.calfRight.name}` }),
    ).toBeVisible();
  });

  test("lists the history of a body part", async ({ page }) => {
    const history = page.getByRole("list", { name: `Details: ${fixtures.athlete.bodyParts.waist.name}` });

    await page.goto("/measurements/body-parts");

    await page
      .getByRole("button", { name: `Details: ${fixtures.athlete.bodyParts.waist.name}`, exact: true })
      .click();

    await expect(history.getByRole("listitem")).toHaveCount(12);
    await expect(history.getByRole("listitem").first()).toContainText("81.4 cm");
    await expect(history.getByRole("listitem").last()).toContainText("82.0 cm");
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
      .getByRole("button", { name: `Details: ${fixtures.athlete.bodyParts.waist.name}`, exact: true })
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
      .getByRole("form", { name: `Rename ${fixtures.athlete.bodyParts.waist.name}` })
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
