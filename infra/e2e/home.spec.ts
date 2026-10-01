import { expect, test } from "./test";

test("Sign in - layout", async ({ page }) => {
  await page.goto("/public/login.html");

  const header = page.getByText("Workouts");
  await expect(header).toBeVisible();
});

test.describe("Signed out", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const url of ["/", "/plans", "/workouts", "/catalog", "/measurements", "/profile"]) {
    test(`redirects ${url} to sign in`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL("/public/login.html");
      await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    });
  }
});
