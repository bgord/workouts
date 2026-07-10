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

const url = "/api/exercises/add";

const png = new File(["image"], "image.png");

const form = new FormData();
form.append("file", png);
form.append("name", mocks.exerciseName);
form.append("description", mocks.exerciseDescription);

const temporary = tools.Filename.fromString(`${mocks.temporaryFileId}.png`);
const final = temporary.withExtension(v.parse(tools.Extension, "webp"));

const inspection = {
  width: v.parse(tools.ImageWidth, 100),
  height: v.parse(tools.ImageHeight, 100),
  mime: tools.Mimes.png.mime,
  size: tools.Size.fromKb(100),
};

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected, _known: true });
  });

  test("validation - empty payload", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    expect(response.status).toEqual(500);
  });

  test("validation - name - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const form = new FormData();
    form.append("file", png);

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "exercise.name.type", _known: true });
  });

  test("validation - name - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const form = new FormData();
    form.append("file", png);
    form.append("name", "a".repeat(129));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "exercise.name.invalid", _known: true });
  });

  test("validation - description - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const form = new FormData();
    form.append("file", png);
    form.append("name", mocks.exerciseName);

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "exercise.description.type", _known: true });
  });

  test("validation - description - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const form = new FormData();
    form.append("file", png);
    form.append("name", mocks.exerciseName);
    form.append("description", "a".repeat(257));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "exercise.description.invalid", _known: true });
  });

  test("ExerciseNameIsUnique", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.temporaryFileId)
      .mockReturnValueOnce(mocks.exerciseId);
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseNameCount, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(1));

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdHeaders, body: form },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "exercise.name.is.unique");
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(temporary);
  });

  test("ExerciseImageConstraints - maxSide - width", async () => {
    const width = v.parse(tools.ImageWidth, 4100);
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.temporaryFileId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValue(ids.generate());
    spies.use(spyOn(di.Adapters.System.ImageInfo, "inspect")).mockResolvedValue({ ...inspection, width });
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseNameCount, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "exercise.image.constraints");
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(temporary);
  });

  test("ExerciseImageConstraints - maxSide - height", async () => {
    const height = v.parse(tools.ImageHeight, 4100);
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.temporaryFileId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValue(ids.generate());
    spies.use(spyOn(di.Adapters.System.ImageInfo, "inspect")).mockResolvedValue({ ...inspection, height });
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseNameCount, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "exercise.image.constraints");
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(temporary);
  });

  test("ExerciseImageConstraints - size", async () => {
    const size = tools.Size.fromMB(100);
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.temporaryFileId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValue(ids.generate());
    spies.use(spyOn(di.Adapters.System.ImageInfo, "inspect")).mockResolvedValue({ ...inspection, size });
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseNameCount, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "exercise.image.constraints");
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(temporary);
  });

  test("ExerciseImageConstraints - mime", async () => {
    const mime = tools.Mimes.text.mime;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.temporaryFileId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValue(ids.generate());
    spies.use(spyOn(di.Adapters.System.ImageInfo, "inspect")).mockResolvedValue({ ...inspection, mime });
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseNameCount, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

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
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.temporaryFileId)
      .mockReturnValueOnce(mocks.exerciseId);
    spies.use(spyOn(di.Adapters.System.ImageInfo, "inspect")).mockResolvedValue(inspection);
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseNameCount, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdHeaders, body: form },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(temporaryFileWrite).toHaveBeenCalledWith(temporary, png);
    expect(temporaryFileCleanup).toHaveBeenCalledWith(final);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericExerciseAddedEvent]);
  });
});
