import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type * as Plans from "+plans";
import type { ExercisePrescriptionType } from "./exercise-prescription";
import type { ExerciseTargetType } from "./exercise-target";
import type { LoggedSetType } from "./logged-set";
import type { WorkoutExerciseIdType } from "./workout-exercise-id";
import type { WorkoutExerciseNameType } from "./workout-exercise-name";
import type { WorkoutIdType } from "./workout-id";
import type { WorkoutNoteType } from "./workout-note";
import type { WorkoutPlanNameType } from "./workout-plan-name";
import type { WorkoutPlanSectionCooldownType } from "./workout-plan-section-cooldown";
import type { WorkoutPlanSectionNameType } from "./workout-plan-section-name";
import type { WorkoutPlanSectionWarmupType } from "./workout-plan-section-warmup";
import type { WorkoutScheduledForType } from "./workout-scheduled-for";
import type { WorkoutStatusEnum } from "./workout-status";

export type WorkoutExerciseWithSets = {
  id: WorkoutExerciseIdType;
  exerciseId: Exercises.VO.ExerciseIdType;
  exerciseName: WorkoutExerciseNameType;
  prescription: ExercisePrescriptionType;
  target?: ExerciseTargetType;
  loggedSets: Array<LoggedSetType>;
};

export type Workout = {
  id: WorkoutIdType;
  planId: Plans.VO.PlanIdType;
  planName: WorkoutPlanNameType;
  planSectionId: Plans.VO.PlanSectionIdType;
  planSectionName: WorkoutPlanSectionNameType;
  planSectionWarmup: WorkoutPlanSectionWarmupType | null;
  planSectionCooldown: WorkoutPlanSectionCooldownType | null;
  scheduledFor: WorkoutScheduledForType;
  status: WorkoutStatusEnum;
  completedAt: tools.TimestampValueType | null;
  note: WorkoutNoteType | null;
  revision: tools.RevisionValueType;
  exercises: Array<WorkoutExerciseWithSets>;
};
