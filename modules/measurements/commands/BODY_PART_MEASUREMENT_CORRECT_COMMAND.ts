import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartMeasuredOn } from "../value-objects/body-part-measured-on";
import { BodyPartMeasurementId } from "../value-objects/body-part-measurement-id";
import { BodyPartMeasurementValue } from "../value-objects/body-part-measurement-value";

// Stryker disable next-line StringLiteral
export const BODY_PART_MEASUREMENT_CORRECT_COMMAND = "BODY_PART_MEASUREMENT_CORRECT_COMMAND";

export const BodyPartMeasurementCorrectCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_MEASUREMENT_CORRECT_COMMAND),
  payload: v.object({
    id: BodyPartMeasurementId,
    value: BodyPartMeasurementValue,
    measuredOn: BodyPartMeasuredOn,
    requesterId: Auth.VO.UserId,
  }),
});

export type BodyPartMeasurementCorrectCommandType = v.InferOutput<typeof BodyPartMeasurementCorrectCommand>;
