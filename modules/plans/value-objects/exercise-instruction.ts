import * as v from "valibot";
import * as Exercises from "+exercises";
import { ExerciseInstructionId } from "./exercise-instruction-id";
import { ProgressionMethod } from "./progression-method";
import { RepsRange } from "./reps-range";
import { RirTarget } from "./rir-target";
import { Sets } from "./sets";

export const ExerciseInstruction = v.object({
  id: ExerciseInstructionId,
  exerciseId: Exercises.VO.ExerciseId,
  sets: Sets,
  reps: RepsRange,
  progression: ProgressionMethod,
  rir: v.optional(RirTarget),
});

export type ExerciseInstructionType = v.InferOutput<typeof ExerciseInstruction>;
