import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+workouts/value-objects";

export type WorkoutExportRow = {
  workoutId: VO.WorkoutIdType;
  completedAt: tools.TimestampValueType;
  planName: VO.WorkoutPlanNameType;
  planSectionName: VO.WorkoutPlanSectionNameType;
  exerciseName: VO.WorkoutExerciseNameType;
  resistance: VO.WorkoutExerciseResistanceType;
  laterality: VO.WorkoutExerciseLateralityType;
  setNumber: VO.SetNumberType;
  reps: VO.RepsType;
  load: VO.LoadType;
  rir: VO.RirType | null;
};

export interface ListWorkoutExportRows {
  execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<WorkoutExportRow>>;
}
