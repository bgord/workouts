import { describe, expect, spyOn, test } from "bun:test";
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

  test("validation - measuredOn - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "day.iso.id.type");
  });

  test("validation - measuredOn - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ measuredOn: "01-01-2025" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "day.iso.id.bad.chars");
  });

  test("validation - measurements - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ measuredOn: mocks.bodyPartMeasuredOn }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.measurement.entries.type");
  });

  test("validation - measurements - empty", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ measuredOn: mocks.bodyPartMeasuredOn, measurements: [] }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.measurement.entries.invalid");
  });

  test("validation - measurements - invalid entry", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ measuredOn: mocks.bodyPartMeasuredOn, measurements: [1] }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.measurement.entries.type");
  });

  test("validation - measurements - duplicate", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          measuredOn: mocks.bodyPartMeasuredOn,
          measurements: [
            { bodyPartId: mocks.bodyPartId, value: mocks.bodyPartCircumference },
            { bodyPartId: mocks.bodyPartId, value: mocks.anotherBodyPartCircumference },
          ],
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.measurement.entries.duplicate");
  });

  test("validation - bodyPartId - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          measuredOn: mocks.bodyPartMeasuredOn,
          measurements: [{ bodyPartId: "id", value: mocks.bodyPartCircumference }],
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - value - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          measuredOn: mocks.bodyPartMeasuredOn,
          measurements: [{ bodyPartId: mocks.bodyPartId, value: -1 }],
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "height.millimeters.invalid");
  });

  test("BodyPartMeasuredOnIsNotInFuture", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          measuredOn: mocks.futureBodyPartMeasuredOn,
          measurements: mocks.bodyPartMeasurementEntries,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.measured.on.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
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
          measuredOn: mocks.bodyPartMeasuredOn,
          measurements: mocks.bodyPartMeasurementEntries,
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
          measuredOn: mocks.bodyPartMeasuredOn,
          measurements: mocks.bodyPartMeasurementEntries,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.belongs.to.user");
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
          measuredOn: mocks.bodyPartMeasuredOn,
          measurements: mocks.bodyPartMeasurementEntries,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartMeasuredEvent]);
  });

  test("happy path - multiple", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute"))
      .mockResolvedValueOnce(mocks.bodyPart)
      .mockResolvedValueOnce(mocks.anotherBodyPart);
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.bodyPartMeasurementId)
      .mockReturnValueOnce(mocks.anotherBodyPartMeasurementId);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          measuredOn: mocks.bodyPartMeasuredOn,
          measurements: mocks.multipleBodyPartMeasurementEntries,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [mocks.GenericBodyPartMeasuredEvent]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericAnotherBodyPartMeasuredEvent]);
  });
});
