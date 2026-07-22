import type * as bg from "@bgord/bun";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Plans.Aggregates.PlanEventType>;
};

class PlanRepositoryInternal implements Plans.Ports.PlanRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Plans.VO.PlanIdType): Promise<Plans.Aggregates.Plan> {
    const history = await this.deps.EventStore.find(
      Plans.Aggregates.Plan.registry,
      Plans.Aggregates.Plan.getStream(id),
    );

    return Plans.Aggregates.Plan.build(id, history, this.deps);
  }

  async save(aggregate: Plans.Aggregates.Plan): Promise<void> {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createPlanRepository(deps: Dependencies): Plans.Ports.PlanRepositoryPort {
  return new PlanRepositoryInternal(deps);
}
