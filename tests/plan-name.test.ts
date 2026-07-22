import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Plans from "+plans";

describe("PlanName", () => {
  test("happy path", () => {
    expect(v.safeParse(Plans.VO.PlanName, "f".repeat(64)).success).toEqual(true);
    expect(v.safeParse(Plans.VO.PlanName, "Bench Press").success).toEqual(true);
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Plans.VO.PlanName, null)).toThrow("plan.name.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Plans.VO.PlanName, 2024)).toThrow("plan.name.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Plans.VO.PlanName, "")).toThrow("plan.name.invalid");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Plans.VO.PlanName, "f".repeat(65))).toThrow("plan.name.invalid");
  });

  test("rejects too short", () => {
    expect(() => v.parse(Plans.VO.PlanName, "f".repeat(2))).toThrow("plan.name.invalid");
  });
});
