import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/daily-steps/import";

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - file - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: new FormData() }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, bg.FileUploaderError.MissingFile);
  });

  test("validation - file - invalid mime", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const form = new FormData();
    form.append("file", mocks.png);

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, bg.FileUploaderError.InvalidMime);
  });

  test("validation - day - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append("file", mocks.dailyStepsCsvFile(`day,count\n,${mocks.stepsCount}`));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "day.iso.id.bad.chars");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - day - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append("file", mocks.dailyStepsCsvFile(`day,count\n01-01-2025,${mocks.stepsCount}`));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "day.iso.id.bad.chars");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - count - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append("file", mocks.dailyStepsCsvFile(`day,count\n${mocks.stepsDay},`));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "integer.non.negative.type");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - count - negative", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append("file", mocks.dailyStepsCsvFile(`day,count\n${mocks.stepsDay},-1`));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "integer.non.negative.invalid");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - count - above the limit", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append("file", mocks.dailyStepsCsvFile(`day,count\n${mocks.stepsDay},100001`));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "steps.count.range");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("DailyStepsDayIsNotInFuture", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const content = [
      ["day", "count"],
      [mocks.stepsDay, mocks.stepsCount],
      [mocks.futureStepsDay, mocks.stepsCount],
    ]
      .map((row) => row.join(","))
      .join("\n");
    const form = new FormData();
    form.append("file", mocks.dailyStepsCsvFile(content));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 403, "daily.steps.day.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const content = [
      ["day", "count"],
      [mocks.stepsDay, mocks.stepsCount],
      [mocks.anotherStepsDay, mocks.anotherStepsCount],
    ]
      .map((row) => row.join(","))
      .join("\n");
    const form = new FormData();
    form.append("file", mocks.dailyStepsCsvFile(content));

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdHeaders, body: form },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [mocks.GenericDailyStepsRecordedEvent]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericDailyStepsRecordedEventAnother]);
  });
});
