import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";

describe("WorkoutPlanName", () => {
  test("happy path", () => {
    expect(v.safeParse(Workouts.VO.WorkoutPlanName, "Bench Press").success).toEqual(true);
  });

  test("rejects non-string", () => {
    expect(() => v.parse(Workouts.VO.WorkoutPlanName, null)).toThrow("workout.plan.name.type");
  });
});
