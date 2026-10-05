import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";

describe("WorkoutPlanSectionName", () => {
  test("happy path", () => {
    expect(v.safeParse(Workouts.VO.WorkoutPlanSectionName, "Bench Press").success).toEqual(true);
  });

  test("rejects non-string", () => {
    expect(() => v.parse(Workouts.VO.WorkoutPlanSectionName, null)).toThrow("workout.plan.section.name.type");
  });
});
