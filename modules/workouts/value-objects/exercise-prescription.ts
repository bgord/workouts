import * as v from "valibot";
import * as Plans from "+plans";

export const ExercisePrescription = v.object({
  sets: Plans.VO.Sets,
  reps: Plans.VO.RepsRange,
  progression: Plans.VO.ProgressionMethod,
  rir: v.optional(Plans.VO.RirTarget),
});

export type ExercisePrescriptionType = v.InferOutput<typeof ExercisePrescription>;
