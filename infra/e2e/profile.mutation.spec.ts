// cSpell:ignore Tygodniowe podsumowanie Zapisz Wyloguj
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Profile - polyglot-mutation", () => {
  test.use({ storageState: ".auth/polyglot-mutation.json" });

  test("turns the weekly summary on", async ({ page }) => {
    await page.goto("/profile");

    const updated = page.waitForResponse("**/api/preferences/weekly-summary/update");
    await page.getByRole("combobox", { name: "Tygodniowe podsumowanie" }).selectOption("on");
    await page.getByRole("button", { name: "Zapisz" }).click();
    await updated;

    await page.reload();

    await expect(page.getByRole("combobox", { name: "Tygodniowe podsumowanie" })).toHaveValue("on");
  });

  test("signs out", async ({ page }) => {
    await page.goto("/profile");

    await page.getByRole("button", { name: "Wyloguj się" }).click();

    await expect(page).toHaveURL(/\/public\/login\.html/);

    await page.goto("/");

    await expect(page).toHaveURL(/\/public\/login\.html/);
  });
});

test.describe("Profile - disposable", () => {
  test.use({ storageState: ".auth/disposable.json" });
  test.describe.configure({ mode: "serial" });

  test("uploads an avatar", async ({ page }) => {
    await page.goto("/profile");

    await page.getByRole("button", { name: "Change avatar" }).click();
    await page
      .getByLabel("Select file")
      .setInputFiles(`scripts/seed/assets/${fixtures.exercises.facePull.image}`);
    await page.getByRole("region", { name: "Avatar" }).getByRole("button", { name: "Save" }).click();

    await expect(page.getByRole("button", { name: "Delete avatar" })).toBeVisible();
  });

  test("removes the avatar", async ({ page }) => {
    await page.goto("/profile");

    await page.getByRole("button", { name: "Delete avatar" }).click();

    await expect(page.getByRole("button", { name: "Delete avatar" })).toBeHidden();
  });

  test("deletes the account", async ({ page }) => {
    await page.goto("/profile");

    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Type 'delete' in the field below").fill("delete");
    await page
      .getByRole("dialog", { name: "Delete account" })
      .getByRole("button", { name: "Delete account" })
      .click();

    await expect(page).toHaveURL(/\/public\/login\.html/);
  });

  test("rejects signing in to the deleted account", async ({ page }) => {
    await page.goto("/public/login.html");

    await page.getByLabel("Email").fill(fixtures.disposable.email);
    await page.getByLabel("Password").fill(fixtures.password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Something went wrong")).toBeVisible();
  });
});
