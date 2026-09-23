import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/measurements/body-weight/measurement/${mocks.bodyWeightMeasurementId}`;

describe("DELETE /api/measurements/body-weight/measurement/:bodyWeightMeasurementId", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("validation - incorrect body weight measurement id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/measurements/body-weight/measurement/id",
      { method: "DELETE" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("BodyWeightMeasurementExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyWeightMeasurementQuery, "execute"))
      .mockResolvedValue(null);

    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

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

    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    await testcases.assertInvariantError(response, 403, "body.weight.measurement.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyWeightMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyWeightMeasurement);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyWeightMeasurementRemovedEvent]);
  });
});
