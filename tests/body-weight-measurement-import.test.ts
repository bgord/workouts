import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-weight/import";

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("validation - file - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: new FormData() }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: bg.FileUploaderError.MissingFile });
  });

  test("validation - file - invalid mime", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const form = new FormData();
    form.append("file", mocks.png);

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: bg.FileUploaderError.InvalidMime });
  });

  test("validation - weight - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyWeightMeasurementCsvFile(`id,weight,measuredOn\n,,${mocks.bodyWeightMeasuredOn}`),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: tools.WeightGramsError.Type });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - weight - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyWeightMeasurementCsvFile(`id,weight,measuredOn\n,-1,${mocks.bodyWeightMeasuredOn}`),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: tools.WeightGramsError.Invalid });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - measuredOn - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append("file", mocks.bodyWeightMeasurementCsvFile(`id,weight,measuredOn\n,${mocks.bodyWeight},`));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: tools.DayIsoIdError.BadChars });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - measuredOn - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyWeightMeasurementCsvFile(`id,weight,measuredOn\n,${mocks.bodyWeight},01-01-2025`),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: tools.DayIsoIdError.BadChars });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyWeightMeasuredOnIsNotInFuture", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyWeightMeasurementCsvFile(
        [
          "id,weight,measuredOn",
          `,${mocks.bodyWeight},${mocks.bodyWeightMeasuredOn}`,
          `,${mocks.anotherBodyWeight},${mocks.futureBodyWeightMeasuredOn}`,
        ].join("\n"),
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 403, "body.weight.measured.on.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.bodyWeightMeasurementId)
      .mockReturnValueOnce(mocks.anotherBodyWeightMeasurementId);

    const content = [
      ["id", "weight", "measuredOn"],
      [mocks.bodyWeightMeasurementId, mocks.bodyWeight, mocks.bodyWeightMeasuredOn],
      [mocks.anotherBodyWeightMeasurementId, mocks.anotherBodyWeight, mocks.anotherBodyWeightMeasuredOn],
    ]
      .map((row) => row.join(","))
      .join("\n");
    const form = new FormData();
    form.append("file", mocks.bodyWeightMeasurementCsvFile(content));

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdHeaders, body: form },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [mocks.GenericBodyWeightMeasuredEvent]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericAnotherBodyWeightMeasuredEvent]);
  });
});
