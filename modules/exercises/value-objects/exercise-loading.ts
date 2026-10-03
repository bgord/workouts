import * as v from "valibot";
import { ExerciseLoadingOptions } from "./exercise-loading-options";

export const ExerciseLoadingError = { invalid: "exercise.loading.invalid" };

export const ExerciseLoading = v.enum(ExerciseLoadingOptions, ExerciseLoadingError.invalid);
export type ExerciseLoadingType = v.InferOutput<typeof ExerciseLoading>;
