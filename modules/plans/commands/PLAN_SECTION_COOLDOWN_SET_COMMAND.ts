import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanId } from "../value-objects/plan-id";
import { PlanSectionCooldown } from "../value-objects/plan-section-cooldown";
import { PlanSectionId } from "../value-objects/plan-section-id";

// Stryker disable next-line StringLiteral
export const PLAN_SECTION_COOLDOWN_SET_COMMAND = "PLAN_SECTION_COOLDOWN_SET_COMMAND";

export const PlanSectionCooldownSetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_SECTION_COOLDOWN_SET_COMMAND),
  payload: v.object({
    planId: PlanId,
    planSectionId: PlanSectionId,
    cooldown: v.optional(PlanSectionCooldown),
    requesterId: Auth.VO.UserId,
  }),
});

export type PlanSectionCooldownSetCommandType = v.InferOutput<typeof PlanSectionCooldownSetCommand>;
