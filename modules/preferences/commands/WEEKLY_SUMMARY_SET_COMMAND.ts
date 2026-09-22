import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { WeeklySummary } from "../value-objects/weekly-summary";

// Stryker disable next-line StringLiteral
export const WEEKLY_SUMMARY_SET_COMMAND = "WEEKLY_SUMMARY_SET_COMMAND";

export const WeeklySummarySetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(WEEKLY_SUMMARY_SET_COMMAND),
  payload: v.object({ userId: Auth.VO.UserId, weeklySummary: WeeklySummary }),
});

export type WeeklySummarySetCommandType = v.InferOutput<typeof WeeklySummarySetCommand>;
