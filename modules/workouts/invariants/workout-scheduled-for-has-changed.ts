import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutScheduledForHasChangedError extends Error {}

type WorkoutScheduledForHasChangedConfigType = {
  current: VO.WorkoutScheduledForType | undefined;
  incoming: VO.WorkoutScheduledForType;
};

class WorkoutScheduledForHasChangedFactory extends bg.Invariant<WorkoutScheduledForHasChangedConfigType> {
  passes(config: WorkoutScheduledForHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.scheduled.for.has.changed";
  error = WorkoutScheduledForHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutScheduledForHasChanged = new WorkoutScheduledForHasChangedFactory();
