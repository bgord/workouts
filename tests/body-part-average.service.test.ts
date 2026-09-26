import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

const from = v.parse(tools.DayIsoId, "2024-12-30");
const to = v.parse(tools.DayIsoId, "2025-01-05");

describe("BodyPartAverage", () => {
  test("calculate - no measurements", () => {
    const average = new Measurements.Services.BodyPartAverage([], from, to);

    expect(average.calculate()).toEqual(null);
  });

  test("calculate - one", () => {
    const average = new Measurements.Services.BodyPartAverage([mocks.bodyPartMeasurement], from, to);

    expect(average.calculate()).toEqual({ average: mocks.bodyPartMeasurementValue, count: 1 });
  });

  test("calculate - two", () => {
    const average = new Measurements.Services.BodyPartAverage(
      [mocks.bodyPartMeasurement, mocks.heavierBodyPartMeasurement],
      from,
      to,
    );

    expect(average.calculate()).toEqual({
      average: (mocks.bodyPartMeasurementValue + mocks.heavierBodyPartMeasurementValue) / 2,
      count: 2,
    });
  });

  test("calculate - rounds to whole millimeters", () => {
    const average = new Measurements.Services.BodyPartAverage(
      [
        mocks.bodyPartMeasurement,
        mocks.bodyPartMeasurement,
        { ...mocks.heavierBodyPartMeasurement, measuredOn: mocks.anotherBodyPartMeasuredOn },
      ],
      from,
      to,
    );

    expect(average.calculate()).toEqual({ average: 1040, count: 3 });
  });

  test("calculate - range is inclusive", () => {
    const average = new Measurements.Services.BodyPartAverage(
      [
        { ...mocks.bodyPartMeasurement, measuredOn: v.parse(Measurements.VO.BodyPartMeasuredOn, from) },
        { ...mocks.bodyPartMeasurement, measuredOn: v.parse(Measurements.VO.BodyPartMeasuredOn, to) },
      ],
      from,
      to,
    );

    expect(average.calculate()).toEqual({ average: mocks.bodyPartMeasurementValue, count: 2 });
  });

  test("calculate - outside the range", () => {
    const average = new Measurements.Services.BodyPartAverage(
      [
        mocks.bodyPartMeasurement,
        {
          ...mocks.bodyPartMeasurement,
          measuredOn: v.parse(Measurements.VO.BodyPartMeasuredOn, "2025-01-06"),
        },
        {
          ...mocks.bodyPartMeasurement,
          measuredOn: v.parse(Measurements.VO.BodyPartMeasuredOn, "2024-12-29"),
        },
      ],
      from,
      to,
    );

    expect(average.calculate()).toEqual({ average: mocks.bodyPartMeasurementValue, count: 1 });
  });
});
