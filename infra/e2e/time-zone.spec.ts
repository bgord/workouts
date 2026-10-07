// cSpell:ignore Kiritimati Pago
import { expect, test } from "./test";

const timeZone =
  new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Kiritimati" }).format() ===
  new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format()
    ? "Pacific/Pago_Pago"
    : "Pacific/Kiritimati";

test.describe("Time zone - athlete", () => {
  test.use({ storageState: ".auth/athlete.json", timezoneId: timeZone });

  test("stores the browser time zone", async ({ page, context }) => {
    await page.goto("/");

    expect((await context.cookies()).find((cookie) => cookie.name === "time-zone")?.value).toEqual(
      encodeURIComponent(timeZone),
    );
  });

  test("defaults the measurement date to the browser today", async ({ page }) => {
    await page.goto("/measurements/body-weight");

    await expect(page.getByLabel("Date")).toHaveValue(
      await page.evaluate(() => Temporal.Now.plainDateISO().toString()),
    );
  });
});
