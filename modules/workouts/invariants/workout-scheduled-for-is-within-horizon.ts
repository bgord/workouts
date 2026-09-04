import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as VO from "+workouts/value-objects";

class WorkoutScheduledForIsWithinHorizonError extends Error {}

type WorkoutScheduledForIsWithinHorizonConfigType = {
  scheduledFor: VO.WorkoutScheduledForType;
  horizon: tools.DayIsoIdType;
};

class WorkoutScheduledForIsWithinHorizonFactory extends bg.Invariant<WorkoutScheduledForIsWithinHorizonConfigType> {
  passes(config: WorkoutScheduledForIsWithinHorizonConfigType) {
    return config.scheduledFor <= config.horizon;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.scheduled.for.is.within.horizon";
  error = WorkoutScheduledForIsWithinHorizonError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutScheduledForIsWithinHorizon = new WorkoutScheduledForIsWithinHorizonFactory();
