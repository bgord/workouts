import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartId } from "../value-objects/body-part-id";
import { BodyPartMeasuredOn } from "../value-objects/body-part-measured-on";
import { BodyPartMeasurementId } from "../value-objects/body-part-measurement-id";
import { BodyPartMeasurementValue } from "../value-objects/body-part-measurement-value";

// Stryker disable next-line StringLiteral
export const BODY_PART_MEASURE_COMMAND = "BODY_PART_MEASURE_COMMAND";

export const BodyPartMeasureCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_MEASURE_COMMAND),
  payload: v.object({
    id: BodyPartMeasurementId,
    bodyPartId: BodyPartId,
    value: BodyPartMeasurementValue,
    measuredOn: BodyPartMeasuredOn,
    userId: Auth.VO.UserId,
  }),
});

export type BodyPartMeasureCommandType = v.InferOutput<typeof BodyPartMeasureCommand>;
