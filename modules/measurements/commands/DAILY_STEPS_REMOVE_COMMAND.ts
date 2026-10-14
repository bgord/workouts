import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { DailyStepsDay } from "../value-objects/daily-steps-day";

// Stryker disable next-line StringLiteral
export const DAILY_STEPS_REMOVE_COMMAND = "DAILY_STEPS_REMOVE_COMMAND";

export const DailyStepsRemoveCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(DAILY_STEPS_REMOVE_COMMAND),
  payload: v.object({ userId: Auth.VO.UserId, day: DailyStepsDay }),
});

export type DailyStepsRemoveCommandType = v.InferOutput<typeof DailyStepsRemoveCommand>;
