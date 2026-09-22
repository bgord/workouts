import * as v from "valibot";
import * as Plans from "+plans";

export const ExercisePrescription = v.object({
  sets: Plans.VO.Sets,
  reps: Plans.VO.Reps,
  progression: Plans.VO.ProgressionMethod,
});

export type ExercisePrescriptionType = v.InferOutput<typeof ExercisePrescription>;
