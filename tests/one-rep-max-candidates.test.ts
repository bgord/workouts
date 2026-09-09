// cSpell:ignore brzycki
import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Stats from "+stats";
import * as mocks from "./mocks";

const candidates = new Stats.Services.OneRepMaxCandidates({
  OneRepMaxEstimator: new Stats.Services.OneRepMaxEstimatorBrzycki(),
});

const session = { workoutId: mocks.workoutId, completedAt: mocks.T0.ms };

describe("OneRepMaxCandidates", () => {
  test("best estimate first", () => {
    expect(candidates.from({ ...session, sets: [mocks.singleRepSet, mocks.fiveRepSet] })).toEqual([
      { ...mocks.fiveRepSet, ...session, oneRepMaxEstimate: v.parse(Stats.VO.OneRepMaxEstimate, 112_500) },
      { ...mocks.singleRepSet, ...session, oneRepMaxEstimate: v.parse(Stats.VO.OneRepMaxEstimate, 100_000) },
    ]);
  });

  test("skips sets above the rep limit", () => {
    expect(candidates.from({ ...session, sets: [mocks.aboveRepLimitSet, mocks.singleRepSet] })).toEqual([
      { ...mocks.singleRepSet, ...session, oneRepMaxEstimate: v.parse(Stats.VO.OneRepMaxEstimate, 100_000) },
    ]);
  });

  test("no estimable sets", () => {
    expect(candidates.from({ ...session, sets: [mocks.aboveRepLimitSet] })).toEqual([]);
  });
});
