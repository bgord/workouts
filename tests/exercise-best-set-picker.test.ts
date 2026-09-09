import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const exerciseSet = {
  id: mocks.loggedSetId,
  workoutId: mocks.workoutId,
  reps: v.parse(Workouts.VO.Reps, 5),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
};

const heavierExerciseSet = {
  id: mocks.anotherLoggedSetId,
  workoutId: mocks.workoutId,
  reps: v.parse(Workouts.VO.Reps, 3),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
};

const repeatedExerciseSet = {
  id: mocks.anotherLoggedSetId,
  workoutId: mocks.workoutId,
  reps: v.parse(Workouts.VO.Reps, 8),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
};

const tiedExerciseSet = {
  id: mocks.anotherLoggedSetId,
  workoutId: mocks.workoutId,
  reps: v.parse(Workouts.VO.Reps, 5),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
};

describe("ExerciseBestSetPicker", async () => {
  const di = await bootstrap();

  const picker = new Statistics.Services.ExerciseBestSetPicker({
    ListExerciseSetsOHQ: di.Adapters.Workouts.ListExerciseSetsQuery,
  });

  test("happy path", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      exerciseSet,
      heavierExerciseSet,
    ]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(heavierExerciseSet);
  });

  test("no sets", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(null);
  });

  test("single set", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([exerciseSet]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(exerciseSet);
  });

  test("load wins over reps", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      heavierExerciseSet,
      repeatedExerciseSet,
    ]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(heavierExerciseSet);
  });

  test("reps break the load tie", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      exerciseSet,
      repeatedExerciseSet,
    ]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(repeatedExerciseSet);
  });

  test("the earliest set wins", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      exerciseSet,
      tiedExerciseSet,
    ]);

    expect(await picker.pick(mocks.userId, mocks.exerciseId)).toEqual(exerciseSet);
  });
});
