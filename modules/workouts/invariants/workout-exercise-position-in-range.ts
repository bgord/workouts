import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutExercisePositionInRangeError extends Error {}

type WorkoutExercisePositionInRangeConfigType = {
  workoutExercises: Array<VO.WorkoutExercise>;
  position: VO.WorkoutExercisePositionType;
};

class WorkoutExercisePositionInRangeFactory extends bg.Invariant<WorkoutExercisePositionInRangeConfigType> {
  passes(config: WorkoutExercisePositionInRangeConfigType) {
    return config.position < config.workoutExercises.length;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.position.in.range";
  error = WorkoutExercisePositionInRangeError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExercisePositionInRange = new WorkoutExercisePositionInRangeFactory();
