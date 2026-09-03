import * as v from "valibot";
import * as Plans from "+plans";

export const ExercisePrescription = v.object({ sets: Plans.VO.Sets, reps: Plans.VO.Reps });

export type ExercisePrescriptionType = v.InferOutput<typeof ExercisePrescription>;
