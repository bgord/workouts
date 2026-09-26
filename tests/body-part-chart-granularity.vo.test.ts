import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("BodyPartChartGranularity", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.BodyPartChartGranularity, "weekly").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Measurements.VO.BodyPartChartGranularity, "monthly")).toThrow(
      "body.part.chart.granularity.invalid",
    );
  });
});
