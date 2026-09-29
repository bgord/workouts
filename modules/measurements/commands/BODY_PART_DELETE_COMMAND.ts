import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartId } from "../value-objects/body-part-id";

// Stryker disable next-line StringLiteral
export const BODY_PART_DELETE_COMMAND = "BODY_PART_DELETE_COMMAND";

export const BodyPartDeleteCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_DELETE_COMMAND),
  payload: v.object({
    id: BodyPartId,
    requesterId: Auth.VO.UserId,
  }),
});

export type BodyPartDeleteCommandType = v.InferOutput<typeof BodyPartDeleteCommand>;
