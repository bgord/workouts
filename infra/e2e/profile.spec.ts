// cSpell:ignore Ustawienia profilu Zmiana języka Tygodniowe podsumowanie delet
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Profile - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("shows the account email and the settings sections", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.getByRole("heading", { level: 1, name: "Profile" })).toBeVisible();
    await expect(page.getByText(fixtures.athlete.email, { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Avatar" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Change language" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Weekly summary" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Export workouts" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Delete account" })).toBeVisible();
  });

  test("keeps the weekly summary on by default", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.getByRole("combobox", { name: "Weekly summary" })).toHaveValue("on");
    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  test("changes the language", async ({ page }) => {
    await page.goto("/profile");

    await page.getByRole("combobox", { name: "Change language" }).selectOption("pl");

    await expect(
      page.getByRole("heading", { level: 1, name: "Ustawienia profilu", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Profile" })).toBeHidden();

    await page.reload();

    await expect(
      page.getByRole("heading", { level: 1, name: "Ustawienia profilu", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Profile" })).toBeHidden();
  });

  test("downloads the workouts export", async ({ page }) => {
    await page.goto("/profile");

    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: "Download CSV" }).click();

    expect((await download).suggestedFilename()).toMatch(/\.csv$/);
  });

  test("blocks deleting the account until delete is typed", async ({ page }) => {
    await page.goto("/profile");

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(
      page.getByRole("dialog", { name: "Delete account" }).getByRole("button", { name: "Delete account" }),
    ).toBeDisabled();

    await page.getByLabel("Type 'delete' in the field below").fill("delet");

    await expect(
      page.getByRole("dialog", { name: "Delete account" }).getByRole("button", { name: "Delete account" }),
    ).toBeDisabled();

    await page.getByLabel("Type 'delete' in the field below").fill("delete");

    await expect(
      page.getByRole("dialog", { name: "Delete account" }).getByRole("button", { name: "Delete account" }),
    ).toBeEnabled();
  });

  test("shows the error when uploading the avatar fails", async ({ page }) => {
    await page.route("**/api/preferences/profile-avatar/update", (route) => route.fulfill({ status: 500 }));
    await page.goto("/profile");

    await page.getByRole("button", { name: "Change avatar" }).click();
    await page
      .getByLabel("Select file")
      .setInputFiles(`scripts/seed/assets/${fixtures.exercises.facePull.image}`);
    await page.getByRole("region", { name: "Avatar" }).getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not upload the avatar, please try again")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Delete avatar" })).toBeHidden();
  });

  test("shows the error when saving the weekly summary fails", async ({ page }) => {
    await page.route("**/api/preferences/weekly-summary/update", (route) => route.fulfill({ status: 500 }));
    await page.goto("/profile");

    await page.getByRole("combobox", { name: "Weekly summary" }).selectOption("off");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Could not save the preference, please try again")).toBeVisible();

    await page.reload();

    await expect(page.getByRole("combobox", { name: "Weekly summary" })).toHaveValue("on");
  });

  test("shows the error when sending the password reset link fails", async ({ page }) => {
    await page.route("**/api/auth/request-password-reset", (route) => route.fulfill({ status: 500 }));
    await page.goto("/profile");

    await page.getByRole("button", { name: "Send reset link" }).click();

    await expect(page.getByText("Error while sending the link")).toBeVisible();
    await expect(page.getByText("Check your inbox")).toBeHidden();
  });

  test("shows the error when deleting the account fails", async ({ page }) => {
    await page.route("**/api/auth/delete-user", (route) => route.fulfill({ status: 500 }));
    await page.goto("/profile");

    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Type 'delete' in the field below").fill("delete");
    await page
      .getByRole("dialog", { name: "Delete account" })
      .getByRole("button", { name: "Delete account" })
      .click();

    await expect(page.getByText("Error while deleting account")).toBeVisible();
    await expect(page).toHaveURL(/\/profile$/);
  });
});

test.describe("Profile - polyglot", () => {
  test.use({ storageState: ".auth/polyglot.json" });

  test("shows the seeded language and weekly summary preferences", async ({ page }) => {
    await page.goto("/profile");

    await expect(
      page.getByRole("heading", { level: 1, name: "Ustawienia profilu", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Zmiana języka" })).toHaveValue("pl");
    await expect(page.getByRole("combobox", { name: "Tygodniowe podsumowanie" })).toHaveValue("off");
  });
});
