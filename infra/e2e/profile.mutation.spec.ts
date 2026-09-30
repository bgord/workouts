import { expect, test } from "@playwright/test";
import * as fixtures from "../../scripts/seed/fixtures";

test.describe("Profile - polyglot", () => {
  test.use({ storageState: ".auth/polyglot.json" });

  test("turns the weekly summary on", async ({ page }) => {
    await page.goto("/profile");

    await page.getByRole("combobox").filter({ hasText: "Wyłączone" }).selectOption("on");
    await page.getByRole("button", { name: "Zapisz" }).click();

    await page.reload();

    await expect(page.getByRole("combobox").filter({ hasText: "Włączone" })).toHaveValue("on");
  });
});

test.describe("Profile - disposable", () => {
  test.use({ storageState: ".auth/disposable.json" });
  test.describe.configure({ mode: "serial" });

  test("uploads an avatar", async ({ page }) => {
    await page.goto("/profile");

    await page.getByRole("button", { name: "Change avatar" }).click();
    await page
      .locator('input[type="file"]')
      .setInputFiles(`scripts/seed/assets/${fixtures.exercises.facePull.image}`);
    await page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Avatar" }) })
      .getByRole("button", { name: "Save" })
      .click();

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
    await page.getByPlaceholder("delete").fill("delete");
    await page.getByRole("button", { name: "Delete account" }).last().click();

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
