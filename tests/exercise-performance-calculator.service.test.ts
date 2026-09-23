// cSpell:ignore epley
import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ExercisePerformanceCalculator", async () => {
  const di = await bootstrap();

  const calculator = new Statistics.Services.ExercisePerformanceCalculator({
    OneRepEstimator: new Statistics.Services.OneRepEstimatorEpley(),
    ListExercisePerformancesOHQ: di.Adapters.Workouts.ListExercisePerformancesQuery,
  });

  test("happy path", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExercisePerformancesQuery, "execute").mockResolvedValue([
      mocks.exercisePerformance,
    ]);

    expect(await calculator.calculate(mocks.userId, mocks.exerciseId)).toEqual([
      mocks.calculatedExercisePerformance,
    ]);
  });

  test("happy path - best set is the first with the highest estimate, not the last", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExercisePerformancesQuery, "execute").mockResolvedValue([
      {
        ...mocks.exercisePerformance,
        sets: [
          {
            setNumber: v.parse(Workouts.VO.SetNumber, 1),
            reps: v.parse(Workouts.VO.Reps, 1),
            load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
            rir: null,
          },
          {
            setNumber: v.parse(Workouts.VO.SetNumber, 2),
            reps: v.parse(Workouts.VO.Reps, 1),
            load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(50).get()),
            rir: null,
          },
          {
            setNumber: v.parse(Workouts.VO.SetNumber, 3),
            reps: v.parse(Workouts.VO.Reps, 1),
            load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
            rir: null,
          },
        ],
      },
    ]);

    const [result] = await calculator.calculate(mocks.userId, mocks.exerciseId);

    expect(result?.bestSet.setNumber).toEqual(v.parse(Workouts.VO.SetNumber, 1));
  });

  test("no performances", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExercisePerformancesQuery, "execute").mockResolvedValue([]);

    expect(await calculator.calculate(mocks.userId, mocks.exerciseId)).toEqual([]);
  });
});
