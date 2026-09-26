import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-part/import";

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

  test("validation - bodyPart - unknown", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute")).mockResolvedValue([]);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        [
          "bodyPart,value,measuredOn",
          `${mocks.bodyPartName},${mocks.bodyPartMeasurementValue},${mocks.bodyPartMeasuredOn}`,
        ].join("\n"),
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 404, "body.part.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - value - missing", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPart]);

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        ["bodyPart,value,measuredOn", `${mocks.bodyPartName},,${mocks.bodyPartMeasuredOn}`].join("\n"),
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "body.part.measurement.value.type");
  });

  test("validation - value - invalid", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPart]);

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        ["bodyPart,value,measuredOn", `${mocks.bodyPartName},-1,${mocks.bodyPartMeasuredOn}`].join("\n"),
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "body.part.measurement.value.invalid");
  });

  test("validation - measuredOn - invalid", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPart]);

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        [
          "bodyPart,value,measuredOn",
          `${mocks.bodyPartName},${mocks.bodyPartMeasurementValue},01-01-2025`,
        ].join("\n"),
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, tools.DayIsoIdError.BadChars);
  });

  test("BodyPartMeasuredOnIsNotInFuture", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPart]);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        [
          "bodyPart,value,measuredOn",
          `${mocks.bodyPartName},${mocks.bodyPartMeasurementValue},${mocks.bodyPartMeasuredOn}`,
          `${mocks.bodyPartName},${mocks.anotherBodyPartMeasurementValue},${mocks.futureBodyPartMeasuredOn}`,
        ].join("\n"),
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 403, "body.part.measured.on.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPart]);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.bodyPartMeasurementId)
      .mockReturnValueOnce(mocks.anotherBodyPartMeasurementId);

    const content = [
      "bodyPart,value,measuredOn",
      `${mocks.bodyPartName},${mocks.bodyPartMeasurementValue},${mocks.bodyPartMeasuredOn}`,
      `${mocks.bodyPartName},${mocks.anotherBodyPartMeasurementValue},${mocks.anotherBodyPartMeasuredOn}`,
    ].join("\n");
    const form = new FormData();
    form.append("file", mocks.bodyPartMeasurementCsvFile(content));

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdHeaders, body: form },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [mocks.GenericBodyPartMeasuredEvent]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericBodyPartMeasuredEventAnother]);
  });
});
