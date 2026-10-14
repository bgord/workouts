import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("DailyStepsChartGranularity", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.DailyStepsChartGranularity, "weekly").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Measurements.VO.DailyStepsChartGranularity, "monthly")).toThrow(
      "daily.steps.chart.granularity.invalid",
    );
  });
});
