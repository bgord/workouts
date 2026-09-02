import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanId } from "../value-objects/plan-id";

// Stryker disable next-line StringLiteral
export const PLAN_ARCHIVE_COMMAND = "PLAN_ARCHIVE_COMMAND";

export const PlanArchiveCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_ARCHIVE_COMMAND),
  payload: v.object({ planId: PlanId, requesterId: Auth.VO.UserId }),
});

export type PlanArchiveCommandType = v.InferOutput<typeof PlanArchiveCommand>;
