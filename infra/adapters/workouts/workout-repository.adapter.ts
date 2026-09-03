import type * as bg from "@bgord/bun";
import * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Workouts.Aggregates.WorkoutEventType>;
};

class WorkoutRepositoryInternal implements Workouts.Ports.WorkoutRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Workouts.VO.WorkoutIdType): Promise<Workouts.Aggregates.Workout> {
    const history = await this.deps.EventStore.find(
      Workouts.Aggregates.Workout.registry,
      Workouts.Aggregates.Workout.getStream(id),
    );

    return Workouts.Aggregates.Workout.build(id, history, this.deps);
  }

  async save(aggregate: Workouts.Aggregates.Workout): Promise<void> {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createWorkoutRepository(deps: Dependencies): Workouts.Ports.WorkoutRepositoryPort {
  return new WorkoutRepositoryInternal(deps);
}
