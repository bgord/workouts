import type * as Exercises from "+exercises";
import type { ExercisePrescriptionType } from "./exercise-prescription";
import type { ExerciseTargetType } from "./exercise-target";
import type { LoggedSetType } from "./logged-set";
import type { WorkoutExerciseIdType } from "./workout-exercise-id";
import type { WorkoutExerciseNameType } from "./workout-exercise-name";

export type WorkoutExercise = {
  id: WorkoutExerciseIdType;
  exerciseId: Exercises.VO.ExerciseIdType;
  exerciseName: WorkoutExerciseNameType;
  prescription: ExercisePrescriptionType;
  target?: ExerciseTargetType;
  loggedSets: Array<LoggedSetType>;
};
