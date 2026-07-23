import type * as bg from "@bgord/bun";
import { and, eq } from "drizzle-orm";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<Plans.Aggregates.PlanEventType>;
  EventHandler: bg.EventHandlerStrategy;
};

export class PlansProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Plans.Events.PLAN_DRAFT_CREATED_EVENT,
      deps.EventHandler.handle(this.onPlanDraftCreatedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_ARCHIVED_EVENT,
      deps.EventHandler.handle(this.onPlanArchivedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_RESTORED_EVENT,
      deps.EventHandler.handle(this.onPlanRestoredEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_FINALIZED_EVENT,
      deps.EventHandler.handle(this.onPlanFinalizedEvent.bind(this)),
    );
  }

  async onPlanDraftCreatedEvent(event: Plans.Events.PlanDraftCreatedEventType) {
    await db.insert(Schema.plans).values({
      id: event.payload.planId,
      name: event.payload.planName,
      status: Plans.VO.PlanStatusEnum.draft,
      ownerId: event.payload.ownerId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onPlanArchivedEvent(event: Plans.Events.PlanArchivedEventType) {
    await db
      .update(Schema.plans)
      .set({ updatedAt: event.createdAt, status: Plans.VO.PlanStatusEnum.archived })
      .where(and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.ownerId, event.payload.ownerId)));
  }

  async onPlanRestoredEvent(event: Plans.Events.PlanRestoredEventType) {
    await db
      .update(Schema.plans)
      .set({ updatedAt: event.createdAt, status: Plans.VO.PlanStatusEnum.draft })
      .where(and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.ownerId, event.payload.ownerId)));
  }

  async onPlanFinalizedEvent(event: Plans.Events.PlanFinalizedEventType) {
    await db
      .update(Schema.plans)
      .set({ updatedAt: event.createdAt, status: Plans.VO.PlanStatusEnum.finalized })
      .where(and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.ownerId, event.payload.ownerId)));
  }
}
