import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
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

  test("validation - value - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "PATCH", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "body.part.measurement.value.type");
  });

  test("validation - value - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ value: -1 }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.measurement.value.invalid");
  });

  test("validation - measuredOn - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ value: mocks.bodyPartMeasurementValue }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, tools.DayIsoIdError.Type);
  });

  test("validation - measuredOn - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({ value: mocks.bodyPartMeasurementValue, measuredOn: "01-01-2025" }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, tools.DayIsoIdError.BadChars);
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
          value: mocks.anotherBodyPartMeasurementValue,
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
          value: mocks.anotherBodyPartMeasurementValue,
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
          value: mocks.bodyPartMeasurementValue,
          measuredOn: mocks.bodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.measurement.has.changed");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartMeasuredOnIsNotInFuture", async () => {
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
          value: mocks.bodyPartMeasurementValue,
          measuredOn: mocks.futureBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.measured.on.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path - value", async () => {
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
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          value: mocks.anotherBodyPartMeasurementValue,
          measuredOn: mocks.bodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([
      {
        ...mocks.GenericBodyPartMeasurementCorrectedEvent,
        payload: {
          ...mocks.GenericBodyPartMeasurementCorrectedEvent.payload,
          measuredOn: mocks.bodyPartMeasuredOn,
        },
      },
    ]);
  });

  test("happy path - measuredOn", async () => {
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
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          value: mocks.bodyPartMeasurementValue,
          measuredOn: mocks.anotherBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([
      {
        ...mocks.GenericBodyPartMeasurementCorrectedEvent,
        payload: {
          ...mocks.GenericBodyPartMeasurementCorrectedEvent.payload,
          value: mocks.bodyPartMeasurementValue,
        },
      },
    ]);
  });

  test("happy path - value and measuredOn", async () => {
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
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          value: mocks.anotherBodyPartMeasurementValue,
          measuredOn: mocks.anotherBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartMeasurementCorrectedEvent]);
  });
});
