import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

const from = v.parse(tools.DayIsoId, "2024-12-30");
const to = v.parse(tools.DayIsoId, "2025-01-05");

describe("BodyWeightAverage", () => {
  test("calculate - no measurements", () => {
    const average = new Measurements.Services.BodyWeightAverage([], from, to);

    expect(average.calculate()).toEqual(null);
  });

  test("calculate - a single measurement", () => {
    const average = new Measurements.Services.BodyWeightAverage([mocks.bodyWeightMeasurement], from, to);

    expect(average.calculate()).toEqual({ average: mocks.bodyWeight, count: 1 });
  });

  test("calculate - averages the measurements in range", () => {
    const heavier = v.parse(Measurements.VO.BodyWeight, tools.Weight.fromKilograms(82).get());

    const average = new Measurements.Services.BodyWeightAverage(
      [
        mocks.bodyWeightMeasurement,
        { ...mocks.bodyWeightMeasurement, weight: heavier, measuredOn: mocks.anotherBodyWeightMeasuredOn },
      ],
      from,
      to,
    );

    expect(average.calculate()).toEqual({ average: (mocks.bodyWeight + heavier) / 2, count: 2 });
  });

  test("calculate - the average is a whole number of grams", () => {
    const heavier = v.parse(Measurements.VO.BodyWeight, tools.Weight.fromKilograms(81).get());

    const average = new Measurements.Services.BodyWeightAverage(
      [
        mocks.bodyWeightMeasurement,
        mocks.bodyWeightMeasurement,
        { ...mocks.bodyWeightMeasurement, weight: heavier, measuredOn: mocks.anotherBodyWeightMeasuredOn },
      ],
      from,
      to,
    );

    expect(average.calculate()).toEqual({ average: 80333, count: 3 });
  });

  test("calculate - the range is inclusive on both ends", () => {
    const average = new Measurements.Services.BodyWeightAverage(
      [
        { ...mocks.bodyWeightMeasurement, measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, from) },
        { ...mocks.bodyWeightMeasurement, measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, to) },
      ],
      from,
      to,
    );

    expect(average.calculate()).toEqual({ average: mocks.bodyWeight, count: 2 });
  });

  test("calculate - measurements outside the range are ignored", () => {
    const average = new Measurements.Services.BodyWeightAverage(
      [
        mocks.bodyWeightMeasurement,
        {
          ...mocks.bodyWeightMeasurement,
          measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2025-01-06"),
        },
        {
          ...mocks.bodyWeightMeasurement,
          measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2024-12-29"),
        },
      ],
      from,
      to,
    );

    expect(average.calculate()).toEqual({ average: mocks.bodyWeight, count: 1 });
  });
});
