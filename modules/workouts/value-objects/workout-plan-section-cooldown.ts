import * as v from "valibot";

export const WorkoutPlanSectionCooldownError = { Type: "workout.plan.section.cooldown.type" };

export const WorkoutPlanSectionCooldown = v.pipe(
  v.string(WorkoutPlanSectionCooldownError.Type),
  // Stryker disable next-line StringLiteral
  v.brand("WorkoutPlanSectionCooldown"),
);

export type WorkoutPlanSectionCooldownType = v.InferOutput<typeof WorkoutPlanSectionCooldown>;
