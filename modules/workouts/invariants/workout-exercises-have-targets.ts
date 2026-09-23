import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutExercisesHaveTargetsError extends Error {}

type WorkoutExercisesHaveTargetsConfigType = {
  workoutExercises: Array<{ target?: VO.ExerciseTargetType | null }>;
};

class WorkoutExercisesHaveTargetsFactory extends bg.Invariant<WorkoutExercisesHaveTargetsConfigType> {
  passes(config: WorkoutExercisesHaveTargetsConfigType) {
    return config.workoutExercises.every((exercise) => Boolean(exercise.target));
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercises.have.targets";
  error = WorkoutExercisesHaveTargetsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExercisesHaveTargets = new WorkoutExercisesHaveTargetsFactory();
