import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutExerciseHasNoLoggedSetsError extends Error {}

type WorkoutExerciseHasNoLoggedSetsConfigType = { loggedSets: ReadonlyArray<Pick<VO.LoggedSetType, "id">> };

class WorkoutExerciseHasNoLoggedSetsFactory extends bg.Invariant<WorkoutExerciseHasNoLoggedSetsConfigType> {
  passes(config: WorkoutExerciseHasNoLoggedSetsConfigType) {
    return config.loggedSets.length === 0;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.exercise.has.no.logged.sets";
  error = WorkoutExerciseHasNoLoggedSetsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutExerciseHasNoLoggedSets = new WorkoutExerciseHasNoLoggedSetsFactory();
