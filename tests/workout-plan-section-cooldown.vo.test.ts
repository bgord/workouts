import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";

describe("WorkoutPlanSectionCooldown", () => {
  test("happy path", () => {
    expect(v.safeParse(Workouts.VO.WorkoutPlanSectionCooldown, "Bench Press").success).toEqual(true);
  });

  test("rejects non-string", () => {
    expect(() => v.parse(Workouts.VO.WorkoutPlanSectionCooldown, null)).toThrow(
      "workout.plan.section.cooldown.type",
    );
  });
});
