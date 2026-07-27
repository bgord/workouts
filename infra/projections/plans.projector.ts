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
      Plans.Events.PLAN_CREATED_EVENT,
      deps.EventHandler.handle(this.onPlanCreatedEvent.bind(this)),
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
    deps.EventBus.on(
      Plans.Events.PLAN_EDITING_ENABLED_EVENT,
      deps.EventHandler.handle(this.onPlanEditingEnabledEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_RENAMED_EVENT,
      deps.EventHandler.handle(this.onPlanRenamedEvent.bind(this)),
    );
  }

  async onPlanCreatedEvent(event: Plans.Events.PlanCreatedEventType) {
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
      .set({ status: Plans.VO.PlanStatusEnum.archived, updatedAt: event.createdAt })
      .where(and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.ownerId, event.payload.ownerId)));
  }

  async onPlanRestoredEvent(event: Plans.Events.PlanRestoredEventType) {
    await db
      .update(Schema.plans)
      .set({ status: Plans.VO.PlanStatusEnum.draft, updatedAt: event.createdAt })
      .where(and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.ownerId, event.payload.ownerId)));
  }

  async onPlanFinalizedEvent(event: Plans.Events.PlanFinalizedEventType) {
    await db
      .update(Schema.plans)
      .set({ status: Plans.VO.PlanStatusEnum.finalized, updatedAt: event.createdAt })
      .where(and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.ownerId, event.payload.ownerId)));
  }

  async onPlanEditingEnabledEvent(event: Plans.Events.PlanEditingEnabledEventType) {
    await db
      .update(Schema.plans)
      .set({ status: Plans.VO.PlanStatusEnum.draft, updatedAt: event.createdAt })
      .where(and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.ownerId, event.payload.ownerId)));
  }

  async onPlanRenamedEvent(event: Plans.Events.PlanRenamedEventType) {
    await db
      .update(Schema.plans)
      .set({ name: event.payload.planName, updatedAt: event.createdAt })
      .where(and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.ownerId, event.payload.ownerId)));
  }
}
