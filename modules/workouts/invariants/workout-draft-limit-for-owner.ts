import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import { WorkoutDraftLimitForOwnerMax } from "+workouts/value-objects";

class WorkoutDraftLimitForOwnerError extends Error {}

type WorkoutDraftLimitForOwnerConfigType = { count: tools.IntegerNonNegativeType };

class WorkoutDraftLimitForOwnerFactory extends bg.Invariant<WorkoutDraftLimitForOwnerConfigType> {
  passes(config: WorkoutDraftLimitForOwnerConfigType) {
    return config.count < WorkoutDraftLimitForOwnerMax;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.draft.limit.for.owner";
  error = WorkoutDraftLimitForOwnerError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutDraftLimitForOwner = new WorkoutDraftLimitForOwnerFactory();
