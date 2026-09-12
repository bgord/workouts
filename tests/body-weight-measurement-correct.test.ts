import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/measurements/body-weight/measurement/${mocks.bodyWeightMeasurementId}`;

describe("PATCH /api/measurements/body-weight/measurement/:bodyWeightMeasurementId", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("validation - incorrect body weight measurement id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/measurements/body-weight/measurement/id",
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("validation - weight - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "PATCH", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: tools.WeightGramsError.Type });
  });

  test("validation - weight - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ weight: -1 }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: tools.WeightGramsError.Invalid });
  });

  test("validation - measuredOn - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ weight: mocks.bodyWeight }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: tools.DayIsoIdError.Type });
  });

  test("validation - measuredOn - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ weight: mocks.bodyWeight, measuredOn: "01-01-2025" }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: tools.DayIsoIdError.BadChars });
  });

  test("BodyWeightMeasurementExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyWeightMeasurementQuery, "execute"))
      .mockResolvedValue(null);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({
          weight: mocks.anotherBodyWeight,
          measuredOn: mocks.anotherBodyWeightMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 404, "body.weight.measurement.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyWeightMeasurementBelongsToUser", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyWeightMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyWeightMeasurement);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({
          weight: mocks.anotherBodyWeight,
          measuredOn: mocks.anotherBodyWeightMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "body.weight.measurement.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyWeightMeasurementHasChanged", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyWeightMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyWeightMeasurement);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({ weight: mocks.bodyWeight, measuredOn: mocks.bodyWeightMeasuredOn }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "body.weight.measurement.has.changed");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyWeightMeasuredOnIsNotInFuture", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyWeightMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyWeightMeasurement);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({ weight: mocks.bodyWeight, measuredOn: mocks.futureBodyWeightMeasuredOn }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "body.weight.measured.on.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path - weight", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyWeightMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyWeightMeasurement);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ weight: mocks.anotherBodyWeight, measuredOn: mocks.bodyWeightMeasuredOn }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([
      {
        ...mocks.GenericBodyWeightMeasurementCorrectedEvent,
        payload: {
          ...mocks.GenericBodyWeightMeasurementCorrectedEvent.payload,
          measuredOn: mocks.bodyWeightMeasuredOn,
        },
      },
    ]);
  });

  test("happy path - measuredOn", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyWeightMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyWeightMeasurement);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ weight: mocks.bodyWeight, measuredOn: mocks.anotherBodyWeightMeasuredOn }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([
      {
        ...mocks.GenericBodyWeightMeasurementCorrectedEvent,
        payload: { ...mocks.GenericBodyWeightMeasurementCorrectedEvent.payload, weight: mocks.bodyWeight },
      },
    ]);
  });

  test("happy path - weight and measuredOn", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyWeightMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyWeightMeasurement);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          weight: mocks.anotherBodyWeight,
          measuredOn: mocks.anotherBodyWeightMeasuredOn,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyWeightMeasurementCorrectedEvent]);
  });
});
