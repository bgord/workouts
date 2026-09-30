// cSpell:ignore networkidle
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Shortcuts - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("toggles the shortcuts help", async ({ page }) => {
    await page.goto("/workouts");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Shift+?");

    const help = page.locator("#shortcuts");

    await expect(help.getByText("Keyboard shortcuts", { exact: true })).toBeVisible();
    await expect(help.getByText("Global")).toBeVisible();
    await expect(help.getByText("Workouts", { exact: true })).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(help.getByText("Keyboard shortcuts", { exact: true })).toBeHidden();
  });

  test("opens the shortcuts help with the button", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Show keyboard shortcuts" }).click();

    await expect(page.locator("#shortcuts").getByText("Keyboard shortcuts", { exact: true })).toBeVisible();

    await page.locator("#shortcuts").getByRole("button", { name: "Close" }).click();

    await expect(page.locator("#shortcuts").getByText("Keyboard shortcuts", { exact: true })).toBeHidden();
  });

  test("navigates with the go-to shortcuts", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("g");
    await page.keyboard.press("w");

    await expect(page).toHaveURL(/\/workouts/);

    await page.keyboard.press("g");
    await page.keyboard.press("c");

    await expect(page).toHaveURL(/\/catalog/);

    await page.keyboard.press("g");
    await page.keyboard.press("p");

    await expect(page).toHaveURL(/\/plans/);

    await page.keyboard.press("g");
    await page.keyboard.press("m");

    await expect(page).toHaveURL(/\/measurements/);

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

  test("opens the schedule dialog from the workouts list", async ({ page }) => {
    await page.goto("/workouts");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("n");

    await expect(page.locator("#workout-create").getByRole("button", { name: "Schedule" })).toBeVisible();
  });

  test("focuses the catalog search", async ({ page }) => {
    await page.goto("/catalog");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("/");

    await expect(page.getByPlaceholder("Search by name")).toBeFocused();
  });
});
