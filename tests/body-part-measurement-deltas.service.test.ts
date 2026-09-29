import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartMeasurementDeltas", () => {
  test("empty", () => {
    const deltas = new Measurements.Services.BodyPartMeasurementDeltas([]);

    expect(deltas.calculate()).toEqual([]);
  });

  test("single", () => {
    const deltas = new Measurements.Services.BodyPartMeasurementDeltas([mocks.bodyPartMeasurement]);

    expect(deltas.calculate()).toEqual([{ ...mocks.bodyPartMeasurement, delta: null }]);
  });

  test("newest first", () => {
    const deltas = new Measurements.Services.BodyPartMeasurementDeltas([
      { ...mocks.bodyPartMeasurement, value: mocks.anotherBodyPartCircumference },
      mocks.bodyPartMeasurement,
    ]);

    expect(deltas.calculate()).toEqual([
      { ...mocks.bodyPartMeasurement, value: mocks.anotherBodyPartCircumference, delta: 10 },
      { ...mocks.bodyPartMeasurement, delta: null },
    ]);
  });
});
