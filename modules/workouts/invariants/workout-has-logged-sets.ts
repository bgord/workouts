import * as bg from "@bgord/bun";

class WorkoutHasLoggedSetsError extends Error {}

type WorkoutHasLoggedSetsConfigType = { workoutExercises: Array<{ loggedSets: ReadonlyArray<unknown> }> };

class WorkoutHasLoggedSetsFactory extends bg.Invariant<WorkoutHasLoggedSetsConfigType> {
  passes(config: WorkoutHasLoggedSetsConfigType) {
    return config.workoutExercises.some((exercise) => exercise.loggedSets.length > 0);
  }

  // Stryker disable next-line StringLiteral
  message = "workout.has.logged.sets";
  error = WorkoutHasLoggedSetsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutHasLoggedSets = new WorkoutHasLoggedSetsFactory();
