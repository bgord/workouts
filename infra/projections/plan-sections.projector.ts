import type * as bg from "@bgord/bun";
import { and, eq } from "drizzle-orm";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Plans.Events.PlanSectionCreatedEventType
    | Plans.Events.PlanSectionRemovedEventType
    | Plans.Events.PlanSectionRenamedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class PlanSectionsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Plans.Events.PLAN_SECTION_CREATED_EVENT,
      deps.EventHandler.handle(this.onPlanSectionCreatedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_SECTION_REMOVED_EVENT,
      deps.EventHandler.handle(this.onPlanSectionRemovedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_SECTION_RENAMED_EVENT,
      deps.EventHandler.handle(this.onPlanSectionRenamedEvent.bind(this)),
    );
  }

  async onPlanSectionCreatedEvent(event: Plans.Events.PlanSectionCreatedEventType) {
    await db.insert(Schema.planSections).values({
      id: event.payload.planSectionId,
      planId: event.payload.planId,
      name: event.payload.planSectionName,
      ownerId: event.payload.ownerId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onPlanSectionRemovedEvent(event: Plans.Events.PlanSectionRemovedEventType) {
    await db
      .delete(Schema.planSections)
      .where(
        and(
          eq(Schema.planSections.id, event.payload.planSectionId),
          eq(Schema.planSections.planId, event.payload.planId),
          eq(Schema.planSections.ownerId, event.payload.ownerId),
        ),
      );
  }

  async onPlanSectionRenamedEvent(event: Plans.Events.PlanSectionRenamedEventType) {
    await db
      .update(Schema.planSections)
      .set({ name: event.payload.planSectionName })
      .where(eq(Schema.planSections.id, event.payload.planSectionId));
  }
}
