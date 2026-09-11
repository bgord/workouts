import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Plans from "+plans";

describe("PlanDescription", () => {
  test("happy path", () => {
    expect(v.safeParse(Plans.VO.PlanDescription, "f".repeat(500)).success).toEqual(true);
    expect(
      v.safeParse(Plans.VO.PlanDescription, "Push/pull/legs\n3x a week, deload every 4th week.").success,
    ).toEqual(true);
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Plans.VO.PlanDescription, null)).toThrow("plan.description.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Plans.VO.PlanDescription, 2024)).toThrow("plan.description.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Plans.VO.PlanDescription, "")).toThrow("plan.description.invalid");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Plans.VO.PlanDescription, "f".repeat(501))).toThrow("plan.description.invalid");
  });
});
