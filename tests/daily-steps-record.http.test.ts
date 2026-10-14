import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/daily-steps/record";

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - day - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "day.iso.id.type");
  });

  test("validation - day - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ day: "01-01-2025" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "day.iso.id.bad.chars");
  });

  test("validation - count - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ day: mocks.dailyStepsDay }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "integer.non.negative.type");
  });

  test("validation - count - negative", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ day: mocks.dailyStepsDay, count: -1 }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "integer.non.negative.invalid");
  });

  test("validation - count - above the limit", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ day: mocks.dailyStepsDay, count: 100_001 }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "steps.count.range");
  });

  test("DailyStepsDayIsNotInFuture", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ day: mocks.futureDailyStepsDay, count: mocks.stepsCount }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "daily.steps.day.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("DailyStepsDayIsNotInFuture - time zone offset", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.timeZoneOffsetHeaders,
        body: JSON.stringify({ day: mocks.dailyStepsDay, count: mocks.stepsCount }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "daily.steps.day.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ day: mocks.dailyStepsDay, count: mocks.stepsCount }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericDailyStepsRecordedEvent]);
  });
});
