import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartMeasurementHasChanged", () => {
  test("passes - value changed", () => {
    const config = {
      current: mocks.bodyPartMeasurement,
      incoming: {
        value: mocks.anotherBodyPartMeasurementValue,
        measuredOn: mocks.bodyPartMeasurement.measuredOn,
      },
    };

    expect(Measurements.Invariants.BodyPartMeasurementHasChanged.passes(config)).toEqual(true);
  });

  test("passes - measuredOn changed", () => {
    const config = {
      current: mocks.bodyPartMeasurement,
      incoming: {
        value: mocks.bodyPartMeasurement.value,
        measuredOn: mocks.anotherBodyPartMeasuredOn,
      },
    };

    expect(Measurements.Invariants.BodyPartMeasurementHasChanged.passes(config)).toEqual(true);
  });

  test("fails - unchanged", () => {
    const config = {
      current: mocks.bodyPartMeasurement,
      incoming: {
        value: mocks.bodyPartMeasurement.value,
        measuredOn: mocks.bodyPartMeasurement.measuredOn,
      },
    };

    expect(Measurements.Invariants.BodyPartMeasurementHasChanged.passes(config)).toEqual(false);
  });

  test("enforce - throws", () => {
    const config = {
      current: mocks.bodyPartMeasurement,
      incoming: {
        value: mocks.bodyPartMeasurement.value,
        measuredOn: mocks.bodyPartMeasurement.measuredOn,
      },
    };

    expect(() => Measurements.Invariants.BodyPartMeasurementHasChanged.enforce(config)).toThrow(
      Measurements.Invariants.BodyPartMeasurementHasChanged.error,
    );
  });
});
