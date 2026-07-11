import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/exercises/${mocks.exerciseId}/image`;

const png = new File(["image"], "image.png");

const form = new FormData();
form.append("file", png);

const temporary = tools.Filename.fromString(`${mocks.temporaryFileId}.png`);
const final = temporary.withExtension(v.parse(tools.Extension, "webp"));

const inspection = {
  width: v.parse(tools.ImageWidth, 100),
  height: v.parse(tools.ImageHeight, 100),
  mime: tools.Mimes.png.mime,
  size: tools.Size.fromKb(100),
};

describe(`PATCH ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected, _known: true });
  });

  test("validation - empty payload", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);

    expect(response.status).toEqual(500);
  });

  test("ExerciseExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValueOnce(mocks.temporaryFileId);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.correlationIdHeaders, body: form },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "exercise.exists");
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(temporary);
  });

  test("ExerciseImageConstraints - maxSide - width", async () => {
    const width = v.parse(tools.ImageWidth, 4100);
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValue(mocks.temporaryFileId);
    spies.use(spyOn(di.Adapters.System.ImageInfo, "inspect")).mockResolvedValue({ ...inspection, width });
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(url, { method: "PATCH", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "exercise.image.constraints");
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(temporary);
  });

  test("ExerciseImageConstraints - maxSide - height", async () => {
    const height = v.parse(tools.ImageHeight, 4100);
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValue(mocks.temporaryFileId);
    spies.use(spyOn(di.Adapters.System.ImageInfo, "inspect")).mockResolvedValue({ ...inspection, height });
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(url, { method: "PATCH", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "exercise.image.constraints");
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(temporary);
  });

  test("ExerciseImageConstraints - size", async () => {
    const size = tools.Size.fromMB(100);
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValue(mocks.temporaryFileId);
    spies.use(spyOn(di.Adapters.System.ImageInfo, "inspect")).mockResolvedValue({ ...inspection, size });
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(url, { method: "PATCH", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "exercise.image.constraints");
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(temporary);
  });

  test("ExerciseImageConstraints - mime", async () => {
    const mime = tools.Mimes.text.mime;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValue(mocks.temporaryFileId);
    spies.use(spyOn(di.Adapters.System.ImageInfo, "inspect")).mockResolvedValue({ ...inspection, mime });
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(url, { method: "PATCH", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "exercise.image.constraints");
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(temporary);
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValueOnce(mocks.temporaryFileId);
    spies.use(spyOn(di.Adapters.System.ImageInfo, "inspect")).mockResolvedValue(inspection);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.correlationIdHeaders, body: form },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(final);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericExerciseImageChangedEvent]);
  });
});
