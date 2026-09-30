import { test as setup } from "@playwright/test";
import * as fixtures from "../../scripts/seed/fixtures";

const personas = {
  admin: fixtures.admin,
  empty: fixtures.empty,
  builder: fixtures.builder,
  drafter: fixtures.drafter,
  athlete: fixtures.athlete,
  active: fixtures.active,
  archivist: fixtures.archivist,
  polyglot: fixtures.polyglot,
  disposable: fixtures.disposable,
  hoarder: fixtures.hoarder,
  pocket: fixtures.pocket,
};

for (const [name, persona] of Object.entries(personas)) {
  setup(`Sign in - ${name}`, async ({ page }) => {
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
