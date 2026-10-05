import * as v from "valibot";
import { ExerciseResistanceOptions } from "./exercise-resistance-options";

export const ExerciseResistanceError = { invalid: "exercise.resistance.invalid" };

export const ExerciseResistance = v.enum(ExerciseResistanceOptions, ExerciseResistanceError.invalid);
export type ExerciseResistanceType = v.InferOutput<typeof ExerciseResistance>;
