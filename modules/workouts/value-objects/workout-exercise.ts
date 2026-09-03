import type * as Exercises from "+exercises";
import type { ExercisePrescriptionType } from "./exercise-prescription";
import type { ExerciseTargetType } from "./exercise-target";
import type { WorkoutExerciseIdType } from "./workout-exercise-id";

export type WorkoutExercise = {
  id: WorkoutExerciseIdType;
  exerciseId: Exercises.VO.ExerciseIdType;
  prescription: ExercisePrescriptionType;
  target?: ExerciseTargetType;
};
