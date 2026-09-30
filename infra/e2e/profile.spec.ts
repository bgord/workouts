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

    await expect(page.getByRole("combobox").filter({ hasText: "On" })).toHaveValue("on");
    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  test("changes the language", async ({ page }) => {
    await page.goto("/profile");

    await page.getByRole("combobox").filter({ hasText: "English" }).selectOption("pl");

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
});

test.describe("Profile - polyglot", () => {
  test.use({ storageState: ".auth/polyglot.json" });

  test("shows the seeded language and weekly summary preferences", async ({ page }) => {
    await page.goto("/profile");

    await expect(
      page.getByRole("heading", { level: 1, name: "Ustawienia profilu", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("combobox").filter({ hasText: "Polski" })).toHaveValue("pl");
    await expect(page.getByRole("combobox").filter({ hasText: "Wyłączone" })).toHaveValue("off");
  });
});
