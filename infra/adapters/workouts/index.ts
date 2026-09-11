import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";
import { GetWorkoutQuery } from "./get-workout.adapter";
import { GetWorkoutDashboardQuery } from "./get-workout-dashboard.adapter";
import { GetWorkoutDraftForOwnerCountQuery } from "./get-workout-draft-for-owner-count.adapter";
import { GetWorkoutInProgressForOwnerCountQuery } from "./get-workout-in-progress-for-owner-count.adapter";
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
    GetWorkoutDraftForOwnerCountQuery,
    GetWorkoutInProgressForOwnerCountQuery,
    ListExercisePerformancesQuery,
    ListWorkoutExportRowsQuery,
    ListWorkoutsQuery,
    WorkoutRepository: createWorkoutRepository(deps),
  };
}
