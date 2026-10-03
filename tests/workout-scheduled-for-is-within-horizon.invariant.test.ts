import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutScheduledForIsWithinHorizon", () => {
  test("passes - at the earliest boundary", () => {
    const config = { scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, "2024-01-02"), now: mocks.T0 };

    expect(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.passes(config)).toEqual(true);
  });

  test("passes - at the latest boundary", () => {
    const config = { scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, "2026-01-01"), now: mocks.T0 };

    expect(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.passes(config)).toEqual(true);
  });

  test("fails - before the earliest boundary", () => {
    const config = { scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, "2024-01-01"), now: mocks.T0 };

    expect(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.passes(config)).toEqual(false);
  });

  test("fails - after the latest boundary", () => {
    const config = { scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, "2026-01-02"), now: mocks.T0 };

    expect(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.passes(config)).toEqual(false);
  });

  test("enforce - throws", () => {
    const config = { scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, "2026-01-02"), now: mocks.T0 };

    expect(() => Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.enforce(config)).toThrow(
      Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.error,
    );
  });
});
