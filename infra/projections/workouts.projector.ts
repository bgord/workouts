import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<Workouts.Aggregates.WorkoutEventType | Auth.Events.AccountDeletedEventType>;
  EventHandler: bg.EventHandlerStrategy;
};

export class WorkoutsProjector {
  // Stryker disable next-line ArrayDeclaration
  private static readonly CHILD_EVENTS = [
    Workouts.Events.WORKOUT_EXERCISE_ADDED_EVENT,
    Workouts.Events.WORKOUT_EXERCISE_REMOVED_EVENT,
    Workouts.Events.WORKOUT_EXERCISE_TARGET_SET_EVENT,
    Workouts.Events.WORKOUT_SET_LOGGED_EVENT,
    Workouts.Events.WORKOUT_SET_CORRECTED_EVENT,
    Workouts.Events.WORKOUT_SET_REMOVED_EVENT,
  ] as const;

  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Workouts.Events.WORKOUT_CREATED_EVENT,
      deps.EventHandler.handle(this.onWorkoutCreatedEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_STARTED_EVENT,
      deps.EventHandler.handle(this.onWorkoutStartedEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_COMPLETED_EVENT,
      deps.EventHandler.handle(this.onWorkoutCompletedEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_DISCARDED_EVENT,
      deps.EventHandler.handle(this.onWorkoutDiscardedEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_NOTE_SET_EVENT,
      deps.EventHandler.handle(this.onWorkoutNoteSetEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_RESCHEDULED_EVENT,
      deps.EventHandler.handle(this.onWorkoutRescheduledEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );

    for (const name of WorkoutsProjector.CHILD_EVENTS) {
      deps.EventBus.on(name, deps.EventHandler.handle(this.onWorkoutChildEvent.bind(this)));
    }
  }

  async onWorkoutCreatedEvent(event: Workouts.Events.WorkoutCreatedEventType) {
    await db.insert(Schema.workouts).values({
      id: event.payload.workoutId,
      planId: event.payload.planId,
      planName: event.payload.planName,
      planSectionId: event.payload.planSectionId,
      planSectionName: event.payload.planSectionName,
      scheduledFor: event.payload.scheduledFor,
      status: Workouts.VO.WorkoutStatusEnum.draft,
      revision: event.revision ?? tools.Revision.INITIAL,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onWorkoutStartedEvent(event: Workouts.Events.WorkoutStartedEventType) {
    await db
      .update(Schema.workouts)
      .set({
        status: Workouts.VO.WorkoutStatusEnum.in_progress,
        revision: event.revision,
        updatedAt: event.createdAt,
      })
      .where(
        and(
          eq(Schema.workouts.id, event.payload.workoutId),
          eq(Schema.workouts.userId, event.payload.requesterId),
        ),
      );
  }

  async onWorkoutNoteSetEvent(event: Workouts.Events.WorkoutNoteSetEventType) {
    await db
      .update(Schema.workouts)
      .set({ note: event.payload.note ?? null, revision: event.revision, updatedAt: event.createdAt })
      .where(
        and(
          eq(Schema.workouts.id, event.payload.workoutId),
          eq(Schema.workouts.userId, event.payload.requesterId),
        ),
      );
  }

  async onWorkoutRescheduledEvent(event: Workouts.Events.WorkoutRescheduledEventType) {
    await db
      .update(Schema.workouts)
      .set({
        scheduledFor: event.payload.scheduledFor,
        revision: event.revision,
        updatedAt: event.createdAt,
      })
      .where(
        and(
          eq(Schema.workouts.id, event.payload.workoutId),
          eq(Schema.workouts.userId, event.payload.requesterId),
        ),
      );
  }

  async onWorkoutCompletedEvent(event: Workouts.Events.WorkoutCompletedEventType) {
    await db
      .update(Schema.workouts)
      .set({
        status: Workouts.VO.WorkoutStatusEnum.completed,
        completedAt: event.createdAt,
        revision: event.revision,
        updatedAt: event.createdAt,
      })
      .where(
        and(
          eq(Schema.workouts.id, event.payload.workoutId),
          eq(Schema.workouts.userId, event.payload.requesterId),
        ),
      );
  }

  async onWorkoutDiscardedEvent(event: Workouts.Events.WorkoutDiscardedEventType) {
    await db
      .delete(Schema.workouts)
      .where(
        and(
          eq(Schema.workouts.id, event.payload.workoutId),
          eq(Schema.workouts.userId, event.payload.requesterId),
        ),
      );
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db.delete(Schema.workouts).where(eq(Schema.workouts.userId, event.payload.userId));
  }

  async onWorkoutChildEvent(
    event: Workouts.Aggregates.WorkoutEventType & { payload: { workoutId: Workouts.VO.WorkoutIdType } },
  ) {
    await db
      .update(Schema.workouts)
      .set({ revision: event.revision, updatedAt: event.createdAt })
      .where(eq(Schema.workouts.id, event.payload.workoutId));
  }
}
