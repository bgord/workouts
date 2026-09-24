import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("BodyWeightHistoryMonth", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.BodyWeightHistoryMonth, "2026-09").success).toEqual(true);
  });

  test("happy path - all", () => {
    expect(v.safeParse(Measurements.VO.BodyWeightHistoryMonth, "all").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Measurements.VO.BodyWeightHistoryMonth, "2026-13")).toThrow(
      "body.weight.history.month.invalid",
    );
  });
});
