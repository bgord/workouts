import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class WorkoutInProgressLimitForOwnerError extends Error {}

type WorkoutInProgressLimitForOwnerConfigType = { count: tools.IntegerNonNegativeType };

class WorkoutInProgressLimitForOwnerFactory extends bg.Invariant<WorkoutInProgressLimitForOwnerConfigType> {
  // One workout at a time - you cannot be in the gym twice
  passes(config: WorkoutInProgressLimitForOwnerConfigType) {
    return config.count < 1;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.in.progress.limit.for.owner";
  error = WorkoutInProgressLimitForOwnerError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutInProgressLimitForOwner = new WorkoutInProgressLimitForOwnerFactory();
