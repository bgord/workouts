import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartChart", () => {
  test("points - no measurements", () => {
    const chart = new Measurements.Services.BodyPartChart([]);

    expect(chart.points(Measurements.VO.BodyPartChartGranularityOptions.weekly)).toEqual([]);
  });

  test("points - daily", () => {
    const chart = new Measurements.Services.BodyPartChart([
      mocks.bodyPartMeasurement,
      mocks.heavierBodyPartMeasurement,
    ]);

    expect(chart.points(Measurements.VO.BodyPartChartGranularityOptions.daily)).toEqual([
      {
        from: mocks.anotherBodyPartMeasuredOn,
        to: mocks.anotherBodyPartMeasuredOn,
        value: mocks.heavierBodyPartMeasurementValue,
        count: 1,
      },
      {
        from: mocks.bodyPartMeasuredOn,
        to: mocks.bodyPartMeasuredOn,
        value: mocks.bodyPartMeasurementValue,
        count: 1,
      },
    ]);
  });

  test("points - weekly", () => {
    const chart = new Measurements.Services.BodyPartChart([
      mocks.bodyPartMeasurement,
      mocks.heavierBodyPartMeasurement,
    ]);

    expect(chart.points(Measurements.VO.BodyPartChartGranularityOptions.weekly)).toEqual([
      {
        from: mocks.anotherBodyPartMeasuredOn,
        to: mocks.bodyPartMeasuredOn,
        value: v.parse(Measurements.VO.BodyPartMeasurementValue, 1050),
        count: 2,
      },
    ]);
  });

  test("points - weekly - skips empty weeks", () => {
    const chart = new Measurements.Services.BodyPartChart([
      {
        ...mocks.heavierBodyPartMeasurement,
        measuredOn: v.parse(Measurements.VO.BodyPartMeasuredOn, "2025-01-13"),
      },
      mocks.bodyPartMeasurement,
    ]);

    expect(chart.points(Measurements.VO.BodyPartChartGranularityOptions.weekly)).toEqual([
      {
        from: mocks.bodyPartMeasuredOn,
        to: mocks.bodyPartMeasuredOn,
        value: mocks.bodyPartMeasurementValue,
        count: 1,
      },
      {
        from: v.parse(Measurements.VO.BodyPartMeasuredOn, "2025-01-13"),
        to: v.parse(Measurements.VO.BodyPartMeasuredOn, "2025-01-13"),
        value: mocks.heavierBodyPartMeasurementValue,
        count: 1,
      },
    ]);
  });
});
