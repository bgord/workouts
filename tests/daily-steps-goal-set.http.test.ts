import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/daily-steps/goal";

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - goal - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "integer.positive.type");
  });

  test("validation - goal - zero", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ goal: 0 }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "integer.positive.invalid");
  });

  test("validation - goal - above the limit", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ goal: 100_001 }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "daily.steps.goal.range");
  });

  test("DailyStepsGoalHasChanged", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetDailyStepsGoalQuery, "execute"))
      .mockResolvedValue(mocks.dailyStepsGoal);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ goal: mocks.dailyStepsGoal }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "daily.steps.goal.has.changed");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetDailyStepsGoalQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ goal: mocks.dailyStepsGoal }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericDailyStepsGoalSetEvent]);
  });

  test("happy path - goal changed", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetDailyStepsGoalQuery, "execute"))
      .mockResolvedValue(mocks.anotherDailyStepsGoal);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ goal: mocks.dailyStepsGoal }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericDailyStepsGoalSetEvent]);
  });
});
