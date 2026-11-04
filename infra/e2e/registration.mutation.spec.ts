import { expect, test } from "./test";

test.describe("Registration", () => {
  test("opens from the login page", async ({ page }) => {
    await page.goto("/public/login.html");

    await page.getByRole("link", { name: "Register", exact: true }).click();

    await expect(page).toHaveURL("/public/register.html");
    await expect(page.getByRole("heading", { level: 1, name: "Register", exact: true })).toBeVisible();
  });

  test("goes back to the login page", async ({ page }) => {
    await page.goto("/public/register.html");

    await page.getByRole("link", { name: "Login", exact: true }).click();

    await expect(page).toHaveURL("/public/login.html");
  });

  test("creates the account", async ({ page }) => {
    await page.goto("/public/register.html");

    const requested = page.waitForRequest("**/api/auth/sign-up/email");
    await page.getByLabel("Email", { exact: true }).fill("registration@example.com");
    await page.getByLabel("Password", { exact: true }).fill("initial-Password-1234");
    await page.getByRole("button", { name: "Register", exact: true }).click();

    await expect(page.getByText("Check your inbox", { exact: true })).toBeVisible();
    expect((await requested).postDataJSON()).toEqual({
      email: "registration@example.com",
      password: "initial-Password-1234",
      name: "registration@example.com",
    });
  });

  test("rejects a too short password", async ({ page }) => {
    await page.goto("/public/register.html");

    const rejected = page.waitForResponse("**/api/auth/sign-up/email");
    await page.getByLabel("Email", { exact: true }).fill("registration-short-password@example.com");
    await page.getByLabel("Password", { exact: true }).fill("short");
    await page.getByRole("button", { name: "Register", exact: true }).click();

    await expect(page.getByText("Something went wrong", { exact: true })).toBeVisible();
    expect((await rejected).status()).toEqual(400);
    await expect(page.getByText("Check your inbox", { exact: true })).toBeHidden();
  });

  test("shows the error when creating the account fails", async ({ page }) => {
    await page.route("**/api/auth/sign-up/email", (route) => route.fulfill({ status: 500 }));
    await page.goto("/public/register.html");

    await page.getByLabel("Email", { exact: true }).fill("registration-failure@example.com");
    await page.getByLabel("Password", { exact: true }).fill("initial-Password-1234");
    await page.getByRole("button", { name: "Register", exact: true }).click();

    await expect(page.getByText("Something went wrong", { exact: true })).toBeVisible();
    await expect(page.getByText("Check your inbox", { exact: true })).toBeHidden();
  });
});
