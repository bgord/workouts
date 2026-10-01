import { expect, test as setup } from "@playwright/test";
import * as fixtures from "../../scripts/seed/fixtures";

const personas = {
  admin: fixtures.admin,
  empty: fixtures.empty,
  "empty-mutation": fixtures.emptyMutation,
  builder: fixtures.builder,
  "builder-mutation": fixtures.builderMutation,
  drafter: fixtures.drafter,
  athlete: fixtures.athlete,
  "athlete-mutation": fixtures.athleteMutation,
  active: fixtures.active,
  "active-mutation": fixtures.activeMutation,
  archivist: fixtures.archivist,
  "archivist-mutation": fixtures.archivistMutation,
  polyglot: fixtures.polyglot,
  "polyglot-mutation": fixtures.polyglotMutation,
  disposable: fixtures.disposable,
  hoarder: fixtures.hoarder,
  pocket: fixtures.pocket,
};

for (const [name, persona] of Object.entries(personas)) {
  setup(`Sign in - ${name}`, async ({ context, baseURL }) => {
    const response = await context.request.post("/api/auth/sign-in/email", {
      data: { email: persona.email, password: fixtures.password },
    });

    await expect(response).toBeOK();

    if ("language" in persona) {
      await context.addCookies([{ name: "language", value: persona.language, url: baseURL }]);
    }

    await context.storageState({ path: `.auth/${name}.json` });
  });
}
