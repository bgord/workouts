import * as bg from "@bgord/bun";
import * as v from "valibot";
import type { ExerciseIdType } from "./exercise-id";

export const ExerciseStream = {
  of: (id: ExerciseIdType) => v.parse(bg.EventStream, `exercise_${id}`),
};
