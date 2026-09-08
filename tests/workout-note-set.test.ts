import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/workouts/${mocks.workoutId}/note`;

describe("PATCH /api/workouts/:workoutId/note", async () => {
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

  test("validation - incorrect workout id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/workouts/id/note",
      { method: "PATCH", body: JSON.stringify({ note: mocks.workoutNote }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("validation - note - wrong type", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(), body: JSON.stringify({ note: 2024 }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "workout.note.type" });
  });

  test("validation - note - empty", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(), body: JSON.stringify({ note: "" }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "workout.note.invalid" });
  });

  test("WorkoutExists", async () => {
    const events = [] as const;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ note: mocks.workoutNote }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 404, "workout.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutBelongsToUser", async () => {
    const events = [mocks.GenericWorkoutCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ note: mocks.workoutNote }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutNoteHasChanged", async () => {
    const events = [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutNoteSetEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ note: mocks.workoutNote }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.note.has.changed");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutNoteHasChanged - clearing an absent note", async () => {
    const events = [mocks.GenericWorkoutCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ note: null }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.note.has.changed");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    const events = [mocks.GenericWorkoutCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(99),
        body: JSON.stringify({ note: mocks.workoutNote }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    const events = [mocks.GenericWorkoutCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.correlationIdAndRevisionHeaders(events.length),
        body: JSON.stringify({ note: mocks.workoutNote }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutNoteSetEvent]);
  });

  test("happy path - clears the note", async () => {
    const events = [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutNoteSetEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.correlationIdAndRevisionHeaders(events.length),
        body: JSON.stringify({ note: null }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutNoteUnsetEvent]);
  });
});
