import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("DailyStepsChart", () => {
  test("points - no entries", () => {
    const chart = new Measurements.Services.DailyStepsChart([]);

    expect(chart.points(Measurements.VO.StepsChartGranularityOptions.weekly)).toEqual([]);
  });

  test("points - daily", () => {
    const chart = new Measurements.Services.DailyStepsChart([mocks.dailySteps, mocks.anotherDailySteps]);

    expect(chart.points(Measurements.VO.StepsChartGranularityOptions.daily)).toEqual([
      {
        from: mocks.anotherStepsDay,
        to: mocks.anotherStepsDay,
        steps: mocks.anotherStepsCount,
        count: tools.Int.positive(1),
      },
      { from: mocks.stepsDay, to: mocks.stepsDay, steps: mocks.stepsCount, count: tools.Int.positive(1) },
    ]);
  });

  test("points - weekly", () => {
    const chart = new Measurements.Services.DailyStepsChart([mocks.dailySteps, mocks.anotherDailySteps]);

    expect(chart.points(Measurements.VO.StepsChartGranularityOptions.weekly)).toEqual([
      {
        from: mocks.anotherStepsDay,
        to: mocks.stepsDay,
        steps: v.parse(Measurements.VO.StepsCount, 7_000),
        count: tools.Int.positive(2),
      },
    ]);
  });

  test("points - weekly - skips empty weeks", () => {
    const later: Measurements.VO.DailySteps = {
      ...mocks.dailySteps,
      day: v.parse(Measurements.VO.StepsDay, "2025-01-13"),
    };

    const chart = new Measurements.Services.DailyStepsChart([later, mocks.dailySteps]);

    expect(chart.points(Measurements.VO.StepsChartGranularityOptions.weekly)).toEqual([
      { from: mocks.stepsDay, to: mocks.stepsDay, steps: mocks.stepsCount, count: tools.Int.positive(1) },
      { from: later.day, to: later.day, steps: mocks.stepsCount, count: tools.Int.positive(1) },
    ]);
  });
});
