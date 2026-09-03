import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";
import { createWorkoutRepository } from "./workout-repository.adapter";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Workouts.Aggregates.WorkoutEventType>;
};

export function createWorkoutsAdapters(deps: Dependencies) {
  return { WorkoutRepository: createWorkoutRepository(deps) };
}
