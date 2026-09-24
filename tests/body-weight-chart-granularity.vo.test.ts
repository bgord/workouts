import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("BodyWeightChartGranularity", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.BodyWeightChartGranularity, "weekly").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Measurements.VO.BodyWeightChartGranularity, "monthly")).toThrow(
      "body.weight.chart.granularity.invalid",
    );
  });
});
