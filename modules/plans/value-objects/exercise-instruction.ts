import * as Exercises from "+exercises";
import * as v from "valibot";
import { ExerciseInstructionId } from "./exercise-instruction-id";
import { Reps } from "./reps";
import { Sets } from "./sets";

export const ExerciseInstruction = v.object({
  id: ExerciseInstructionId,
  exerciseId: Exercises.VO.ExerciseId,
  reps: Reps,
  sets: Sets,
});

export type ExerciseInstructionType = v.InferOutput<typeof ExerciseInstruction>;
