import * as v from "valibot";
import { ExerciseLateralityOptions } from "./exercise-laterality-options";

export const ExerciseLateralityError = { invalid: "exercise.laterality.invalid" };

export const ExerciseLaterality = v.enum(ExerciseLateralityOptions, ExerciseLateralityError.invalid);
export type ExerciseLateralityType = v.InferOutput<typeof ExerciseLaterality>;
