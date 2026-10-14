import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutLoggedSetExistsError extends Error {}

type WorkoutLoggedSetExistsConfigType = { loggedSet: Pick<VO.LoggedSetType, "id"> | undefined };
type WorkoutLoggedSetExistsPassedConfigType = { loggedSet: Pick<VO.LoggedSetType, "id"> };

class WorkoutLoggedSetExistsFactory extends bg.Invariant<
  WorkoutLoggedSetExistsConfigType,
  WorkoutLoggedSetExistsPassedConfigType
> {
  passes(config: WorkoutLoggedSetExistsConfigType) {
    return config.loggedSet !== undefined;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.logged.set.exists";
  error = WorkoutLoggedSetExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutLoggedSetExists = new WorkoutLoggedSetExistsFactory();
