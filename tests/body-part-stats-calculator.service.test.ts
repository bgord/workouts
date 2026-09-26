import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartStatsCalculator", () => {
  test("happy path", () => {
    const calculator = new Measurements.Services.BodyPartStatsCalculator([mocks.bodyPartMeasurement]);

    expect(calculator.calculate()).toEqual(mocks.bodyPartStats);
  });

  test("happy path - previous week", () => {
    const earlier: Measurements.VO.BodyPartMeasurement = {
      ...mocks.bodyPartMeasurement,
      value: mocks.anotherBodyPartMeasurementValue,
      measuredOn: v.parse(Measurements.VO.BodyPartMeasuredOn, "2024-12-24"),
    };

    const calculator = new Measurements.Services.BodyPartStatsCalculator([
      mocks.bodyPartMeasurement,
      earlier,
    ]);

    expect(calculator.calculate()).toEqual({
      latest: mocks.bodyPartMeasurement,
      previous: earlier,
      baseline: earlier,
      week: { average: mocks.bodyPartMeasurementValue, count: 1 },
      previousWeek: { average: earlier.value },
    });
  });

  test("happy path - outside previous week window", () => {
    const outside: Measurements.VO.BodyPartMeasurement = {
      ...mocks.bodyPartMeasurement,
      value: mocks.heavierBodyPartMeasurementValue,
      measuredOn: v.parse(Measurements.VO.BodyPartMeasuredOn, "2024-12-18"),
    };

    const calculator = new Measurements.Services.BodyPartStatsCalculator([
      mocks.bodyPartMeasurement,
      outside,
    ]);

    expect(calculator.calculate()?.previousWeek).toEqual(undefined);
  });

  test("no measurements", () => {
    const calculator = new Measurements.Services.BodyPartStatsCalculator([]);

    expect(calculator.calculate()).toEqual(null);
  });
});
