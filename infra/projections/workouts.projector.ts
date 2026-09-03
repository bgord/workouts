import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<Workouts.Aggregates.WorkoutEventType | Auth.Events.AccountDeletedEventType>;
  EventHandler: bg.EventHandlerStrategy;
};

export class WorkoutsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Workouts.Events.WORKOUT_CREATED_EVENT,
      deps.EventHandler.handle(this.onWorkoutCreatedEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onWorkoutCreatedEvent(event: Workouts.Events.WorkoutCreatedEventType) {
    await db.insert(Schema.workouts).values({
      id: event.payload.workoutId,
      planId: event.payload.planId,
      scheduledFor: event.payload.scheduledFor,
      status: Workouts.VO.WorkoutStatusEnum.draft,
      revision: event.revision ?? tools.Revision.INITIAL,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db.delete(Schema.workouts).where(eq(Schema.workouts.userId, event.payload.userId));
  }
}
