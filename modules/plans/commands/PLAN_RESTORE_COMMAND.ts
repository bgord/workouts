import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanId } from "../value-objects/plan-id";

// Stryker disable next-line StringLiteral
export const PLAN_RESTORE_COMMAND = "PLAN_RESTORE_COMMAND";

export const PlanRestoreCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_RESTORE_COMMAND),
  payload: v.object({ planId: PlanId, userId: Auth.VO.UserId }),
});

export type PlanRestoreCommandType = v.InferOutput<typeof PlanRestoreCommand>;
