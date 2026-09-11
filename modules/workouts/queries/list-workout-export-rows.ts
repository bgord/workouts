import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

export type WorkoutExportRow = {
  workoutId: VO.WorkoutIdType;
  completedAt: tools.TimestampValueType;
  planName: Plans.VO.PlanNameType;
  planSectionName: Plans.VO.PlanSectionNameType;
  exerciseName: Exercises.VO.ExerciseNameType;
  setNumber: VO.SetNumberType;
  reps: VO.RepsType;
  load: VO.LoadType;
  rir?: VO.RirType;
};

export interface ListWorkoutExportRows {
  execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<WorkoutExportRow>>;
}
