import { expect, test } from "./test";

test.describe("Password recovery - forgot password", () => {
  test("opens from the login page", async ({ page }) => {
    await page.goto("/public/login.html");

    await page.getByRole("link", { name: "Forgot password?", exact: true }).click();

    await expect(page).toHaveURL("/public/forgot-password.html");
    await expect(page.getByRole("heading", { level: 1, name: "Forgot password", exact: true })).toBeVisible();
  });

  test("sends the reset link", async ({ page, baseURL }) => {
    await page.goto("/public/forgot-password.html");

    const requested = page.waitForRequest("**/api/auth/request-password-reset");
    await page.getByLabel("Email", { exact: true }).fill("nobody@example.com");
    await page.getByRole("button", { name: "Send link", exact: true }).click();

    await expect(page.getByText("Check your inbox", { exact: true })).toBeVisible();
    expect((await requested).postDataJSON()).toEqual({
      email: "nobody@example.com",
      redirectTo: `${baseURL}/public/reset-password.html`,
    });
  });

  test("shows the error when sending the reset link fails", async ({ page }) => {
    await page.route("**/api/auth/request-password-reset", (route) => route.fulfill({ status: 500 }));
    await page.goto("/public/forgot-password.html");

    await page.getByLabel("Email", { exact: true }).fill("nobody@example.com");
    await page.getByRole("button", { name: "Send link", exact: true }).click();

    await expect(page.getByText("Could not send the password reset link", { exact: true })).toBeVisible();
    await expect(page.getByText("Check your inbox", { exact: true })).toBeHidden();
  });
});

test.describe("Password recovery - reset password", () => {
  test("changes the password", async ({ page }) => {
    await page.route("**/api/auth/reset-password", (route) => route.fulfill({ status: 200 }));
    await page.goto("/public/reset-password.html?token=abc");

    const requested = page.waitForRequest("**/api/auth/reset-password");
    await page.getByLabel("Password", { exact: true }).fill("changed-Password-5678");
    await page.getByRole("button", { name: "Reset password", exact: true }).click();

    await expect(page.getByText("Password changed", { exact: true })).toBeVisible();
    expect((await requested).postDataJSON()).toEqual({ newPassword: "changed-Password-5678", token: "abc" });
  });

  test("rejects an invalid token", async ({ page }) => {
    await page.goto("/public/reset-password.html?token=abc");

    const rejected = page.waitForResponse("**/api/auth/reset-password");
    await page.getByLabel("Password", { exact: true }).fill("changed-Password-5678");
    await page.getByRole("button", { name: "Reset password", exact: true }).click();

    await expect(page.getByText("Could not reset the password", { exact: true })).toBeVisible();
    expect((await rejected).status()).toEqual(400);
    await expect(page.getByText("Password changed", { exact: true })).toBeHidden();
  });
});
