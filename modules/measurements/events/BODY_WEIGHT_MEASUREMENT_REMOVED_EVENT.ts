import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_WEIGHT_MEASUREMENT_REMOVED_EVENT = "BODY_WEIGHT_MEASUREMENT_REMOVED_EVENT";

export const BodyWeightMeasurementRemovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_WEIGHT_MEASUREMENT_REMOVED_EVENT),
  payload: v.object({ id: VO.BodyWeightMeasurementId, requesterId: Auth.VO.UserId }),
});

export type BodyWeightMeasurementRemovedEventType = v.InferOutput<typeof BodyWeightMeasurementRemovedEvent>;
