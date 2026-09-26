import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-part";

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - name - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "body.part.name.type");
  });

  test("validation - name - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ name: "a".repeat(65) }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.name.invalid");
  });

  test("BodyPartLimit", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue(Array.from({ length: 20 }, () => mocks.bodyPart));

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ name: mocks.bodyPartName }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.limit");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartNameIsUnique", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute")).mockResolvedValue([]);
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartNameCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(1));

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ name: mocks.bodyPartName }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "body.part.name.is.unique");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValueOnce(mocks.bodyPartId);
    spies.use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute")).mockResolvedValue([]);
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartNameCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
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
