import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

class WorkoutExerciseRirIsApplicableForRepsError extends Error {}

type WorkoutExerciseRirIsApplicableForRepsConfigType = Pick<VO.ExercisePrescriptionType, "reps" | "rir">;

class WorkoutExerciseRirIsApplicableForRepsFactory extends bg.Invariant<WorkoutExerciseRirIsApplicableForRepsConfigType> {
  passes(config: WorkoutExerciseRirIsApplicableForRepsConfigType) {
    if (config.rir === undefined) return true;
    return Plans.VO.RirTargetRepsApplicability[Plans.VO.RepsScheme.of(config.reps)];
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.rir.is.applicable.for.reps";
  error = WorkoutExerciseRirIsApplicableForRepsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExerciseRirIsApplicableForReps = new WorkoutExerciseRirIsApplicableForRepsFactory();
