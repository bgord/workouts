import * as v from "valibot";

export const WorkoutPlanNameError = { Type: "workout.plan.name.type" };

export const WorkoutPlanName = v.pipe(
  v.string(WorkoutPlanNameError.Type),
  // Stryker disable next-line StringLiteral
  v.brand("WorkoutPlanName"),
);

export type WorkoutPlanNameType = v.InferOutput<typeof WorkoutPlanName>;
