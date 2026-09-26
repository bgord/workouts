import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/measurements/body-part/${mocks.bodyPartId}`;

describe("PATCH /api/measurements/body-part/:bodyPartId", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect body part id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/measurements/body-part/id",
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - name - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "PATCH", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "body.part.name.type");
  });

  test("validation - name - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ name: "a".repeat(65) }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.name.invalid");
  });

  test("BodyPartExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ name: mocks.anotherBodyPartName }) },
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
      { method: "PATCH", body: JSON.stringify({ name: mocks.anotherBodyPartName }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartNameIsUnique", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartNameCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(1));

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ name: mocks.anotherBodyPartName }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.name.is.unique");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.GetBodyPartQuery, "execute")).mockResolvedValue(mocks.bodyPart);
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartNameCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
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
