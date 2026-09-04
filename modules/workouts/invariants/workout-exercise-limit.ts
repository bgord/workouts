import * as bg from "@bgord/bun";
import * as VO from "+workouts/value-objects";

class WorkoutExerciseLimitError extends Error {}

type WorkoutExerciseLimitConfigType = { workoutExercises: Array<VO.WorkoutExercise> };

class WorkoutExerciseLimitFactory extends bg.Invariant<WorkoutExerciseLimitConfigType> {
  passes(config: WorkoutExerciseLimitConfigType) {
    return config.workoutExercises.length < VO.WorkoutExerciseLimitMax;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.limit";
  error = WorkoutExerciseLimitError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExerciseLimit = new WorkoutExerciseLimitFactory();
