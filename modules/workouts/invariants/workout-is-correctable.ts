import * as bg from "@bgord/bun";
import * as VO from "+workouts/value-objects";

class WorkoutIsCorrectableError extends Error {}

type WorkoutIsCorrectableConfigType = { status: VO.WorkoutStatusEnum };

class WorkoutIsCorrectableFactory extends bg.Invariant<WorkoutIsCorrectableConfigType> {
  passes(config: WorkoutIsCorrectableConfigType) {
    return [VO.WorkoutStatusEnum.in_progress, VO.WorkoutStatusEnum.completed].includes(config.status);
  }

  // Stryker disable next-line StringLiteral
  message = "workout.is.correctable";
  error = WorkoutIsCorrectableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutIsCorrectable = new WorkoutIsCorrectableFactory();
