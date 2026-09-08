// cSpell:ignore brzycki
import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Stats from "+stats";
import * as mocks from "./mocks";

const estimator = new Stats.Services.OneRepMaxEstimatorBrzycki();

describe("OneRepMaxEstimatorBrzycki", () => {
  test("single", () => {
    expect(estimator.estimate(mocks.singleRepSet)).toEqual(v.parse(Stats.VO.OneRepMaxEstimate, 100_000));
  });

  test("five reps", () => {
    expect(estimator.estimate(mocks.fiveRepSet)).toEqual(v.parse(Stats.VO.OneRepMaxEstimate, 112_500));
  });

  test("eight reps", () => {
    expect(estimator.estimate(mocks.eightRepSet)).toEqual(v.parse(Stats.VO.OneRepMaxEstimate, 18_621));
  });

  test("high reps", () => {
    expect(estimator.estimate(mocks.fifteenRepSet)).toEqual(v.parse(Stats.VO.OneRepMaxEstimate, 65_455));
  });

  test("at the limit", () => {
    expect(estimator.estimate(mocks.repLimitSet)).toEqual(v.parse(Stats.VO.OneRepMaxEstimate, 211_765));
  });

  test("above the limit", () => {
    expect(estimator.estimate(mocks.aboveRepLimitSet)).toBeUndefined();
  });
});
