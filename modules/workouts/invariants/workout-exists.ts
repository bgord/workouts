import * as bg from "@bgord/bun";
import * as VO from "+workouts/value-objects";

class WorkoutExistsError extends Error {}

type WorkoutExistsConfigType = { status: VO.WorkoutStatusEnum };

class WorkoutExistsFactory extends bg.Invariant<WorkoutExistsConfigType> {
  passes(config: WorkoutExistsConfigType) {
    return ![VO.WorkoutStatusEnum.initial, VO.WorkoutStatusEnum.discarded].includes(config.status);
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exists";
  error = WorkoutExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const WorkoutExists = new WorkoutExistsFactory();
