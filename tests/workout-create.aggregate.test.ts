import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.create", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("WorkoutScheduledForIsWithinHorizon", async () => {
    expect(() =>
      Workouts.Aggregates.Workout.create(
        mocks.workoutId,
        mocks.planId,
        mocks.workoutPlanName,
        mocks.planSectionId,
        mocks.workoutPlanSectionName,
        mocks.workoutPlanSectionWarmup,
        mocks.workoutPlanSectionCooldown,
        v.parse(Workouts.VO.WorkoutScheduledFor, "2999-12-31"),
        mocks.userId,
        deps,
      ),
    ).toThrow(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.error);
  });

  test("WorkoutScheduledForIsWithinHorizon - past", async () => {
    expect(() =>
      Workouts.Aggregates.Workout.create(
        mocks.workoutId,
        mocks.planId,
        mocks.workoutPlanName,
        mocks.planSectionId,
        mocks.workoutPlanSectionName,
        mocks.workoutPlanSectionWarmup,
        mocks.workoutPlanSectionCooldown,
        v.parse(Workouts.VO.WorkoutScheduledFor, "2000-01-01"),
        mocks.userId,
        deps,
      ),
    ).toThrow(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.error);
  });

  test("happy path", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const workout = Workouts.Aggregates.Workout.create(
        mocks.workoutId,
        mocks.planId,
        mocks.workoutPlanName,
        mocks.planSectionId,
        mocks.workoutPlanSectionName,
        mocks.workoutPlanSectionWarmup,
        mocks.workoutPlanSectionCooldown,
        mocks.workoutScheduledFor,
        mocks.userId,
        deps,
      );

      expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutCreatedEvent]);
    });
  });
});
