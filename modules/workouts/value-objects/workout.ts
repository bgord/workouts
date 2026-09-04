import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type * as Plans from "+plans";
import type { ExercisePrescriptionType } from "./exercise-prescription";
import type { ExerciseTargetType } from "./exercise-target";
import type { LoggedSetType } from "./logged-set";
import type { WorkoutExerciseIdType } from "./workout-exercise-id";
import type { WorkoutIdType } from "./workout-id";
import type { WorkoutScheduledForType } from "./workout-scheduled-for";
import type { WorkoutStatusEnum } from "./workout-status";

export type WorkoutExerciseWithSets = {
  id: WorkoutExerciseIdType;
  exerciseId: Exercises.VO.ExerciseIdType;
  exerciseName: Exercises.VO.ExerciseNameType;
  prescription: ExercisePrescriptionType;
  target?: ExerciseTargetType;
  loggedSets: Array<LoggedSetType>;
};

export type Workout = {
  id: WorkoutIdType;
  planId: Plans.VO.PlanIdType;
  planName: Plans.VO.PlanNameType;
  planSectionId: Plans.VO.PlanSectionIdType;
  planSectionName: Plans.VO.PlanSectionNameType;
  scheduledFor: WorkoutScheduledForType;
  status: WorkoutStatusEnum;
  revision: tools.RevisionValueType;
  exercises: Array<WorkoutExerciseWithSets>;
};
