import { test as setup } from "@playwright/test";
import * as fixtures from "../../scripts/seed/fixtures";

const personas = {
  admin: fixtures.admin,
  empty: fixtures.empty,
  builder: fixtures.builder,
  athlete: fixtures.athlete,
  active: fixtures.active,
  archivist: fixtures.archivist,
  polyglot: fixtures.polyglot,
};

const SIGN_IN_LIMIT = 3;
const SIGN_IN_WINDOW_MS = 10_000;

for (const [index, [name, persona]] of Object.entries(personas).entries()) {
  setup(`Sign in - ${name}`, async ({ page }) => {
    if (index > 0 && index % SIGN_IN_LIMIT === 0) await page.waitForTimeout(SIGN_IN_WINDOW_MS);

    await page.goto("/public/login.html");

    await page.getByLabel("Email").fill(persona.email);
    await page.getByLabel("Password").fill(fixtures.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL((url) => url.pathname === "/");

    if ("language" in persona) {
      await page.context().addCookies([{ name: "language", value: persona.language, url: page.url() }]);
    }

    await page.context().storageState({ path: `.auth/${name}.json` });
  });
}
