import type * as bg from "@bgord/bun";
import { and, eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Plans.Events.PlanSectionCreatedEventType
    | Plans.Events.PlanSectionRemovedEventType
    | Plans.Events.PlanSectionRenamedEventType
    | Auth.Events.AccountDeletedEventType
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
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onPlanSectionCreatedEvent(event: Plans.Events.PlanSectionCreatedEventType) {
    await db.insert(Schema.planSections).values({
      id: event.payload.planSectionId,
      planId: event.payload.planId,
      name: event.payload.planSectionName,
      userId: event.payload.userId,
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
          eq(Schema.planSections.userId, event.payload.requesterId),
        ),
      );
  }

  async onPlanSectionRenamedEvent(event: Plans.Events.PlanSectionRenamedEventType) {
    await db
      .update(Schema.planSections)
      .set({ name: event.payload.planSectionName, updatedAt: event.createdAt })
      .where(
        and(
          eq(Schema.planSections.id, event.payload.planSectionId),
          eq(Schema.planSections.planId, event.payload.planId),
          eq(Schema.planSections.userId, event.payload.requesterId),
        ),
      );
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db.delete(Schema.planSections).where(eq(Schema.planSections.userId, event.payload.userId));
  }
}
