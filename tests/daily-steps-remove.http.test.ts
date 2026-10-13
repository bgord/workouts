import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/measurements/daily-steps/${mocks.stepsDay}`;

describe("DELETE /api/measurements/daily-steps/:day", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect day", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/measurements/daily-steps/01-01-2025",
      { method: "DELETE" },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "day.iso.id.bad.chars");
  });

  test("DailyStepsExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetDailyStepsQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    await testcases.assertErrorResponse(response, 404, "daily.steps.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetDailyStepsQuery, "execute"))
      .mockResolvedValue(mocks.dailySteps);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericDailyStepsRemovedEvent]);
  });
});
