import * as v from "valibot";
import { ExerciseLoadStepOptions } from "./exercise-load-step-options";

export const ExerciseLoadStepError = { invalid: "exercise.load.step.invalid" };

export const ExerciseLoadStep = v.enum(ExerciseLoadStepOptions, ExerciseLoadStepError.invalid);
export type ExerciseLoadStepType = v.InferOutput<typeof ExerciseLoadStep>;
