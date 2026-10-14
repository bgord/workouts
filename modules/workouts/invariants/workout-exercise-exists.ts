import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutExerciseExistsError extends Error {}

type WorkoutExerciseExistsConfigType = { workoutExercise: Pick<VO.WorkoutExercise, "id"> | undefined };
type WorkoutExerciseExistsPassedConfigType = { workoutExercise: Pick<VO.WorkoutExercise, "id"> };

class WorkoutExerciseExistsFactory extends bg.Invariant<
  WorkoutExerciseExistsConfigType,
  WorkoutExerciseExistsPassedConfigType
> {
  passes(config: WorkoutExerciseExistsConfigType) {
    return config.workoutExercise !== undefined;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.exists";
  error = WorkoutExerciseExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExerciseExists = new WorkoutExerciseExistsFactory();
