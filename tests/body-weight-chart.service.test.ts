import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyWeightChart", () => {
  test("points - no measurements", () => {
    const chart = new Measurements.Services.BodyWeightChart([]);

    expect(chart.points(Measurements.VO.BodyWeightChartGranularityOptions.weekly)).toEqual([]);
  });

  test("points - daily", () => {
    const chart = new Measurements.Services.BodyWeightChart([
      mocks.bodyWeightReferenceMeasurement,
      mocks.heavierBodyWeightMeasurement,
    ]);

    expect(chart.points(Measurements.VO.BodyWeightChartGranularityOptions.daily)).toEqual([
      {
        from: mocks.anotherBodyWeightMeasuredOn,
        to: mocks.anotherBodyWeightMeasuredOn,
        weight: mocks.heavierBodyWeight,
        count: 1,
        reference: false,
      },
      {
        from: mocks.bodyWeightMeasuredOn,
        to: mocks.bodyWeightMeasuredOn,
        weight: mocks.bodyWeight,
        count: 1,
        reference: true,
      },
    ]);
  });

  test("points - weekly", () => {
    const chart = new Measurements.Services.BodyWeightChart([
      mocks.bodyWeightMeasurement,
      mocks.heavierBodyWeightMeasurement,
    ]);

    expect(chart.points(Measurements.VO.BodyWeightChartGranularityOptions.weekly)).toEqual([
      {
        from: mocks.anotherBodyWeightMeasuredOn,
        to: mocks.bodyWeightMeasuredOn,
        weight: mocks.anotherBodyWeight,
        count: 2,
        reference: false,
      },
    ]);
  });

  test("points - weekly - reference", () => {
    const chart = new Measurements.Services.BodyWeightChart([
      mocks.bodyWeightReferenceMeasurement,
      mocks.heavierBodyWeightMeasurement,
    ]);

    expect(chart.points(Measurements.VO.BodyWeightChartGranularityOptions.weekly)).toEqual([
      {
        from: mocks.anotherBodyWeightMeasuredOn,
        to: mocks.bodyWeightMeasuredOn,
        weight: mocks.anotherBodyWeight,
        count: 2,
        reference: true,
      },
    ]);
  });

  test("points - weekly - skips empty weeks", () => {
    const chart = new Measurements.Services.BodyWeightChart([
      {
        ...mocks.heavierBodyWeightMeasurement,
        measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2025-01-13"),
      },
      mocks.bodyWeightMeasurement,
    ]);

    expect(chart.points(Measurements.VO.BodyWeightChartGranularityOptions.weekly)).toEqual([
      {
        from: mocks.bodyWeightMeasuredOn,
        to: mocks.bodyWeightMeasuredOn,
        weight: mocks.bodyWeight,
        count: 1,
        reference: false,
      },
      {
        from: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2025-01-13"),
        to: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2025-01-13"),
        weight: mocks.heavierBodyWeight,
        count: 1,
        reference: false,
      },
    ]);
  });
});
