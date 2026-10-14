import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("DailyStepsStatsCalculator", () => {
  test("happy path", () => {
    const calculator = new Measurements.Services.DailyStepsStatsCalculator([mocks.dailySteps]);

    expect(calculator.calculate()).toEqual(mocks.dailyStepsStats);
  });

  test("happy path - rolling windows", () => {
    const latest: Measurements.VO.DailySteps = {
      ...mocks.dailySteps,
      day: v.parse(Measurements.VO.DailyStepsDay, "2025-01-31"),
      count: v.parse(Measurements.VO.StepsCount, 10_000),
    };
    const weekEdge: Measurements.VO.DailySteps = {
      ...mocks.dailySteps,
      day: v.parse(Measurements.VO.DailyStepsDay, "2025-01-25"),
      count: v.parse(Measurements.VO.StepsCount, 6_000),
    };
    const outsideWeek: Measurements.VO.DailySteps = {
      ...mocks.dailySteps,
      day: v.parse(Measurements.VO.DailyStepsDay, "2025-01-24"),
      count: v.parse(Measurements.VO.StepsCount, 4_000),
    };
    const monthEdge: Measurements.VO.DailySteps = {
      ...mocks.dailySteps,
      day: v.parse(Measurements.VO.DailyStepsDay, "2025-01-02"),
      count: v.parse(Measurements.VO.StepsCount, 2_003),
    };
    const outsideMonth: Measurements.VO.DailySteps = {
      ...mocks.dailySteps,
      day: v.parse(Measurements.VO.DailyStepsDay, "2025-01-01"),
      count: v.parse(Measurements.VO.StepsCount, 1_000),
    };

    const calculator = new Measurements.Services.DailyStepsStatsCalculator([
      latest,
      weekEdge,
      outsideWeek,
      monthEdge,
      outsideMonth,
    ]);

    expect(calculator.calculate()).toEqual({
      latest,
      previous: weekEdge,
      week: { average: v.parse(Measurements.VO.StepsCount, 8_000), count: tools.Int.positive(2) },
      previousWeek: { average: v.parse(Measurements.VO.StepsCount, 4_000) },
      month: { average: v.parse(Measurements.VO.StepsCount, 5_501), count: tools.Int.positive(4) },
      previousMonth: { average: v.parse(Measurements.VO.StepsCount, 1_000) },
    });
  });

  test("no entries", () => {
    const calculator = new Measurements.Services.DailyStepsStatsCalculator([]);

    expect(calculator.calculate()).toEqual(null);
  });
});
