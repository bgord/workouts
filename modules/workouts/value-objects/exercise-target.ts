import * as v from "valibot";
import { Load } from "./load";
import { Reps } from "./reps";
import { Sets } from "./sets";

export const ExerciseTarget = v.object({ sets: Sets, reps: Reps, load: Load });

export type ExerciseTargetType = v.InferOutput<typeof ExerciseTarget>;
