import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-part/measure";

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - bodyPartId - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - value - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ bodyPartId: mocks.bodyPartId }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.measurement.value.type");
  });

  test("validation - value - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ bodyPartId: mocks.bodyPartId, value: -1 }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.measurement.value.invalid");
  });

  test("validation - measuredOn - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ bodyPartId: mocks.bodyPartId, value: mocks.bodyPartMeasurementValue }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, tools.DayIsoIdError.Type);
  });

  test("validation - measuredOn - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.bodyPartMeasurementValue,
          measuredOn: "01-01-2025",
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, tools.DayIsoIdError.BadChars);
  });

  test("BodyPartExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.bodyPartMeasurementValue,
          measuredOn: mocks.bodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 404, "body.part.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartBelongsToUser", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.bodyPartMeasurementValue,
          measuredOn: mocks.bodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartMeasuredOnIsNotInFuture", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.bodyPartMeasurementValue,
          measuredOn: mocks.futureBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.measured.on.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.bodyPartMeasurementId);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.bodyPartMeasurementValue,
          measuredOn: mocks.bodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ id: mocks.bodyPartMeasurementId });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartMeasuredEvent]);
  });
});
