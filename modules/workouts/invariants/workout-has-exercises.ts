import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutHasExercisesError extends Error {}

type WorkoutHasExercisesConfigType = { workoutExercises: Array<VO.WorkoutExercise> };

class WorkoutHasExercisesFactory extends bg.Invariant<WorkoutHasExercisesConfigType> {
  passes(config: WorkoutHasExercisesConfigType) {
    return config.workoutExercises.length > 0;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.has.exercises";
  error = WorkoutHasExercisesError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutHasExercises = new WorkoutHasExercisesFactory();
