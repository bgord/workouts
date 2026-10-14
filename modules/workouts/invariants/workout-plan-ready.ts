import * as bg from "@bgord/bun";
import type * as Plans from "+plans";

class WorkoutPlanReadyError extends Error {}

type WorkoutPlanReadyConfigType = { plan: Pick<Plans.VO.PlanSummary, "id"> | null };
type WorkoutPlanReadyPassedConfigType = { plan: Pick<Plans.VO.PlanSummary, "id"> };

class WorkoutPlanReadyFactory extends bg.Invariant<
  WorkoutPlanReadyConfigType,
  WorkoutPlanReadyPassedConfigType
> {
  passes(config: WorkoutPlanReadyConfigType) {
    return config.plan !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.plan.ready";
  error = WorkoutPlanReadyError;
  kind = bg.InvariantFailureKind.not_found;
}

export const WorkoutPlanReady = new WorkoutPlanReadyFactory();
