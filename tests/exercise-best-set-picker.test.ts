import { describe, expect, spyOn, test } from "bun:test";
import * as Statistics from "+statistics";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ExerciseBestSetPicker", async () => {
  const di = await bootstrap();

  const picker = new Statistics.Services.ExerciseBestSetPicker({
    ListExerciseSetsOHQ: di.Adapters.Workouts.ListExerciseSetsQuery,
  });

  test("happy path", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      mocks.exerciseSet,
      mocks.heaviestExerciseSet,
    ]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(mocks.heaviestExerciseSet);
  });

  test("no sets", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(null);
  });

  test("single set", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      mocks.exerciseSet,
    ]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(mocks.exerciseSet);
  });

  test("load wins over reps", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      mocks.heaviestExerciseSet,
      mocks.anotherExerciseSet,
    ]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(mocks.heaviestExerciseSet);
  });

  test("reps break the load tie", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      mocks.exerciseSet,
      mocks.anotherExerciseSet,
    ]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(mocks.anotherExerciseSet);
  });

  test("the earliest set wins", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      mocks.exerciseSet,
      mocks.tiedExerciseSet,
    ]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(mocks.exerciseSet);
  });
});
