import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("BodyPartMeasurementValue", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.BodyPartMeasurementValue, 0).success).toEqual(true);
    expect(v.safeParse(Measurements.VO.BodyPartMeasurementValue, 1020).success).toEqual(true);
  });

  test("rejects non-number", () => {
    expect(() => v.parse(Measurements.VO.BodyPartMeasurementValue, "abc")).toThrow(
      "body.part.measurement.value.type",
    );
  });

  test("rejects non-integer", () => {
    expect(() => v.parse(Measurements.VO.BodyPartMeasurementValue, 1.5)).toThrow(
      "body.part.measurement.value.type",
    );
  });

  test("rejects negative", () => {
    expect(() => v.parse(Measurements.VO.BodyPartMeasurementValue, -1)).toThrow(
      "body.part.measurement.value.invalid",
    );
  });
});
