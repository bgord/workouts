// cSpell:ignore epley
import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";

const rounding = new tools.RoundingToNearestStrategy();
const adapter = new Statistics.Services.OneRepEstimatorEpley({
  rounding,
});

const load = tools.Weight.fromKilograms(100).get();

describe("OneRepEstimatorEpley", () => {
  test("happy path", () => {
    expect(adapter.estimate({ reps: tools.Int.positive(1), load: tools.Weight.zero().get() })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 0),
    );
    expect(adapter.estimate({ reps: tools.Int.positive(1), load })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 100_000),
    );
    expect(adapter.estimate({ reps: tools.Int.positive(2), load })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 106_667),
    );
    expect(adapter.estimate({ reps: tools.Int.positive(8), load })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 126_667),
    );
    expect(adapter.estimate({ reps: tools.Int.positive(10), load })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 133_333),
    );
    expect(adapter.estimate({ reps: tools.Int.positive(36), load })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 220000),
    );
  });
});
