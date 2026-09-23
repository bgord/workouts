import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyWeightStatsCalculator", () => {
  test("happy path", () => {
    const calculator = new Measurements.Services.BodyWeightStatsCalculator([mocks.bodyWeightMeasurement]);

    expect(calculator.calculate()).toEqual(mocks.bodyWeightStats);
  });

  test("happy path - reference and previous week", () => {
    const earlier: Measurements.VO.BodyWeightMeasurement = {
      ...mocks.bodyWeightReferenceMeasurement,
      weight: v.parse(Measurements.VO.BodyWeight, tools.Weight.fromKilograms(82).get()),
      measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2024-12-24"),
    };

    const calculator = new Measurements.Services.BodyWeightStatsCalculator([
      mocks.bodyWeightMeasurement,
      earlier,
    ]);

    expect(calculator.calculate()).toEqual({
      latest: mocks.bodyWeightMeasurement,
      previous: earlier,
      reference: earlier,
      baseline: earlier,
      week: { average: mocks.bodyWeight, count: 1 },
      previousWeek: { average: earlier.weight },
    });
  });

  test("happy path - outside previous week window", () => {
    const outside: Measurements.VO.BodyWeightMeasurement = {
      ...mocks.bodyWeightMeasurement,
      weight: mocks.heavierBodyWeight,
      measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2024-12-18"),
    };

    const calculator = new Measurements.Services.BodyWeightStatsCalculator([
      mocks.bodyWeightMeasurement,
      outside,
    ]);

    expect(calculator.calculate()?.previousWeek).toEqual(undefined);
  });

  test("no measurements", () => {
    const calculator = new Measurements.Services.BodyWeightStatsCalculator([]);

    expect(calculator.calculate()).toEqual(null);
  });
});
