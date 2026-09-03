import type * as Exercises from "+exercises";
import type { ExercisePrescriptionType } from "./exercise-prescription";
import type { ExerciseTargetType } from "./exercise-target";
import type { LoggedSetType } from "./logged-set";
import type { WorkoutExerciseIdType } from "./workout-exercise-id";

export type WorkoutExercise = {
  id: WorkoutExerciseIdType;
  exerciseId: Exercises.VO.ExerciseIdType;
  exerciseName: Exercises.VO.ExerciseNameType;
  prescription: ExercisePrescriptionType;
  target?: ExerciseTargetType;
  loggedSets: Array<LoggedSetType>;
};
