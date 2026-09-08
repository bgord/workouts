import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Stats from "+stats";
import * as mocks from "./mocks";

const calculator = new Stats.Services.ExerciseRecencyCalculator();

describe("ExerciseRecencyCalculator", () => {
  test("empty history", () => {
    expect(calculator.calculate([], mocks.T1)).toBeUndefined();
  });

  test("the same day", () => {
    expect(calculator.calculate([mocks.exerciseSession], mocks.T0)).toEqual(tools.Int.nonNegative(0));
  });

  test("the day before", () => {
    expect(calculator.calculate([mocks.exerciseSession], mocks.T1)).toEqual(tools.Int.nonNegative(1));
  });

  test("a part of a day does not count", () => {
    const almost = mocks.T1.subtract(tools.Duration.Hours(1));

    expect(calculator.calculate([mocks.exerciseSession], almost)).toEqual(tools.Int.nonNegative(0));
  });

  test("counts from the newest session", () => {
    const later = { ...mocks.exerciseSession, completedAt: mocks.T1.ms };

    expect(calculator.calculate([mocks.exerciseSession, later], mocks.T1)).toEqual(tools.Int.nonNegative(0));
  });
});
