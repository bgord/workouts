import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyWeightReferenceHasChanged", () => {
  test("passes - not a reference measurement", () => {
    const config = { measurement: mocks.bodyWeightMeasurement, goal: mocks.bodyWeightMeasurement.goal };

    expect(Measurements.Invariants.BodyWeightReferenceHasChanged.passes(config)).toEqual(true);
  });

  test("passes - reference measurement, goal changed", () => {
    const config = {
      measurement: mocks.bodyWeightReferenceMeasurement,
      goal: Measurements.VO.BodyWeightGoalOptions.cut,
    };

    expect(Measurements.Invariants.BodyWeightReferenceHasChanged.passes(config)).toEqual(true);
  });

  test("fails - reference measurement, goal unchanged", () => {
    const config = {
      measurement: mocks.bodyWeightReferenceMeasurement,
      goal: mocks.bodyWeightReferenceMeasurement.goal,
    };

    expect(Measurements.Invariants.BodyWeightReferenceHasChanged.passes(config)).toEqual(false);
  });

  test("enforce - throws", () => {
    const config = {
      measurement: mocks.bodyWeightReferenceMeasurement,
      goal: mocks.bodyWeightReferenceMeasurement.goal,
    };

    expect(() => Measurements.Invariants.BodyWeightReferenceHasChanged.enforce(config)).toThrow(
      Measurements.Invariants.BodyWeightReferenceHasChanged.error,
    );
  });
});
