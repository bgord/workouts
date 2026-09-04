import * as bg from "@bgord/bun";
import type * as Plans from "+plans";

class WorkoutPlanSectionReadyError extends Error {}

type WorkoutPlanSectionReadyConfigType = { section: Plans.VO.PlanSectionWithExercises | undefined };

class WorkoutPlanSectionReadyFactory extends bg.Invariant<WorkoutPlanSectionReadyConfigType> {
  passes(config: WorkoutPlanSectionReadyConfigType) {
    return config.section !== undefined;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.plan.section.ready";
  error = WorkoutPlanSectionReadyError;
  kind = bg.InvariantFailureKind.not_found;
}

export const WorkoutPlanSectionReady = new WorkoutPlanSectionReadyFactory();
