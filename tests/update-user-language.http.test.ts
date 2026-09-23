import { describe, expect, spyOn, test } from "bun:test";
import { languages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/preferences/user-language/update";

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - empty payload", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "language.type");
  });

  test("validation - unsupported", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ language: "es" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "unsupported.language");
  });

  test("UserLanguageHasChanged", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Preferences.UserLanguageQuery, "get").mockResolvedValue(languages.supported.en),
    );

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ language: languages.supported.en }) },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Preferences.UserLanguageQuery, "get").mockResolvedValue(languages.supported.en),
    );

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ language: languages.supported.pl }),
        headers: mocks.correlationIdHeaders,
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericUserLanguageSetEventPL]);
  });
});
