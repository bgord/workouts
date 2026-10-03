import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("LoadStepIncrementStrategy", () => {
  test("increase", () => {
    const strategy = new Workouts.Services.LoadStepIncrementStrategy(mocks.loadStep);

    const result = strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(92.5).get()));
  });

  test("increase - from zero", () => {
    const strategy = new Workouts.Services.LoadStepIncrementStrategy(mocks.loadStep);

    const result = strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()));
  });

  test("decrease", () => {
    const strategy = new Workouts.Services.LoadStepIncrementStrategy(mocks.loadStep);

    const result = strategy.decrease(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()));
  });

  test("decrease - at the step reaches zero", () => {
    const strategy = new Workouts.Services.LoadStepIncrementStrategy(mocks.loadStep);

    const result = strategy.decrease(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()));
  });

  test("decrease - below the step", () => {
    const strategy = new Workouts.Services.LoadStepIncrementStrategy(mocks.loadStep);

    const result = strategy.decrease(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2).get()));

    expect(result).toEqual(undefined);
  });
});
