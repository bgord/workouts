import type * as tools from "@bgord/tools";
import type * as Workouts from "+workouts";
import type { DeltaType } from "./delta";
import type { OneRepMaxEstimateType } from "./one-rep-max-estimate";
import type { VolumeType } from "./volume";

export type PerformedSet = { reps: Workouts.VO.RepsType; load: Workouts.VO.LoadType };

export type ExerciseSession = {
  workoutId: Workouts.VO.WorkoutIdType;
  completedAt: tools.TimestampValueType;
  sets: Array<PerformedSet>;
  oneRepMaxEstimate?: OneRepMaxEstimateType;
  oneRepMaxEstimateDelta?: DeltaType;
  volume: VolumeType;
  volumeDelta?: DeltaType;
};

export type ExerciseRecord = PerformedSet & {
  workoutId: Workouts.VO.WorkoutIdType;
  completedAt: tools.TimestampValueType;
};

export type EstimatedRecord = ExerciseRecord & { oneRepMaxEstimate: OneRepMaxEstimateType };

export type ExerciseHistory = {
  sessions: Array<ExerciseSession>;
  record?: ExerciseRecord;
  estimatedRecord?: EstimatedRecord;
};
