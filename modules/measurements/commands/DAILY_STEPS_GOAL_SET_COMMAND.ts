import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { DailyStepsGoal } from "../value-objects/daily-steps-goal";

// Stryker disable next-line StringLiteral
export const DAILY_STEPS_GOAL_SET_COMMAND = "DAILY_STEPS_GOAL_SET_COMMAND";

export const DailyStepsGoalSetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(DAILY_STEPS_GOAL_SET_COMMAND),
  payload: v.object({ userId: Auth.VO.UserId, goal: DailyStepsGoal }),
});

export type DailyStepsGoalSetCommandType = v.InferOutput<typeof DailyStepsGoalSetCommand>;
