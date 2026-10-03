import * as v from "valibot";

export const WorkoutPlanSectionNameError = { Type: "workout.plan.section.name.type" };

export const WorkoutPlanSectionName = v.pipe(
  v.string(WorkoutPlanSectionNameError.Type),
  // Stryker disable next-line StringLiteral
  v.brand("WorkoutPlanSectionName"),
);

export type WorkoutPlanSectionNameType = v.InferOutput<typeof WorkoutPlanSectionName>;
