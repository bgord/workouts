import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Errors - athlete", () => {
  test.use({ storageState: ".auth/athlete.json" });

  test("shows the empty dashboard when the dashboard fails to load", async ({ page }) => {
    await page.goto("/plans");
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route("**/api/dashboard", (route) => route.fulfill({ status: 500 }));

    await page.getByRole("navigation").getByRole("link", { name: "Dashboard" }).click();

    await expect(page.getByText("Nothing scheduled")).toBeVisible();
  });

  test("shows the empty state when the workouts fail to load", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route("**/api/workouts/list**", (route) => route.fulfill({ status: 500 }));

    await page.getByRole("navigation").getByRole("link", { name: "Workouts" }).click();

    await expect(page.getByText("No workouts yet")).toBeVisible();
  });

  test("shows the workout not found when the workout fails to load", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route(`**/api/workouts/${fixtures.athlete.scheduledWorkout.id}`, (route) =>
      route.fulfill({ status: 500 }),
    );

    await page.locator(`a[href^="/workouts/${fixtures.athlete.scheduledWorkout.id}"]`).click();

    await expect(page.getByRole("heading", { level: 1, name: "Workout not found" })).toBeVisible();

    await page.getByRole("link", { name: "Go to workouts" }).click();

    await expect(page).toHaveURL("/workouts");
  });

  test("shows the empty state when the catalog fails to load", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route("**/api/exercises/list**", (route) => route.fulfill({ status: 500 }));

    await page.getByRole("navigation").getByRole("link", { name: "Catalog" }).click();

    await expect(page.getByText("No exercises match the filters")).toBeVisible();
  });

  test("shows the exercise not found when the exercise fails to load", async ({ page }) => {
    await page.goto("/catalog");
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route(`**/api/exercises/${fixtures.exercises.superHorizontalBenchPress.id}`, (route) =>
      route.fulfill({ status: 500 }),
    );

    await page.getByRole("link", { name: fixtures.exercises.superHorizontalBenchPress.name }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Exercise not found" })).toBeVisible();

    await page.getByRole("link", { name: "Go to catalog" }).click();

    await expect(page).toHaveURL("/catalog");
  });

  test("shows the empty state when the plans fail to load", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route("**/api/plans/list", (route) => route.fulfill({ status: 500 }));

    await page.getByRole("navigation").getByRole("link", { name: "Plans" }).click();

    await expect(page.getByText("No plans yet")).toBeVisible();
  });

  test("shows the plan not found when the plan fails to load", async ({ page }) => {
    await page.goto("/plans");
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route(`**/api/plans/${fixtures.athlete.plan.id}`, (route) => route.fulfill({ status: 500 }));

    await page.getByRole("link", { name: fixtures.athlete.plan.name }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Plan not found" })).toBeVisible();

    await page.getByRole("link", { name: "Go to plans" }).click();

    await expect(page).toHaveURL("/plans");
  });

  test("shows the empty state when the body weight fails to load", async ({ page }) => {
    await page.goto("/measurements");
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route("**/api/measurements/body-weight/**", (route) => route.fulfill({ status: 500 }));

    await page.getByRole("link", { name: "Body weight" }).click();

    await expect(page.getByText("No measurements yet")).toBeVisible();
  });

  test("shows no body parts when the body parts fail to load", async ({ page }) => {
    await page.goto("/measurements");
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route("**/api/measurements/body-part/list", (route) => route.fulfill({ status: 500 }));

    await page.getByRole("link", { name: "Body parts" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Body parts" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Measure / })).toHaveCount(0);
  });

  test("shows the error boundary when the plans request is aborted", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route("**/api/plans/list", (route) => route.abort());

    await page.getByRole("navigation").getByRole("link", { name: "Plans" }).click();

    await expect(page.getByText("Something went wrong!")).toBeVisible();
    await expect(page.getByRole("button", { name: "Show Error" })).toBeVisible();
  });

  test("shows the mutation error when the request is aborted", async ({ page }) => {
    await page.goto(`/plans/${fixtures.athlete.plan.id}`);
    await expect(page.locator("main[data-hydrated]")).toBeAttached();
    await page.route("**/api/plans/*/archive", (route) => route.abort());

    await page.getByRole("button", { name: "Archive" }).click();
    await page.getByRole("dialog", { name: "Archive plan" }).getByRole("button", { name: "Archive" }).click();

    await expect(page.getByText("Could not archive the plan")).toBeVisible();
  });
});
