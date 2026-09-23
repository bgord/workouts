import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";

const earliest = v.parse(tools.DayIsoId, "2025-01-01");
const latest = v.parse(tools.DayIsoId, "2025-01-08");

describe("WorkoutScheduledForIsWithinHorizon", () => {
  test("passes - at the earliest boundary", () => {
    const config = { scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, "2025-01-01"), earliest, latest };

    expect(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.passes(config)).toEqual(true);
  });

  test("passes - at the latest boundary", () => {
    const config = { scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, "2025-01-08"), earliest, latest };

    expect(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.passes(config)).toEqual(true);
  });

  test("fails - before the earliest boundary", () => {
    const config = { scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, "2024-12-31"), earliest, latest };

    expect(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.passes(config)).toEqual(false);
  });

  test("fails - after the latest boundary", () => {
    const config = { scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, "2025-01-09"), earliest, latest };

    expect(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.passes(config)).toEqual(false);
  });

  test("enforce - throws", () => {
    const config = { scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, "2025-01-09"), earliest, latest };

    expect(() => Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.enforce(config)).toThrow(
      Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.error,
    );
  });
});
