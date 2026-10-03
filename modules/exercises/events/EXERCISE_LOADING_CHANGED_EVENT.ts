import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+exercises/value-objects";

export const EXERCISE_LOADING_CHANGED_EVENT = "EXERCISE_LOADING_CHANGED_EVENT";

export const ExerciseLoadingChangedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_LOADING_CHANGED_EVENT),
  payload: v.object({ id: VO.ExerciseId, loading: VO.ExerciseLoading, requesterId: Auth.VO.UserId }),
});

export type ExerciseLoadingChangedEventType = v.InferOutput<typeof ExerciseLoadingChangedEvent>;
