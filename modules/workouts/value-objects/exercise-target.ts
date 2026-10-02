import * as v from "valibot";
import * as Plans from "+plans";
import { Load } from "./load";
import { Reps } from "./reps";

export const ExerciseTarget = v.object({ sets: Plans.VO.Sets, reps: Reps, load: Load });

export type ExerciseTargetType = v.InferOutput<typeof ExerciseTarget>;
