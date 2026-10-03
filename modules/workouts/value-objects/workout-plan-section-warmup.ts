import * as v from "valibot";

export const WorkoutPlanSectionWarmupError = { Type: "workout.plan.section.warmup.type" };

export const WorkoutPlanSectionWarmup = v.pipe(
  v.string(WorkoutPlanSectionWarmupError.Type),
  // Stryker disable next-line StringLiteral
  v.brand("WorkoutPlanSectionWarmup"),
);

export type WorkoutPlanSectionWarmupType = v.InferOutput<typeof WorkoutPlanSectionWarmup>;
