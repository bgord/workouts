import { describe, expect, spyOn, test } from "bun:test";
import * as Exercises from "+exercises";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ExerciseDeleter", async () => {
  const di = await bootstrap();

  const policy = new Exercises.Policies.ExerciseDeleter({ ...di.Adapters.System, ...di.Tools });

  test("onExerciseDeletedEvent", async () => {
    using enqueue = spyOn(di.Adapters.System.RemoteFileStorage, "delete");

    await policy.onExerciseDeletedEvent(mocks.GenericExerciseDeletedEvent);

    expect(enqueue).toHaveBeenCalledWith(mocks.exerciseImageKey);
  });
});
