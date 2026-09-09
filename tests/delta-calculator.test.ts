import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Stats from "+stats";

describe("DeltaCalculator", () => {
  test("progress", () => {
    expect(Stats.Services.DeltaCalculator.between(600_000, 500_000)).toEqual(
      v.parse(Stats.VO.Delta, 100_000),
    );
  });

  test("regress", () => {
    expect(Stats.Services.DeltaCalculator.between(500_000, 600_000)).toEqual(
      v.parse(Stats.VO.Delta, -100_000),
    );
  });

  test("no change", () => {
    expect(Stats.Services.DeltaCalculator.between(500_000, 500_000)).toEqual(v.parse(Stats.VO.Delta, 0));
  });

  test("missing current", () => {
    expect(Stats.Services.DeltaCalculator.between(undefined, 500_000)).toBeUndefined();
  });

  test("missing previous", () => {
    expect(Stats.Services.DeltaCalculator.between(500_000, undefined)).toBeUndefined();
  });
});
