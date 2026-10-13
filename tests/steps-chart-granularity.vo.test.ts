import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("StepsChartGranularity", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.StepsChartGranularity, "weekly").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Measurements.VO.StepsChartGranularity, "monthly")).toThrow(
      "steps.chart.granularity.invalid",
    );
  });
});
