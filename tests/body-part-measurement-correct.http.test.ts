import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/measurements/body-part/measurement/${mocks.bodyPartMeasurementId}`;

describe("PATCH /api/measurements/body-part/measurement/:bodyPartMeasurementId", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect body part measurement id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/measurements/body-part/measurement/id",
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - bodyPartId - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "PATCH", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - bodyPartId - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ bodyPartId: "id" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - value - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ bodyPartId: mocks.bodyPartId }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "height.millimeters.type");
  });

  test("validation - value - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ bodyPartId: mocks.bodyPartId, value: -1 }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "height.millimeters.invalid");
  });

  test("validation - value - zero", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ bodyPartId: mocks.bodyPartId, value: 0 }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.circumference.invalid");
  });

  test("validation - measuredOn - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({ bodyPartId: mocks.bodyPartId, value: mocks.bodyPartCircumference }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "day.iso.id.type");
  });

  test("validation - measuredOn - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.bodyPartCircumference,
          measuredOn: "01-01-2025",
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "day.iso.id.bad.chars");
  });

  test("BodyPartMeasurementExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.anotherBodyPartCircumference,
          measuredOn: mocks.anotherBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 404, "body.part.measurement.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartMeasurementBelongsToUser", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyPartMeasurement);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.anotherBodyPartCircumference,
          measuredOn: mocks.anotherBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.measurement.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartMeasurementHasChanged", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyPartMeasurement);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.bodyPartCircumference,
          measuredOn: mocks.bodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.measurement.has.changed");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyPartMeasurement);
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.anotherBodyPartCircumference,
          measuredOn: mocks.anotherBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 404, "body.part.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartBelongsToUser", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyPartMeasurement);
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute"))
      .mockResolvedValue(mocks.anotherUserBodyPart);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.anotherBodyPartCircumference,
          measuredOn: mocks.anotherBodyPartMeasuredOn,
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
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyPartMeasurement);
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.anotherBodyPartCircumference,
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
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyPartMeasurement);
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          value: mocks.anotherBodyPartCircumference,
          measuredOn: mocks.anotherBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartMeasurementCorrectedEvent]);
  });
});
