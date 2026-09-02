import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanId } from "../value-objects/plan-id";
import { PlanSectionId } from "../value-objects/plan-section-id";
import { PlanSectionName } from "../value-objects/plan-section-name";

// Stryker disable next-line StringLiteral
export const PLAN_SECTION_RENAME_COMMAND = "PLAN_SECTION_RENAME_COMMAND";

export const PlanSectionRenameCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_SECTION_RENAME_COMMAND),
  payload: v.object({
    planId: PlanId,
    planSectionId: PlanSectionId,
    planSectionName: PlanSectionName,
    requesterId: Auth.VO.UserId,
  }),
});

export type PlanSectionRenameCommandType = v.InferOutput<typeof PlanSectionRenameCommand>;
