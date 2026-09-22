import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type { ExercisePerformance } from "./list-exercise-performances";

export type WeekExercisePerformance = {
  exerciseId: Exercises.VO.ExerciseIdType;
  exerciseName: Exercises.VO.ExerciseNameType;
  current: ExercisePerformance;
  previous?: ExercisePerformance;
};

export interface ListWeekExercisePerformances {
  execute(userId: Auth.VO.UserIdType, week: tools.Week): Promise<ReadonlyArray<WeekExercisePerformance>>;
}
