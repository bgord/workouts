import * as bg from "@bgord/bun";
import type * as Auth from "+auth";

class PlanBelongsToUserError extends Error {}

type PlanBelongsToUserConfigType = {
  userId: Auth.VO.UserIdType | undefined;
  requesterId: Auth.VO.UserIdType;
};

class PlanBelongsToUserFactory extends bg.Invariant<PlanBelongsToUserConfigType> {
  passes(config: PlanBelongsToUserConfigType) {
    return config.userId === config.requesterId;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.belongs.to.user";
  error = PlanBelongsToUserError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanBelongsToUser = new PlanBelongsToUserFactory();
