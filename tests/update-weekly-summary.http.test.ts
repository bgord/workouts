import { describe, expect, spyOn, test } from "bun:test";
import * as Preferences from "+preferences";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/preferences/weekly-summary/update";

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
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: Preferences.VO.WeeklySummaryError.invalid });
  });

  test("validation - invalid value", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ weeklySummary: "maybe" }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: Preferences.VO.WeeklySummaryError.invalid });
  });

  test("WeeklySummaryHasChanged", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Preferences.GetWeeklySummaryQuery, "execute").mockResolvedValue(
        Preferences.VO.WeeklySummaryOptions.on,
      ),
    );

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ weeklySummary: Preferences.VO.WeeklySummaryOptions.on }) },
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
      spyOn(di.Adapters.Preferences.GetWeeklySummaryQuery, "execute").mockResolvedValue(
        Preferences.VO.WeeklySummaryOptions.on,
      ),
    );

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ weeklySummary: Preferences.VO.WeeklySummaryOptions.off }),
        headers: mocks.correlationIdHeaders,
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklySummarySetOffEvent]);
  });
});
