import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanId } from "../value-objects/plan-id";
import { PlanSectionId } from "../value-objects/plan-section-id";
import { PlanSectionWarmup } from "../value-objects/plan-section-warmup";

// Stryker disable next-line StringLiteral
export const PLAN_SECTION_WARMUP_SET_COMMAND = "PLAN_SECTION_WARMUP_SET_COMMAND";

export const PlanSectionWarmupSetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_SECTION_WARMUP_SET_COMMAND),
  payload: v.object({
    planId: PlanId,
    planSectionId: PlanSectionId,
    warmup: v.optional(PlanSectionWarmup),
    requesterId: Auth.VO.UserId,
  }),
});

export type PlanSectionWarmupSetCommandType = v.InferOutput<typeof PlanSectionWarmupSetCommand>;
