import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as VO from "+workouts/value-objects";

class WorkoutRetainsLoggedSetsError extends Error {}

type WorkoutRetainsLoggedSetsConfigType = {
  status: VO.WorkoutStatusEnum;
  count: tools.IntegerNonNegativeType;
};

class WorkoutRetainsLoggedSetsFactory extends bg.Invariant<WorkoutRetainsLoggedSetsConfigType> {
  passes(config: WorkoutRetainsLoggedSetsConfigType) {
    return config.status !== VO.WorkoutStatusEnum.completed || config.count > 1;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.retains.logged.sets";
  error = WorkoutRetainsLoggedSetsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutRetainsLoggedSets = new WorkoutRetainsLoggedSetsFactory();
