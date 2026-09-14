import * as v from "valibot";
import { WorkoutListFilterOptions } from "./workout-list-filter-options";

export const WorkoutListFilterError = { invalid: "workout.list.filter.invalid" };

export const WorkoutListFilter = v.enum(WorkoutListFilterOptions, WorkoutListFilterError.invalid);
export type WorkoutListFilterType = v.InferOutput<typeof WorkoutListFilter>;
