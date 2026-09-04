import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";

class WorkoutCatalogExerciseExistsError extends Error {}

type WorkoutCatalogExerciseExistsConfigType = { exercise: Exercises.VO.Exercise | null };

class WorkoutCatalogExerciseExistsFactory extends bg.Invariant<WorkoutCatalogExerciseExistsConfigType> {
  passes(config: WorkoutCatalogExerciseExistsConfigType) {
    return config.exercise !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.catalog.exercise.exists";
  error = WorkoutCatalogExerciseExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutCatalogExerciseExists = new WorkoutCatalogExerciseExistsFactory();
