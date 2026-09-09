import type { ExerciseRecord } from "./exercise-record";
import type { OneRepMaxEstimateType } from "./one-rep-max-estimate";

export type EstimatedRecord = ExerciseRecord & { oneRepMaxEstimate: OneRepMaxEstimateType };
