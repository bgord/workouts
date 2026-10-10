import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartDescription } from "../value-objects/body-part-description";
import { BodyPartId } from "../value-objects/body-part-id";

// Stryker disable next-line StringLiteral
export const BODY_PART_DESCRIPTION_SET_COMMAND = "BODY_PART_DESCRIPTION_SET_COMMAND";

export const BodyPartDescriptionSetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_DESCRIPTION_SET_COMMAND),
  payload: v.object({
    id: BodyPartId,
    description: v.optional(BodyPartDescription),
    requesterId: Auth.VO.UserId,
  }),
});

export type BodyPartDescriptionSetCommandType = v.InferOutput<typeof BodyPartDescriptionSetCommand>;
