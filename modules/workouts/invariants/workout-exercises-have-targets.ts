import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutExercisesHaveTargetsError extends Error {}

type WorkoutExercisesHaveTargetsConfigType = { workoutExercises: Array<VO.WorkoutExercise> };

class WorkoutExercisesHaveTargetsFactory extends bg.Invariant<WorkoutExercisesHaveTargetsConfigType> {
  passes(config: WorkoutExercisesHaveTargetsConfigType) {
    return config.workoutExercises.every((exercise) => exercise.target !== undefined);
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercises.have.targets";
  error = WorkoutExercisesHaveTargetsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExercisesHaveTargets = new WorkoutExercisesHaveTargetsFactory();
