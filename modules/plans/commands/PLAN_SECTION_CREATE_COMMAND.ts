import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanId } from "../value-objects/plan-id";
import { PlanSectionId } from "../value-objects/plan-section-id";
import { PlanSectionName } from "../value-objects/plan-section-name";

// Stryker disable next-line StringLiteral
export const PLAN_SECTION_CREATE_COMMAND = "PLAN_SECTION_CREATE_COMMAND";

export const PlanSectionCreateCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(PLAN_SECTION_CREATE_COMMAND),
  payload: v.object({
    planId: PlanId,
    planSectionId: PlanSectionId,
    planSectionName: PlanSectionName,
    ownerId: Auth.VO.UserId,
  }),
});

export type PlanSectionCreateCommandType = v.InferOutput<typeof PlanSectionCreateCommand>;
