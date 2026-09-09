// cSpell:ignore brzycki
import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";

const adapter = new Statistics.Services.OneRepEstimatorBrzycki();

const load = tools.Weight.fromKilograms(100).get();

describe("OneRepEstimatorBrzycki", () => {
  test("happy path", () => {
    expect(adapter.estimate({ reps: tools.Int.positive(1), load: tools.Weight.zero().get() })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 0),
    );
    expect(adapter.estimate({ reps: tools.Int.positive(1), load })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 100_000),
    );
    expect(adapter.estimate({ reps: tools.Int.positive(2), load })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 102_857),
    );
    expect(adapter.estimate({ reps: tools.Int.positive(8), load })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 124_138),
    );
    expect(adapter.estimate({ reps: tools.Int.positive(10), load })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 133_333),
    );
    expect(adapter.estimate({ reps: tools.Int.positive(36), load })).toEqual(
      v.parse(Statistics.VO.OneRepMaxEstimate, 3_600_000),
    );
  });

  test("over the limit", () => {
    expect(() => adapter.estimate({ reps: tools.Int.positive(37), load })).toThrow("weight.grams.type");
    expect(() => adapter.estimate({ reps: tools.Int.positive(38), load })).toThrow("weight.grams.invalid");
  });
});
