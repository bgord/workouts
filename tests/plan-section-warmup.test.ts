import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Plans from "+plans";

describe("PlanSectionWarmup", () => {
  test("happy path", () => {
    expect(v.safeParse(Plans.VO.PlanSectionWarmup, "f".repeat(500)).success).toEqual(true);
    expect(v.safeParse(Plans.VO.PlanSectionWarmup, "5 min bike\nband pull-aparts 2x15").success).toEqual(
      true,
    );
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Plans.VO.PlanSectionWarmup, null)).toThrow("plan.section.warmup.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Plans.VO.PlanSectionWarmup, 2024)).toThrow("plan.section.warmup.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Plans.VO.PlanSectionWarmup, "")).toThrow("plan.section.warmup.invalid");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Plans.VO.PlanSectionWarmup, "f".repeat(501))).toThrow("plan.section.warmup.invalid");
  });
});
