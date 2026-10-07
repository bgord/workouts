import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

class WorkoutExerciseProgressionIsApplicableForRepsError extends Error {}

type WorkoutExerciseProgressionIsApplicableForRepsConfigType = Pick<
  VO.ExercisePrescriptionType,
  "reps" | "progression"
>;

class WorkoutExerciseProgressionIsApplicableForRepsFactory extends bg.Invariant<WorkoutExerciseProgressionIsApplicableForRepsConfigType> {
  passes(config: WorkoutExerciseProgressionIsApplicableForRepsConfigType) {
    return Plans.VO.ProgressionMethodRepsApplicability[Plans.VO.RepsScheme.of(config.reps)].includes(
      config.progression,
    );
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.progression.is.applicable.for.reps";
  error = WorkoutExerciseProgressionIsApplicableForRepsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExerciseProgressionIsApplicableForReps =
  new WorkoutExerciseProgressionIsApplicableForRepsFactory();
