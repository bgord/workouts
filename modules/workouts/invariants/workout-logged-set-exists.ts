import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutLoggedSetExistsError extends Error {}

type WorkoutLoggedSetExistsConfigType = {
  workoutExercise?: VO.WorkoutExercise;
  loggedSetId: VO.LoggedSetIdType;
};

class WorkoutLoggedSetExistsFactory extends bg.Invariant<WorkoutLoggedSetExistsConfigType> {
  passes(config: WorkoutLoggedSetExistsConfigType) {
    return Boolean(
      config.workoutExercise?.loggedSets.some((loggedSet) => loggedSet.id === config.loggedSetId),
    );
  }

  // Stryker disable next-line StringLiteral
  message = "workout.logged.set.exists";
  error = WorkoutLoggedSetExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const WorkoutLoggedSetExists = new WorkoutLoggedSetExistsFactory();
