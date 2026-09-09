import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+workouts/value-objects";

export type ExerciseSet = {
  id: VO.LoggedSetIdType;
  workoutId: VO.WorkoutIdType;
  reps: VO.RepsType;
  load: VO.LoadType;
  createdAt: tools.TimestampValueType;
};

export interface ListExerciseSets {
  execute(userId: Auth.VO.UserIdType, exerciseId: Exercises.VO.ExerciseIdType): Promise<Array<ExerciseSet>>;
}
