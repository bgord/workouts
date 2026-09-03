import * as bg from "@bgord/bun";
import type * as Plans from "+plans";

class WorkoutPlanReadyError extends Error {}

type WorkoutPlanReadyConfigType = { plan: Plans.VO.Plan | null };

class WorkoutPlanReadyFactory extends bg.Invariant<WorkoutPlanReadyConfigType> {
  passes(config: WorkoutPlanReadyConfigType) {
    return config.plan !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.plan.ready";
  error = WorkoutPlanReadyError;
  kind = bg.InvariantFailureKind.not_found;
}

export const WorkoutPlanReady = new WorkoutPlanReadyFactory();
