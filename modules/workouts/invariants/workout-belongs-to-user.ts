import * as bg from "@bgord/bun";
import type * as Auth from "+auth";

class WorkoutBelongsToUserError extends Error {}

type WorkoutBelongsToUserConfigType = {
  userId: Auth.VO.UserIdType | undefined;
  requesterId: Auth.VO.UserIdType;
};

class WorkoutBelongsToUserFactory extends bg.Invariant<WorkoutBelongsToUserConfigType> {
  passes(config: WorkoutBelongsToUserConfigType) {
    return config.userId === config.requesterId;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.belongs.to.user";
  error = WorkoutBelongsToUserError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutBelongsToUser = new WorkoutBelongsToUserFactory();
