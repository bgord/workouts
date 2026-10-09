import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

class WorkoutExerciseProgressionIsApplicableError extends Error {}

type WorkoutExerciseProgressionIsApplicableConfigType = {
  resistance: VO.WorkoutExerciseResistanceType;
  progression: Plans.VO.ProgressionMethodType;
};

class WorkoutExerciseProgressionIsApplicableFactory extends bg.Invariant<WorkoutExerciseProgressionIsApplicableConfigType> {
  passes(config: WorkoutExerciseProgressionIsApplicableConfigType) {
    return Plans.VO.ProgressionMethodApplicability.isApplicable(config.resistance, config.progression);
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.progression.is.applicable";
  error = WorkoutExerciseProgressionIsApplicableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExerciseProgressionIsApplicable = new WorkoutExerciseProgressionIsApplicableFactory();
