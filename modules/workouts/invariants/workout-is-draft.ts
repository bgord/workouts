import * as bg from "@bgord/bun";
import * as VO from "+workouts/value-objects";

class WorkoutIsDraftError extends Error {}

type WorkoutIsDraftConfigType = { status: VO.WorkoutStatusEnum };

class WorkoutIsDraftFactory extends bg.Invariant<WorkoutIsDraftConfigType> {
  passes(config: WorkoutIsDraftConfigType) {
    return config.status === VO.WorkoutStatusEnum.draft;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.is.draft";
  error = WorkoutIsDraftError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutIsDraft = new WorkoutIsDraftFactory();
