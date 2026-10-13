import type * as bg from "@bgord/bun";
import { and, eq, inArray } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = { EventStore: bg.EventStorePort<Plans.Aggregates.PlanEventType> };

class GetPlanHistoryQueryEventStore implements Plans.Queries.GetPlanHistory {
  constructor(private readonly deps: Dependencies) {}

  async execute(
    planId: Plans.VO.PlanIdType,
    userId: Auth.VO.UserIdType,
    config: Plans.VO.PlanHistoryPageConfig,
  ): Promise<Plans.Queries.PlanHistoryGetResponse | null> {
    const [plan, events] = await Promise.all([
      db.query.plans.findFirst({
        columns: { id: true },
        where: and(eq(Schema.plans.id, planId), eq(Schema.plans.userId, userId)),
      }),
      this.deps.EventStore.find(Plans.Aggregates.Plan.registry, Plans.Aggregates.Plan.getStream(planId)),
    ]);

    if (!plan) return null;

    const exerciseIds = events.flatMap((event) =>
      event.name === Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT ||
      event.name === Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT
        ? [event.payload.exerciseInstruction.exerciseId]
        : [],
    );

    const exercises = await db
      .select({ id: Schema.exercises.id, name: Schema.exercises.name })
      .from(Schema.exercises)
      .where(inArray(Schema.exercises.id, exerciseIds));

    return { data: new Plans.Services.PlanHistory({ events, exercises }).calculate(config) };
  }
}

export function createGetPlanHistoryQuery(deps: Dependencies): Plans.Queries.GetPlanHistory {
  return new GetPlanHistoryQueryEventStore(deps);
}
