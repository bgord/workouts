import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/measurements/body-part/measurement/${mocks.bodyPartMeasurementId}`;

describe("DELETE /api/measurements/body-part/measurement/:bodyPartMeasurementId", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect body part measurement id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/measurements/body-part/measurement/id",
      { method: "DELETE" },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("BodyPartMeasurementExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

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

    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    await testcases.assertErrorResponse(response, 403, "body.part.measurement.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartMeasurementQuery, "execute"))
      .mockResolvedValue(mocks.bodyPartMeasurement);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericBodyPartMeasurementRemovedEvent]);
  });
});
