/* cSpell:disable */
import * as bg from "@bgord/bun";
import * as VO from "+workouts/value-objects";

class WorkoutIsDiscardableError extends Error {}

type WorkoutIsDiscardableConfigType = { status: VO.WorkoutStatusEnum };

class WorkoutIsDiscardableFactory extends bg.Invariant<WorkoutIsDiscardableConfigType> {
  passes(config: WorkoutIsDiscardableConfigType) {
    return config.status === VO.WorkoutStatusEnum.draft;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.is.discardable";
  error = WorkoutIsDiscardableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutIsDiscardable = new WorkoutIsDiscardableFactory();
