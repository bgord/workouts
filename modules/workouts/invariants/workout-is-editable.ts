import * as bg from "@bgord/bun";
import * as VO from "+workouts/value-objects";

class WorkoutIsEditableError extends Error {}

type WorkoutIsEditableConfigType = { status: VO.WorkoutStatusEnum };

class WorkoutIsEditableFactory extends bg.Invariant<WorkoutIsEditableConfigType> {
  passes(config: WorkoutIsEditableConfigType) {
    return [VO.WorkoutStatusEnum.draft, VO.WorkoutStatusEnum.in_progress].includes(config.status);
  }

  // Stryker disable next-line StringLiteral
  message = "workout.is.editable";
  error = WorkoutIsEditableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutIsEditable = new WorkoutIsEditableFactory();
