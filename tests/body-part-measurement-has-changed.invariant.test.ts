import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartMeasurementHasChanged", () => {
  test("passes - body part changed", () => {
    const config = {
      current: mocks.bodyPartMeasurement,
      incoming: { ...mocks.bodyPartMeasurement, bodyPartId: mocks.anotherBodyPartId },
    };

    expect(Measurements.Invariants.BodyPartMeasurementHasChanged.passes(config)).toEqual(true);
  });

  test("passes - value changed", () => {
    const config = {
      current: mocks.bodyPartMeasurement,
      incoming: { ...mocks.bodyPartMeasurement, value: mocks.anotherBodyPartCircumference },
    };

    expect(Measurements.Invariants.BodyPartMeasurementHasChanged.passes(config)).toEqual(true);
  });

  test("passes - measured on changed", () => {
    const config = {
      current: mocks.bodyPartMeasurement,
      incoming: { ...mocks.bodyPartMeasurement, measuredOn: mocks.anotherBodyPartMeasuredOn },
    };

    expect(Measurements.Invariants.BodyPartMeasurementHasChanged.passes(config)).toEqual(true);
  });

  test("fails - nothing changed", () => {
    const config = { current: mocks.bodyPartMeasurement, incoming: mocks.bodyPartMeasurement };

    expect(Measurements.Invariants.BodyPartMeasurementHasChanged.passes(config)).toEqual(false);
  });

  test("enforce - throws", () => {
    const config = { current: mocks.bodyPartMeasurement, incoming: mocks.bodyPartMeasurement };

    expect(() => Measurements.Invariants.BodyPartMeasurementHasChanged.enforce(config)).toThrow(
      Measurements.Invariants.BodyPartMeasurementHasChanged.error,
    );
  });
});
