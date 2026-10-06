// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Body parts - empty-mutation", () => {
  test.use({ storageState: ".auth/empty-mutation.json" });
  test.describe.configure({ mode: "serial" });

  test("caps a body part name at the maximum length", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Manage" }).click();
    await page.getByLabel("Body part name").fill("a".repeat(65));

    await expect(page.getByLabel("Body part name")).toHaveValue("a".repeat(64));
  });

  test("blocks defining a body part with an empty name", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Manage" }).click();

    await expect(page.getByRole("button", { name: "Add", exact: true })).toBeDisabled();
  });

  test("defines a body part", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Manage" }).click();
    await page.getByLabel("Body part name").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Add a body part first")).toBeHidden();
    await expect(page.getByRole("button", { name: "Measure Neck" })).toBeVisible();
    await expect(page.getByLabel("Body part name")).toHaveValue("");
  });

  test("rejects a duplicate body part name", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Manage" }).click();
    await page.getByLabel("Body part name").fill("NECK");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Could not add the body part")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Measure Neck" })).toHaveCount(1);
  });

  test("rejects a body part import with an unknown body part", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Import body parts" }).click();
    await page.getByLabel("Select CSV").setInputFiles({
      name: "body-parts.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("id,bodyPartName,value,measuredOn\n,Unknown,385,2025-01-01\n"),
    });
    await page.getByRole("button", { name: "Import", exact: true }).click();

    await expect(page.getByText("Could not import the measurements")).toBeVisible();
  });

  test("imports body part measurements", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Import body parts" }).click();
    await page.getByLabel("Select CSV").setInputFiles({
      name: "body-parts.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("id,bodyPartName,value,measuredOn\n,Neck,385,2025-01-01\n,Neck,391,2025-01-08\n"),
    });
    await page.getByRole("button", { name: "Import", exact: true }).click();

    await expect(page.getByRole("dialog", { name: "Import body parts" })).toBeHidden();
    await expect(
      page.getByRole("listitem", { name: "Neck", exact: true }).getByText("39.1 cm"),
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("listitem", { name: "Neck", exact: true }).getByText("39.1 cm"),
    ).toBeVisible();
  });

  test("caps a new body part name at the maximum length", async ({ page }) => {
    const field = page.getByRole("form", { name: "Rename Neck" }).getByLabel("Body part name");

    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Manage" }).click();
    await page.getByRole("button", { name: "Rename Neck" }).click();
    await field.fill("a".repeat(65));

    await expect(field).toHaveValue("a".repeat(64));
  });

  test("renames the body part", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Manage" }).click();
    await page.getByRole("button", { name: "Rename Neck" }).click();
    await page.getByRole("form", { name: "Rename Neck" }).getByLabel("Body part name").fill("Neck girth");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Neck girth" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Measure Neck girth" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Measure Neck", exact: true })).toBeHidden();
  });

  test("renames the body part changing only the case", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Manage" }).click();
    await page.getByRole("button", { name: "Rename Neck girth", exact: true }).click();
    await page
      .getByRole("form", { name: "Rename Neck girth", exact: true })
      .getByLabel("Body part name")
      .fill("Neck Girth");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Neck Girth", exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Measure Neck Girth", exact: true })).toBeVisible();
  });

  test("deletes the body part", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Manage" }).click();
    await page.getByRole("button", { name: "Delete Neck girth" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Neck girth" })).toBeHidden();

    await page.reload();

    await expect(page.getByText("Add a body part first")).toBeVisible();
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

    await expect(
      page.getByRole("spinbutton", { name: "Circumference" }).and(page.locator(":invalid")),
    ).toHaveCount(1);

    await page.reload();

    await expect(
      page
        .getByRole("listitem", { name: fixtures.athleteMutation.bodyParts.calfRight.name, exact: true })
        .getByText("Not measured yet"),
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
        .getByRole("listitem", { name: fixtures.athleteMutation.bodyParts.calfRight.name, exact: true })
        .getByText("Not measured yet"),
    ).toBeVisible();
  });

  test("measures the body part that was never measured", async ({ page }) => {
    await page.goto("/measurements/body-parts");

    await page
      .getByRole("button", { name: `Measure ${fixtures.athleteMutation.bodyParts.calfRight.name}` })
      .click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("38.5");
    await page.getByRole("button", { name: "Log", exact: true }).click();

    await expect(
      page
        .getByRole("listitem", { name: fixtures.athleteMutation.bodyParts.calfRight.name, exact: true })
        .getByText("38.5 cm"),
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

    await page.getByRole("button", { name: /^Correct measurement/ }).click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("0");

    await expect(
      page.getByRole("spinbutton", { name: "Circumference" }).and(page.locator(":invalid")),
    ).toHaveCount(1);

    await page.reload();

    await expect(
      page
        .getByRole("listitem", { name: fixtures.athleteMutation.bodyParts.calfRight.name, exact: true })
        .getByText("38.5 cm"),
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

    await page.getByRole("button", { name: /^Correct measurement/ }).click();
    await page.getByRole("spinbutton", { name: "Circumference" }).fill("39.5");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(
      page
        .getByRole("listitem", { name: fixtures.athleteMutation.bodyParts.calfRight.name, exact: true })
        .getByText("39.5 cm")
        .first(),
    ).toBeVisible();

    await page.reload();

    await expect(
      page
        .getByRole("listitem", { name: fixtures.athleteMutation.bodyParts.calfRight.name, exact: true })
        .getByText("39.5 cm"),
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

    await page.getByRole("button", { name: "Remove measurement" }).click();

    await expect(
      page
        .getByRole("listitem", { name: fixtures.athleteMutation.bodyParts.calfRight.name, exact: true })
        .getByText("Not measured yet"),
    ).toBeVisible();

    await page.reload();

    await expect(
      page
        .getByRole("listitem", { name: fixtures.athleteMutation.bodyParts.calfRight.name, exact: true })
        .getByText("Not measured yet"),
    ).toBeVisible();
  });
});
