import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartSummaries", () => {
  test("no measurements", () => {
    const summaries = new Measurements.Services.BodyPartSummaries({
      bodyParts: [mocks.bodyPart],
      measurements: [],
    });

    expect(summaries.calculate()).toEqual([
      { ...mocks.bodyPart, latest: null, previous: null, delta: null, series: [] },
    ]);
  });

  test("one measurement", () => {
    const summaries = new Measurements.Services.BodyPartSummaries({
      bodyParts: [mocks.bodyPart],
      measurements: [mocks.bodyPartRecentMeasurementLatest],
    });

    expect(summaries.calculate()).toEqual([
      {
        ...mocks.bodyPart,
        latest: {
          id: mocks.bodyPartMeasurementId,
          value: mocks.anotherBodyPartCircumference,
          measuredOn: mocks.bodyPartMeasuredOn,
        },
        previous: null,
        delta: null,
        series: [{ value: mocks.anotherBodyPartCircumference, measuredOn: mocks.bodyPartMeasuredOn }],
      },
    ]);
  });

  test("two measurements", () => {
    const summaries = new Measurements.Services.BodyPartSummaries({
      bodyParts: [mocks.bodyPart],
      measurements: [mocks.bodyPartRecentMeasurementLatest, mocks.bodyPartRecentMeasurementPrevious],
    });

    expect(summaries.calculate()).toEqual([
      {
        ...mocks.bodyPart,
        latest: {
          id: mocks.bodyPartMeasurementId,
          value: mocks.anotherBodyPartCircumference,
          measuredOn: mocks.bodyPartMeasuredOn,
        },
        previous: {
          id: mocks.anotherBodyPartMeasurementId,
          value: mocks.bodyPartCircumference,
          measuredOn: mocks.anotherBodyPartMeasuredOn,
        },
        delta: 10,
        series: [
          { value: mocks.bodyPartCircumference, measuredOn: mocks.anotherBodyPartMeasuredOn },
          { value: mocks.anotherBodyPartCircumference, measuredOn: mocks.bodyPartMeasuredOn },
        ],
      },
    ]);
  });

  test("another body part measurement", () => {
    const summaries = new Measurements.Services.BodyPartSummaries({
      bodyParts: [mocks.bodyPart],
      measurements: [mocks.anotherBodyPartRecentMeasurement],
    });

    expect(summaries.calculate()).toEqual([
      { ...mocks.bodyPart, latest: null, previous: null, delta: null, series: [] },
    ]);
  });
});
