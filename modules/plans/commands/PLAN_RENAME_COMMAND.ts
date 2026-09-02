import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanId } from "../value-objects/plan-id";
import { PlanName } from "../value-objects/plan-name";

// Stryker disable next-line StringLiteral
export const PLAN_RENAME_COMMAND = "PLAN_RENAME_COMMAND";

export const PlanRenameCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_RENAME_COMMAND),
  payload: v.object({ planId: PlanId, planName: PlanName, requesterId: Auth.VO.UserId }),
});

export type PlanRenameCommandType = v.InferOutput<typeof PlanRenameCommand>;
