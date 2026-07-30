import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanId } from "../value-objects/plan-id";
import { PlanSectionId } from "../value-objects/plan-section-id";

// Stryker disable next-line StringLiteral
export const PLAN_SECTION_REMOVE_COMMAND = "PLAN_SECTION_REMOVE_COMMAND";

export const PlanSectionRemoveCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_SECTION_REMOVE_COMMAND),
  payload: v.object({ planId: PlanId, planSectionId: PlanSectionId, userId: Auth.VO.UserId }),
});

export type PlanSectionRemoveCommandType = v.InferOutput<typeof PlanSectionRemoveCommand>;
