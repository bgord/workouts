import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyWeightMeasurementId } from "../value-objects/body-weight-measurement-id";

// Stryker disable next-line StringLiteral
export const BODY_WEIGHT_MEASUREMENT_REMOVE_COMMAND = "BODY_WEIGHT_MEASUREMENT_REMOVE_COMMAND";

export const BodyWeightMeasurementRemoveCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_WEIGHT_MEASUREMENT_REMOVE_COMMAND),
  payload: v.object({ id: BodyWeightMeasurementId, requesterId: Auth.VO.UserId }),
});

export type BodyWeightMeasurementRemoveCommandType = v.InferOutput<typeof BodyWeightMeasurementRemoveCommand>;
