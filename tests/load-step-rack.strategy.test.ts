import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";

describe("LoadStepRackStrategy", () => {
  test("increase", () => {
    const strategy = new Workouts.Services.LoadStepRackStrategy({ rack: Workouts.VO.DumbbellRack });

    const result = strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(20).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(22).get()));
  });

  test("increase - half kilogram dumbbell", () => {
    const strategy = new Workouts.Services.LoadStepRackStrategy({ rack: Workouts.VO.DumbbellRack });

    const result = strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(12).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(12.5).get()));
  });

  test("increase - off the rack", () => {
    const strategy = new Workouts.Services.LoadStepRackStrategy({ rack: Workouts.VO.DumbbellRack });

    const result = strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(11).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(12).get()));
  });

  test("increase - from zero", () => {
    const strategy = new Workouts.Services.LoadStepRackStrategy({ rack: Workouts.VO.DumbbellRack });

    const result = strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(1).get()));
  });

  test("increase - heaviest", () => {
    const strategy = new Workouts.Services.LoadStepRackStrategy({ rack: Workouts.VO.DumbbellRack });

    const result = strategy.increase(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(50).get()));

    expect(result).toEqual(undefined);
  });

  test("decrease", () => {
    const strategy = new Workouts.Services.LoadStepRackStrategy({ rack: Workouts.VO.DumbbellRack });

    const result = strategy.decrease(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(20).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(18).get()));
  });

  test("decrease - half kilogram dumbbell", () => {
    const strategy = new Workouts.Services.LoadStepRackStrategy({ rack: Workouts.VO.DumbbellRack });

    const result = strategy.decrease(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(12.5).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(12).get()));
  });

  test("decrease - off the rack", () => {
    const strategy = new Workouts.Services.LoadStepRackStrategy({ rack: Workouts.VO.DumbbellRack });

    const result = strategy.decrease(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(11).get()));

    expect(result).toEqual(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(10).get()));
  });

  test("decrease - lightest", () => {
    const strategy = new Workouts.Services.LoadStepRackStrategy({ rack: Workouts.VO.DumbbellRack });

    const result = strategy.decrease(v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(1).get()));

    expect(result).toEqual(undefined);
  });
});
