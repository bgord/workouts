import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutExerciseTargetHasChangedError extends Error {}

type WorkoutExerciseTargetHasChangedConfigType = {
  current: VO.ExerciseTargetType | undefined;
  incoming: VO.ExerciseTargetType;
};

class WorkoutExerciseTargetHasChangedFactory extends bg.Invariant<WorkoutExerciseTargetHasChangedConfigType> {
  passes(config: WorkoutExerciseTargetHasChangedConfigType) {
    return (
      config.current?.sets !== config.incoming.sets ||
      config.current.reps !== config.incoming.reps ||
      config.current.load !== config.incoming.load
    );
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.target.has.changed";
  error = WorkoutExerciseTargetHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExerciseTargetHasChanged = new WorkoutExerciseTargetHasChangedFactory();
