import * as bg from "@bgord/bun";
import type * as Plans from "+plans";

class WorkoutPlanSectionReadyError extends Error {}

type WorkoutPlanSectionReadyConfigType = { section: Pick<Plans.VO.PlanSectionSnapshot, "id"> | undefined };
type WorkoutPlanSectionReadyPassedConfigType = { section: Pick<Plans.VO.PlanSectionSnapshot, "id"> };

class WorkoutPlanSectionReadyFactory extends bg.Invariant<
  WorkoutPlanSectionReadyConfigType,
  WorkoutPlanSectionReadyPassedConfigType
> {
  passes(config: WorkoutPlanSectionReadyConfigType) {
    return config.section !== undefined;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.plan.section.ready";
  error = WorkoutPlanSectionReadyError;
  kind = bg.InvariantFailureKind.not_found;
}

export const WorkoutPlanSectionReady = new WorkoutPlanSectionReadyFactory();
