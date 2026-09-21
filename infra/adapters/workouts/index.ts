import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";
import { GetWorkoutQuery } from "./get-workout.adapter";
import { GetWorkoutDashboardQuery } from "./get-workout-dashboard.adapter";
import { GetWorkoutStatusForOwnerCountQuery } from "./get-workout-status-for-owner-count.adapter";
import { ListExercisePerformancesQuery } from "./list-exercise-performances.adapter";
import { ListWorkoutExportRowsQuery } from "./list-workout-export-rows.adapter";
import { ListWorkoutsQuery } from "./list-workouts.adapter";
import { createWorkoutRepository } from "./workout-repository.adapter";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Workouts.Aggregates.WorkoutEventType>;
};

export function createWorkoutsAdapters(deps: Dependencies) {
  return {
    GetWorkoutQuery,
    GetWorkoutDashboardQuery,
    GetWorkoutStatusForOwnerCountQuery,
    ListExercisePerformancesQuery,
    ListWorkoutExportRowsQuery,
    ListWorkoutsQuery,
    WorkoutRepository: createWorkoutRepository(deps),
  };
}
