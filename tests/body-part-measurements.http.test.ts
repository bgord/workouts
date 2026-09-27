import { describe, expect, spyOn, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const bodyPartsUrl = "/api/measurements/body-parts";
const bodyPartUrl = `${bodyPartsUrl}/${mocks.bodyPartId}`;
const bodyPartMeasurementsUrl = `${bodyPartUrl}/measurements`;
const bodyPartMeasurementUrl = `/api/measurements/body-part-measurements/${mocks.bodyPartMeasurementId}`;

describe(`POST ${bodyPartsUrl}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(bodyPartsUrl, { method: "POST" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - name - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      bodyPartsUrl,
      { method: "POST", body: JSON.stringify({}) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.name.type");
  });

  test("duplicate active name", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartNameCountQuery, "execute")).mockResolvedValue(1);

    const response = await server.request(
      bodyPartsUrl,
      { method: "POST", body: JSON.stringify({ name: mocks.bodyPartName }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.name.is.unique");
  });

  test("happy path", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValueOnce(mocks.bodyPartId);
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartNameCountQuery, "execute")).mockResolvedValue(0);

    const response = await server.request(
      bodyPartsUrl,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ name: mocks.bodyPartName }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ id: mocks.bodyPartId });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartAddedEvent]);
  });
});

describe(`PATCH ${bodyPartUrl}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("owner check", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute"))
      .mockResolvedValue(mocks.otherUsersBodyPart);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      bodyPartUrl,
      { method: "PATCH", body: JSON.stringify({ name: mocks.anotherBodyPartName }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartNameCountQuery, "execute")).mockResolvedValue(0);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      bodyPartUrl,
      {
        method: "PATCH",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ name: mocks.anotherBodyPartName }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartRenamedEvent]);
  });
});

describe(`POST ${bodyPartUrl}/archive`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      `${bodyPartUrl}/archive`,
      { method: "POST", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartArchivedEvent]);
  });
});

describe(`POST ${bodyPartMeasurementsUrl}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - future measuredOn", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      bodyPartMeasurementsUrl,
      {
        method: "POST",
        body: JSON.stringify({
          valueMm: mocks.bodyPartMeasurementValue,
          measuredOn: mocks.futureBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.measured.on.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("duplicate part and date", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementDateCountQuery, "execute"))
      .mockResolvedValue(1);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      bodyPartMeasurementsUrl,
      {
        method: "POST",
        body: JSON.stringify({
          valueMm: mocks.bodyPartMeasurementValue,
          measuredOn: mocks.bodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.measurement.date.is.unique");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.bodyPartMeasurementId);
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementDateCountQuery, "execute"))
      .mockResolvedValue(0);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      bodyPartMeasurementsUrl,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          valueMm: mocks.bodyPartMeasurementValue,
          measuredOn: mocks.bodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ id: mocks.bodyPartMeasurementId });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartMeasurementRecordedEvent]);
  });
});

describe(`PATCH ${bodyPartMeasurementUrl}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("owner check", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.otherUsersBodyPartMeasurement);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      bodyPartMeasurementUrl,
      {
        method: "PATCH",
        body: JSON.stringify({
          valueMm: mocks.correctedBodyPartMeasurementValue,
          measuredOn: mocks.anotherBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.measurement.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyPartMeasurement);
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementDateCountQuery, "execute"))
      .mockResolvedValue(0);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      bodyPartMeasurementUrl,
      {
        method: "PATCH",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          valueMm: mocks.correctedBodyPartMeasurementValue,
          measuredOn: mocks.anotherBodyPartMeasuredOn,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartMeasurementCorrectedEvent]);
  });
});

describe(`DELETE ${bodyPartMeasurementUrl}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyPartMeasurement);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      bodyPartMeasurementUrl,
      { method: "DELETE", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartMeasurementRemovedEvent]);
  });
});

describe(`GET ${bodyPartMeasurementsUrl}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("lists readings scoped to the authenticated user and part", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    const listMeasurements = spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPartMeasurement]);

    const response = await server.request(bodyPartMeasurementsUrl, {}, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ measurements: [mocks.bodyPartMeasurement] });
    expect(listMeasurements).toHaveBeenCalledWith(mocks.userId, mocks.bodyPartId);
  });
});

describe(`GET ${bodyPartsUrl}/list`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("returns the authenticated user's parts", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPart]);

    const response = await server.request(`${bodyPartsUrl}/list`, {}, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ bodyParts: [mocks.bodyPart] });
  });
});

test("body-part measurement value validates integer millimetres", () => {
  expect(v.safeParse(Measurements.VO.BodyPartMeasurementValue, 900).success).toEqual(true);
  expect(v.safeParse(Measurements.VO.BodyPartMeasurementValue, 0).success).toEqual(false);
  expect(v.safeParse(Measurements.VO.BodyPartMeasurementValue, 90.5).success).toEqual(false);
});
