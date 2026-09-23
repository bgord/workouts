import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutExercisePositionHasChangedError extends Error {}

type WorkoutExercisePositionHasChangedConfigType = {
  workoutExerciseId: VO.WorkoutExerciseIdType;
  workoutExercises: Array<Pick<VO.WorkoutExercise, "id">>;
  position: VO.WorkoutExercisePositionType;
};

class WorkoutExercisePositionHasChangedFactory extends bg.Invariant<WorkoutExercisePositionHasChangedConfigType> {
  passes(config: WorkoutExercisePositionHasChangedConfigType) {
    const current = config.workoutExercises.findIndex((exercise) => exercise.id === config.workoutExerciseId);

    return current !== config.position;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.position.has.changed";
  error = WorkoutExercisePositionHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExercisePositionHasChanged = new WorkoutExercisePositionHasChangedFactory();
