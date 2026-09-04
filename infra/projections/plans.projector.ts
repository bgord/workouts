import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<Plans.Aggregates.PlanEventType | Auth.Events.AccountDeletedEventType>;
  EventHandler: bg.EventHandlerStrategy;
};

export class PlansProjector {
  // Stryker disable next-line ArrayDeclaration
  private static readonly CHILD_EVENTS = [
    Plans.Events.PLAN_SECTION_CREATED_EVENT,
    Plans.Events.PLAN_SECTION_REMOVED_EVENT,
    Plans.Events.PLAN_SECTION_RENAMED_EVENT,
    Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT,
    Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT,
    Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT,
    Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT,
  ] as const;

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
      Plans.Events.PLAN_REMOVED_EVENT,
      deps.EventHandler.handle(this.onPlanRemovedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_EDITING_ENABLED_EVENT,
      deps.EventHandler.handle(this.onPlanEditingEnabledEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_RENAMED_EVENT,
      deps.EventHandler.handle(this.onPlanRenamedEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );

    // The revision belongs to the plan stream, so events about a plan's children advance it too
    for (const name of PlansProjector.CHILD_EVENTS) {
      deps.EventBus.on(name, deps.EventHandler.handle(this.onPlanChildEvent.bind(this)));
    }
  }

  async onPlanCreatedEvent(event: Plans.Events.PlanCreatedEventType) {
    await db.insert(Schema.plans).values({
      id: event.payload.planId,
      name: event.payload.planName,
      status: Plans.VO.PlanStatusEnum.draft,
      revision: event.revision ?? tools.Revision.INITIAL,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onPlanArchivedEvent(event: Plans.Events.PlanArchivedEventType) {
    await db
      .update(Schema.plans)
      .set({
        status: Plans.VO.PlanStatusEnum.archived,
        revision: event.revision,
        updatedAt: event.createdAt,
      })
      .where(
        and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.userId, event.payload.requesterId)),
      );
  }

  async onPlanRestoredEvent(event: Plans.Events.PlanRestoredEventType) {
    await db
      .update(Schema.plans)
      .set({ status: Plans.VO.PlanStatusEnum.draft, revision: event.revision, updatedAt: event.createdAt })
      .where(
        and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.userId, event.payload.requesterId)),
      );
  }

  async onPlanFinalizedEvent(event: Plans.Events.PlanFinalizedEventType) {
    await db
      .update(Schema.plans)
      .set({
        status: Plans.VO.PlanStatusEnum.finalized,
        revision: event.revision,
        updatedAt: event.createdAt,
      })
      .where(
        and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.userId, event.payload.requesterId)),
      );
  }

  async onPlanRemovedEvent(event: Plans.Events.PlanRemovedEventType) {
    await db
      .delete(Schema.plans)
      .where(
        and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.userId, event.payload.requesterId)),
      );
  }

  async onPlanEditingEnabledEvent(event: Plans.Events.PlanEditingEnabledEventType) {
    await db
      .update(Schema.plans)
      .set({ status: Plans.VO.PlanStatusEnum.draft, revision: event.revision, updatedAt: event.createdAt })
      .where(
        and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.userId, event.payload.requesterId)),
      );
  }

  async onPlanRenamedEvent(event: Plans.Events.PlanRenamedEventType) {
    await db
      .update(Schema.plans)
      .set({ name: event.payload.planName, revision: event.revision, updatedAt: event.createdAt })
      .where(
        and(eq(Schema.plans.id, event.payload.planId), eq(Schema.plans.userId, event.payload.requesterId)),
      );
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db.delete(Schema.plans).where(eq(Schema.plans.userId, event.payload.userId));
  }

  async onPlanChildEvent(
    event: Plans.Aggregates.PlanEventType & { payload: { planId: Plans.VO.PlanIdType } },
  ) {
    await db
      .update(Schema.plans)
      .set({ revision: event.revision, updatedAt: event.createdAt })
      .where(eq(Schema.plans.id, event.payload.planId));
  }
}
