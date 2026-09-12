import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyWeight } from "../value-objects/body-weight";
import { BodyWeightMeasuredOn } from "../value-objects/body-weight-measured-on";
import { BodyWeightMeasurementId } from "../value-objects/body-weight-measurement-id";

// Stryker disable next-line StringLiteral
export const BODY_WEIGHT_MEASURE_COMMAND = "BODY_WEIGHT_MEASURE_COMMAND";

export const BodyWeightMeasureCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_WEIGHT_MEASURE_COMMAND),
  payload: v.object({
    id: BodyWeightMeasurementId,
    weight: BodyWeight,
    measuredOn: BodyWeightMeasuredOn,
    userId: Auth.VO.UserId,
  }),
});

export type BodyWeightMeasureCommandType = v.InferOutput<typeof BodyWeightMeasureCommand>;
