import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyWeight } from "../value-objects/body-weight";
import { BodyWeightMeasuredOn } from "../value-objects/body-weight-measured-on";
import { BodyWeightMeasurementId } from "../value-objects/body-weight-measurement-id";

// Stryker disable next-line StringLiteral
export const BODY_WEIGHT_MEASUREMENT_CORRECT_COMMAND = "BODY_WEIGHT_MEASUREMENT_CORRECT_COMMAND";

export const BodyWeightMeasurementCorrectCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_WEIGHT_MEASUREMENT_CORRECT_COMMAND),
  payload: v.object({
    id: BodyWeightMeasurementId,
    weight: BodyWeight,
    measuredOn: BodyWeightMeasuredOn,
    requesterId: Auth.VO.UserId,
  }),
});

export type BodyWeightMeasurementCorrectCommandType = v.InferOutput<
  typeof BodyWeightMeasurementCorrectCommand
>;
