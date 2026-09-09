import type * as tools from "@bgord/tools";
import type * as Workouts from "+workouts";
import type { DeltaType } from "./delta";
import type { OneRepMaxEstimateType } from "./one-rep-max-estimate";
import type { PerformedSet } from "./performed-set";
import type { VolumeType } from "./volume";

export type ExerciseSession = {
  workoutId: Workouts.VO.WorkoutIdType;
  completedAt: tools.TimestampValueType;
  sets: Array<PerformedSet>;
  oneRepMaxEstimate?: OneRepMaxEstimateType;
  oneRepMaxEstimateDelta?: DeltaType;
  volume: VolumeType;
  volumeDelta?: DeltaType;
};
