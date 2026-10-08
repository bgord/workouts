import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+exercises/value-objects";

export const EXERCISE_LOAD_STEP_SET_EVENT = "EXERCISE_LOAD_STEP_SET_EVENT";

export const ExerciseLoadStepSetEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_LOAD_STEP_SET_EVENT),
  payload: v.object({
    id: VO.ExerciseId,
    loadStep: VO.ExerciseLoadStep,
    requesterId: Auth.VO.UserId,
  }),
});

export type ExerciseLoadStepSetEventType = v.InferOutput<typeof ExerciseLoadStepSetEvent>;
