import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Stats from "+stats";
import * as mocks from "./mocks";

const heavier = {
  ...mocks.exerciseRecord,
  completedAt: mocks.T1.ms,
  oneRepMaxEstimate: v.parse(Stats.VO.OneRepMaxEstimate, 112_500),
} satisfies Stats.VO.EstimatedRecord;

const lighter = {
  ...mocks.exerciseRecord,
  completedAt: mocks.T0.ms,
  oneRepMaxEstimate: v.parse(Stats.VO.OneRepMaxEstimate, 100_000),
} satisfies Stats.VO.EstimatedRecord;

describe("EstimatedRecordOrder", () => {
  test("higher estimate wins", () => {
    expect(Stats.Services.EstimatedRecordOrder.compare(heavier, lighter)).toBeLessThan(0);
    expect(Stats.Services.EstimatedRecordOrder.compare(lighter, heavier)).toBeGreaterThan(0);
  });

  test("equal estimate - earlier wins", () => {
    const earlier = { ...heavier, completedAt: mocks.T0.ms };

    expect(Stats.Services.EstimatedRecordOrder.compare(earlier, heavier)).toBeLessThan(0);
    expect(Stats.Services.EstimatedRecordOrder.compare(heavier, earlier)).toBeGreaterThan(0);
  });

  test("equal estimate and moment", () => {
    expect(Stats.Services.EstimatedRecordOrder.compare(heavier, heavier)).toEqual(0);
  });
});
