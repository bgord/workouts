import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyWeightMeasurementId } from "../value-objects/body-weight-measurement-id";

// Stryker disable next-line StringLiteral
export const BODY_WEIGHT_REFERENCE_SET_COMMAND = "BODY_WEIGHT_REFERENCE_SET_COMMAND";

export const BodyWeightReferenceSetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_WEIGHT_REFERENCE_SET_COMMAND),
  payload: v.object({ measurementId: BodyWeightMeasurementId, requesterId: Auth.VO.UserId }),
});

export type BodyWeightReferenceSetCommandType = v.InferOutput<typeof BodyWeightReferenceSetCommand>;
