import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class WorkoutDraftLimitForOwnerError extends Error {}

type WorkoutDraftLimitForOwnerConfigType = { count: tools.IntegerNonNegativeType };

class WorkoutDraftLimitForOwnerFactory extends bg.Invariant<WorkoutDraftLimitForOwnerConfigType> {
  passes(config: WorkoutDraftLimitForOwnerConfigType) {
    return config.count < 3;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.draft.limit.for.owner";
  error = WorkoutDraftLimitForOwnerError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutDraftLimitForOwner = new WorkoutDraftLimitForOwnerFactory();
