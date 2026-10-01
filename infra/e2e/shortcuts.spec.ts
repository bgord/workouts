// cSpell:ignore networkidle spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Shortcuts - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("toggles the shortcuts help", async ({ page }) => {
    await page.goto("/workouts");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Shift+?");

    const help = page.getByRole("dialog", { name: "Keyboard shortcuts" });

    await expect(help).toBeVisible();
    await expect(help.getByText("Global")).toBeVisible();
    await expect(help.getByRole("heading", { name: "Workouts", exact: true })).toBeVisible();
    await expect(help.getByText("g w", { exact: true })).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(help).toBeHidden();
  });

  test("opens the shortcuts help with the button", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Show keyboard shortcuts" }).click();

    await expect(page.getByRole("dialog", { name: "Keyboard shortcuts" })).toBeVisible();

    await page
      .getByRole("dialog", { name: "Keyboard shortcuts" })
      .getByRole("button", { name: "Close" })
      .click();

    await expect(page.getByRole("dialog", { name: "Keyboard shortcuts" })).toBeHidden();
  });

  test("goes to workouts", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("g");
    await page.keyboard.press("w");

    await expect(page).toHaveURL(/\/workouts/);
  });

  test("goes to catalog", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("g");
    await page.keyboard.press("c");

    await expect(page).toHaveURL(/\/catalog/);
  });

  test("goes to plans", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("g");
    await page.keyboard.press("p");

    await expect(page).toHaveURL(/\/plans/);
  });

  test("goes to measurements", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("g");
    await page.keyboard.press("m");

    await expect(page).toHaveURL(/\/measurements/);
  });

  test("goes to dashboard", async ({ page }) => {
    await page.goto("/workouts");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("g");
    await page.keyboard.press("d");

    await expect(page).toHaveURL("/");
  });

  test("opens the upcoming workout from the dashboard", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("o");

    await expect(page).toHaveURL(new RegExp(`/workouts/${fixtures.athlete.scheduledWorkout.id}`));
  });

  test("opens the newest workout from the workouts list", async ({ page }) => {
    await page.goto("/workouts?filter=all_time");
    await page.waitForLoadState("networkidle");
    const href = (await page.locator('a[href^="/workouts/"]').first().getAttribute("href")) ?? "";

    await page.keyboard.press("o");

    await expect(page).toHaveURL((url) => url.pathname + url.search === href);
  });

  test("opens the first exercise from the catalog", async ({ page }) => {
    await page.goto("/catalog");
    await page.waitForLoadState("networkidle");
    const href = (await page.locator('a[href^="/catalog/exercise/"]').first().getAttribute("href")) ?? "";

    await page.keyboard.press("o");

    await expect(page).toHaveURL((url) => url.pathname + url.search === href);
  });

  test("focuses the body weight input", async ({ page }) => {
    await page.goto("/measurements/body-weight");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("n");

    await expect(page.getByRole("spinbutton", { name: "Weight (kg)" })).toBeFocused();
  });

  test("opens the schedule dialog from the workouts list", async ({ page }) => {
    await page.goto("/workouts");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("n");

    await expect(
      page.getByRole("dialog", { name: "New workout" }).getByRole("button", { name: "Schedule" }),
    ).toBeVisible();
  });

  test("focuses the catalog search", async ({ page }) => {
    await page.goto("/catalog");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("/");

    await expect(page.getByPlaceholder("Search by name")).toBeFocused();
  });
});
