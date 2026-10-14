import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

const from = v.parse(tools.DayIsoId, "2024-12-30");
const to = v.parse(tools.DayIsoId, "2025-01-05");

describe("DailyStepsAverage", () => {
  test("calculate - no entries", () => {
    const average = new Measurements.Services.DailyStepsAverage([], from, to);

    expect(average.calculate()).toEqual(null);
  });

  test("calculate - one", () => {
    const average = new Measurements.Services.DailyStepsAverage([mocks.dailySteps], from, to);

    expect(average.calculate()).toEqual({ average: mocks.stepsCount, count: tools.Int.positive(1) });
  });

  test("calculate - two", () => {
    const average = new Measurements.Services.DailyStepsAverage(
      [mocks.dailySteps, mocks.anotherDailySteps],
      from,
      to,
    );

    expect(average.calculate()).toEqual({
      average: v.parse(Measurements.VO.StepsCount, 7_000),
      count: tools.Int.positive(2),
    });
  });

  test("calculate - whole steps", () => {
    const another: Measurements.VO.DailySteps = {
      ...mocks.anotherDailySteps,
      count: v.parse(Measurements.VO.StepsCount, 6_001),
    };

    const average = new Measurements.Services.DailyStepsAverage([mocks.dailySteps, another], from, to);

    expect(average.calculate()?.average).toEqual(v.parse(Measurements.VO.StepsCount, 7_001));
  });

  test("calculate - outside the range", () => {
    const average = new Measurements.Services.DailyStepsAverage(
      [mocks.dailySteps, mocks.anotherDailySteps],
      v.parse(tools.DayIsoId, "2025-01-01"),
      v.parse(tools.DayIsoId, "2025-01-01"),
    );

    expect(average.calculate()).toEqual({ average: mocks.stepsCount, count: tools.Int.positive(1) });
  });
});
