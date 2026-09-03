import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutExerciseExistsError extends Error {}

type WorkoutExerciseExistsConfigType = {
  workoutExerciseId: VO.WorkoutExerciseIdType;
  workoutExercises: Array<VO.WorkoutExercise>;
};

class WorkoutExerciseExistsFactory extends bg.Invariant<WorkoutExerciseExistsConfigType> {
  passes(config: WorkoutExerciseExistsConfigType) {
    return config.workoutExercises.some((exercise) => exercise.id === config.workoutExerciseId);
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.exists";
  error = WorkoutExerciseExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExerciseExists = new WorkoutExerciseExistsFactory();
