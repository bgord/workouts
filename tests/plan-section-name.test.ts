import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Plans from "+plans";

describe("PlanSectionName", () => {
  test("happy path", () => {
    expect(v.safeParse(Plans.VO.PlanSectionName, "f".repeat(64)).success).toEqual(true);
    expect(v.safeParse(Plans.VO.PlanSectionName, "Bench Press").success).toEqual(true);
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Plans.VO.PlanSectionName, null)).toThrow("plan.section.name.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Plans.VO.PlanSectionName, 2024)).toThrow("plan.section.name.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Plans.VO.PlanSectionName, "")).toThrow("plan.section.name.invalid");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Plans.VO.PlanSectionName, "f".repeat(65))).toThrow("plan.section.name.invalid");
  });

  test("rejects too short", () => {
    expect(() => v.parse(Plans.VO.PlanSectionName, "f".repeat(2))).toThrow("plan.section.name.invalid");
  });
});
