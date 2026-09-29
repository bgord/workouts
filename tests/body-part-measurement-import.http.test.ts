import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-part/import";

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - file - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: new FormData() }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "file.uploader.missing.file");
  });

  test("validation - file - invalid mime", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const form = new FormData();
    form.append("file", mocks.png);

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "file.uploader.invalid.mime");
  });

  test("validation - bodyPartName - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        `id,bodyPartName,value,measuredOn\n,,${mocks.bodyPartCircumference},${mocks.bodyPartMeasuredOn}`,
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "body.part.name.invalid");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - value - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        `id,bodyPartName,value,measuredOn\n,${mocks.bodyPartName},,${mocks.bodyPartMeasuredOn}`,
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "height.millimeters.type");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - value - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        `id,bodyPartName,value,measuredOn\n,${mocks.bodyPartName},-1,${mocks.bodyPartMeasuredOn}`,
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "height.millimeters.invalid");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - measuredOn - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        `id,bodyPartName,value,measuredOn\n,${mocks.bodyPartName},${mocks.bodyPartCircumference},`,
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "day.iso.id.bad.chars");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - measuredOn - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        `id,bodyPartName,value,measuredOn\n,${mocks.bodyPartName},${mocks.bodyPartCircumference},01-01-2025`,
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "day.iso.id.bad.chars");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartMeasuredOnIsNotInFuture", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        [
          "id,bodyPartName,value,measuredOn",
          `,${mocks.bodyPartName},${mocks.bodyPartCircumference},${mocks.bodyPartMeasuredOn}`,
          `,${mocks.anotherBodyPartName},${mocks.bodyPartCircumference},${mocks.futureBodyPartMeasuredOn}`,
        ].join("\n"),
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 403, "body.part.measured.on.is.not.in.future");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("BodyPartExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartByNameQuery, "execute"))
      .mockResolvedValueOnce(mocks.bodyPart)
      .mockResolvedValueOnce(null);

    const form = new FormData();
    form.append(
      "file",
      mocks.bodyPartMeasurementCsvFile(
        [
          "id,bodyPartName,value,measuredOn",
          `,${mocks.bodyPartName},${mocks.bodyPartCircumference},${mocks.bodyPartMeasuredOn}`,
          `,${mocks.anotherBodyPartName},${mocks.anotherBodyPartCircumference},${mocks.bodyPartMeasuredOn}`,
        ].join("\n"),
      ),
    );

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertErrorResponse(response, 404, "body.part.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Measurements.GetBodyPartByNameQuery, "execute"))
      .mockResolvedValueOnce(mocks.bodyPart)
      .mockResolvedValueOnce(mocks.anotherBodyPart);
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.bodyPartMeasurementId)
      .mockReturnValueOnce(mocks.anotherBodyPartMeasurementId);

    const content = [
      ["id", "bodyPartName", "value", "measuredOn"],
      [
        mocks.bodyPartMeasurementId,
        mocks.bodyPartName,
        mocks.bodyPartCircumference,
        mocks.bodyPartMeasuredOn,
      ],
      [
        mocks.anotherBodyPartMeasurementId,
        mocks.anotherBodyPartName,
        mocks.anotherBodyPartCircumference,
        mocks.bodyPartMeasuredOn,
      ],
    ]
      .map((row) => row.join(","))
      .join("\n");
    const form = new FormData();
    form.append("file", mocks.bodyPartMeasurementCsvFile(content));

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdHeaders, body: form },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [mocks.GenericBodyPartMeasuredEvent]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericAnotherBodyPartMeasuredEvent]);
  });
});
