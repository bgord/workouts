import * as bg from "@bgord/bun";
import * as Exercises from "+exercises";
import type * as VO from "+workouts/value-objects";

class WorkoutExerciseLoadIsApplicableError extends Error {}

type WorkoutExerciseLoadIsApplicableConfigType = {
  loading: VO.WorkoutExerciseLoadingType;
  load: VO.LoadType;
};

const accepts = {
  [Exercises.VO.ExerciseLoadingOptions.external]: () => true,
  [Exercises.VO.ExerciseLoadingOptions.none]: (load: VO.LoadType) => load === 0,
} satisfies Record<Exercises.VO.ExerciseLoadingOptions, (load: VO.LoadType) => boolean>;

class WorkoutExerciseLoadIsApplicableFactory extends bg.Invariant<WorkoutExerciseLoadIsApplicableConfigType> {
  passes(config: WorkoutExerciseLoadIsApplicableConfigType) {
    return accepts[config.loading](config.load);
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.load.is.applicable";
  error = WorkoutExerciseLoadIsApplicableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExerciseLoadIsApplicable = new WorkoutExerciseLoadIsApplicableFactory();
