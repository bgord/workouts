import type * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";

export type ExerciseSetOneRepMaxEstimate = {
  set: Workouts.OHQ.ExerciseSet;
  estimate: VO.OneRepMaxEstimateType;
};
