import type * as tools from "@bgord/tools";
import type * as Workouts from "+workouts";

export type PerformedSet = { reps: Workouts.VO.RepsType; load: Workouts.VO.LoadType };

export type ExerciseSession = {
  workoutId: Workouts.VO.WorkoutIdType;
  completedAt: tools.TimestampValueType;
  sets: Array<PerformedSet>;
};

export type ExerciseRecord = PerformedSet & {
  workoutId: Workouts.VO.WorkoutIdType;
  completedAt: tools.TimestampValueType;
};

export type ExerciseHistory = {
  sessions: Array<ExerciseSession>;
  record?: ExerciseRecord;
  daysSinceLastSession?: tools.IntegerNonNegativeType;
};
