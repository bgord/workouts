import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("BodyPartHistoryMonth", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.BodyPartHistoryMonth, "2026-09").success).toEqual(true);
  });

  test("happy path - all", () => {
    expect(v.safeParse(Measurements.VO.BodyPartHistoryMonth, "all").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Measurements.VO.BodyPartHistoryMonth, "2026-13")).toThrow(
      "body.part.history.month.invalid",
    );
  });
});
