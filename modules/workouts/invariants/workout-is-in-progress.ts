import * as bg from "@bgord/bun";
import * as VO from "+workouts/value-objects";

class WorkoutIsInProgressError extends Error {}

type WorkoutIsInProgressConfigType = { status: VO.WorkoutStatusEnum };

class WorkoutIsInProgressFactory extends bg.Invariant<WorkoutIsInProgressConfigType> {
  passes(config: WorkoutIsInProgressConfigType) {
    return config.status === VO.WorkoutStatusEnum.in_progress;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.is.in.progress";
  error = WorkoutIsInProgressError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutIsInProgress = new WorkoutIsInProgressFactory();
