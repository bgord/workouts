import * as v from "valibot";
import { BodyWeightGoalOptions } from "./body-weight-goal-options";

export const BodyWeightGoalError = { invalid: "body.weight.goal.invalid" };

export const BodyWeightGoal = v.enum(BodyWeightGoalOptions, BodyWeightGoalError.invalid);
export type BodyWeightGoalType = v.InferOutput<typeof BodyWeightGoal>;
