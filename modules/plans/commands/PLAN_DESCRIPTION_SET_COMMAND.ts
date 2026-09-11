import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanDescription } from "../value-objects/plan-description";
import { PlanId } from "../value-objects/plan-id";

// Stryker disable next-line StringLiteral
export const PLAN_DESCRIPTION_SET_COMMAND = "PLAN_DESCRIPTION_SET_COMMAND";

export const PlanDescriptionSetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_DESCRIPTION_SET_COMMAND),
  payload: v.object({
    planId: PlanId,
    description: v.optional(PlanDescription),
    requesterId: Auth.VO.UserId,
  }),
});

export type PlanDescriptionSetCommandType = v.InferOutput<typeof PlanDescriptionSetCommand>;
