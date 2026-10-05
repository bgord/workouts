import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";

describe("WorkoutPlanSectionWarmup", () => {
  test("happy path", () => {
    expect(v.safeParse(Workouts.VO.WorkoutPlanSectionWarmup, "Bench Press").success).toEqual(true);
  });

  test("rejects non-string", () => {
    expect(() => v.parse(Workouts.VO.WorkoutPlanSectionWarmup, null)).toThrow(
      "workout.plan.section.warmup.type",
    );
  });
});
