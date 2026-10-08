import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Exercises from "+exercises";
import * as Workouts from "+workouts";

describe("LoadStepStrategyFactory", () => {
  test("none", () => {
    const strategy = Workouts.Services.LoadStepStrategyFactory.for(Exercises.VO.ExerciseLoadStepOptions.none);

    expect(strategy).toBeInstanceOf(Workouts.Services.LoadStepLockedStrategy);
  });

  test("kg_1", () => {
    const strategy = Workouts.Services.LoadStepStrategyFactory.for(Exercises.VO.ExerciseLoadStepOptions.kg_1);

    expect(strategy).toBeInstanceOf(Workouts.Services.LoadStepIncrementStrategy);
    expect(strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(20).get()))).toEqual(
      v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(21).get()),
    );
  });

  test("kg_2_5", () => {
    const strategy = Workouts.Services.LoadStepStrategyFactory.for(Exercises.VO.ExerciseLoadStepOptions.kg_2_5);

    expect(strategy).toBeInstanceOf(Workouts.Services.LoadStepIncrementStrategy);
    expect(strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(20).get()))).toEqual(
      v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(22.5).get()),
    );
  });

  test("kg_5", () => {
    const strategy = Workouts.Services.LoadStepStrategyFactory.for(Exercises.VO.ExerciseLoadStepOptions.kg_5);

    expect(strategy).toBeInstanceOf(Workouts.Services.LoadStepIncrementStrategy);
    expect(strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(20).get()))).toEqual(
      v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(25).get()),
    );
  });

  test("kg_10", () => {
    const strategy = Workouts.Services.LoadStepStrategyFactory.for(Exercises.VO.ExerciseLoadStepOptions.kg_10);

    expect(strategy).toBeInstanceOf(Workouts.Services.LoadStepIncrementStrategy);
    expect(strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(20).get()))).toEqual(
      v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(30).get()),
    );
  });

  test("dumbbell_rack", () => {
    const strategy = Workouts.Services.LoadStepStrategyFactory.for(
      Exercises.VO.ExerciseLoadStepOptions.dumbbell_rack,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.LoadStepRackStrategy);
    expect(strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(20).get()))).toEqual(
      v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(22).get()),
    );
  });
});
