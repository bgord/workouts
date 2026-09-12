import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_WEIGHT_REFERENCE_SET_EVENT = "BODY_WEIGHT_REFERENCE_SET_EVENT";

export const BodyWeightReferenceSetEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_WEIGHT_REFERENCE_SET_EVENT),
  payload: v.object({ measurementId: VO.BodyWeightMeasurementId, userId: Auth.VO.UserId }),
});

export type BodyWeightReferenceSetEventType = v.InferOutput<typeof BodyWeightReferenceSetEvent>;
