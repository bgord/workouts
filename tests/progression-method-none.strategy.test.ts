import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodNoneStrategy", () => {
  test("last only, no regress and no progress", () => {
    const strategy = new Workouts.Services.ProgressionMethodNoneStrategy(mocks.exercisePerformanceWeakestSet);

    expect(strategy.calculate()).toEqual({ last: mocks.exercisePerformanceWeakestSet });
  });
});
