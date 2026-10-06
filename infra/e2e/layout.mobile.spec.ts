// cSpell:ignore spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Mobile - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("goes to every section from the bottom navigation", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation");

    await nav.getByRole("link", { name: "Workouts" }).click();

    await expect(page).toHaveURL("/workouts");

    await nav.getByRole("link", { name: "Catalog" }).click();

    await expect(page).toHaveURL("/catalog");

    await nav.getByRole("link", { name: "Plans" }).click();

    await expect(page).toHaveURL("/plans");

    await nav.getByRole("link", { name: "Measurements" }).click();

    await expect(page).toHaveURL("/measurements");

    await nav.getByRole("link", { name: "Profile" }).click();

    await expect(page).toHaveURL("/profile");
  });

  test("keeps the pages within the viewport width", async ({ page }) => {
    const routes = [
      "/",
      "/workouts",
      `/workouts/${fixtures.athlete.scheduledWorkout.id}`,
      "/catalog",
      `/catalog/exercise/${fixtures.exercises.superHorizontalBenchPress.id}`,
      "/plans",
      `/plans/${fixtures.athlete.plan.id}`,
      "/measurements",
      "/measurements/body-weight",
      "/measurements/body-parts",
      "/profile",
    ];

    for (const route of routes) {
      await page.goto(route);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );

      expect(overflow, route).toBeLessThanOrEqual(0);
    }
  });

  test("keeps a completed workout within the viewport width", async ({ page }) => {
    await page.goto("/workouts?filter=all_time");
    const href =
      (await page
        .getByRole("list", { name: "Workouts" })
        .getByRole("link", { name: /Completed$/ })
        .first()
        .getAttribute("href")) ?? "";

    await page.goto(href);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("opens the schedule dialog on the workouts list", async ({ page }) => {
    const dialog = page.getByRole("dialog", { name: "New workout" });

    await page.goto("/workouts");

    await page.getByRole("button", { name: "New workout" }).click();

    await expect(dialog.getByRole("button", { name: "Schedule" })).toBeInViewport();
    await expect(dialog.getByRole("button", { name: "Close" })).toBeInViewport();
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeInViewport();

    await dialog.getByRole("button", { name: "Close" }).tap();

    await expect(dialog).toBeHidden();
  });

  test("fits the body weight form on the screen", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByRole("spinbutton", { name: "Weight (kg)" })).toBeInViewport();
    await expect(page.getByRole("button", { name: "Log", exact: true })).toBeInViewport();
  });

  test("fits the set target form on the screen", async ({ page }) => {
    const row = page.getByRole("listitem", { name: fixtures.exercises.pullUp.name, exact: true });

    await page.goto(`/workouts/${fixtures.athlete.scheduledWorkout.id}`);

    await row.getByRole("button", { name: "Set target", exact: true }).tap();

    await expect(row.getByRole("button", { name: "Save", exact: true })).toBeInViewport();
    await expect(row.getByRole("button", { name: "Cancel" })).toBeInViewport();

    await row.getByRole("button", { name: "Cancel" }).tap();

    await expect(row.getByRole("button", { name: "Save", exact: true })).toBeHidden();
  });
});

test.describe("Mobile - active", () => {
  test.use({ storageState: ".auth/active.json" });

  test("keeps the workout within the viewport width with the log panel closed and open", async ({ page }) => {
    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    const closed = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    expect(closed).toBeLessThanOrEqual(0);

    await page
      .getByRole("button", { name: `Open panel: ${fixtures.exercises.tricepsPushDownBar.name}` })
      .click();
    await expect(page.getByRole("dialog", { name: "Logging panel" })).toBeVisible();

    const open = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    expect(open).toBeLessThanOrEqual(0);
  });

  test("fits the add exercise dialog on the screen", async ({ page }) => {
    const dialog = page.getByRole("dialog", { name: "Add exercise" });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);

    await page.getByRole("button", { name: "Add exercise" }).tap();

    await expect(dialog.getByRole("button", { name: "Add exercise" })).toBeInViewport();
    await expect(dialog.getByRole("button", { name: "Close" })).toBeInViewport();
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeInViewport();

    await dialog.getByRole("button", { name: "Close" }).tap();

    await expect(dialog).toBeHidden();
  });

  test("fits the set correction form on the screen", async ({ page }) => {
    const row = page.getByRole("listitem", {
      name: fixtures.exercises.superHorizontalBenchPress.name,
      exact: true,
    });

    await page.goto(`/workouts/${fixtures.active.workout.id}`);
    await row.getByRole("button", { name: /^Details: / }).tap();

    await row.getByRole("button", { name: "Correct set 1" }).tap();

    const form = row.getByRole("form", { name: "Correct set 1" });

    await expect(form.getByRole("button", { name: "Log set", exact: true })).toBeInViewport();
    await expect(form.getByRole("button", { name: "Cancel" })).toBeInViewport();

    await form.getByRole("button", { name: "Cancel" }).tap();

    await expect(form).toBeHidden();
  });
});

test.describe("Mobile - builder", () => {
  test.use({ storageState: ".auth/builder.json" });

  test("keeps the plan with an expanded section within the viewport width", async ({ page }) => {
    await page.goto(`/plans/${fixtures.builder.plan.id}`);
    await page.getByRole("button", { name: "Details: Push", exact: true }).click();
    await expect(page.getByRole("button", { name: "Add exercise" })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    expect(overflow).toBeLessThanOrEqual(0);
  });
});
