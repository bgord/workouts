import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Plans from "+plans";

describe("PlanSectionCooldown", () => {
  test("happy path", () => {
    expect(v.safeParse(Plans.VO.PlanSectionCooldown, "f".repeat(500)).success).toEqual(true);
    expect(v.safeParse(Plans.VO.PlanSectionCooldown, "5 min bike\nband pull-apart 2x15").success).toEqual(
      true,
    );
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Plans.VO.PlanSectionCooldown, null)).toThrow("plan.section.cooldown.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Plans.VO.PlanSectionCooldown, 2024)).toThrow("plan.section.cooldown.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Plans.VO.PlanSectionCooldown, "")).toThrow("plan.section.cooldown.invalid");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Plans.VO.PlanSectionCooldown, "f".repeat(501))).toThrow(
      "plan.section.cooldown.invalid",
    );
  });
});
