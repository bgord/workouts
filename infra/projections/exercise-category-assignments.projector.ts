import type * as bg from "@bgord/bun";
import { and, eq } from "drizzle-orm";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Exercises.Events.ExerciseCategoryAssignedEventType
    | Exercises.Events.ExerciseCategoryRoleSetEventType
    | Exercises.Events.ExerciseCategoryUnassignedEventType
    | Exercises.Events.ExerciseDeletedEventType
    | Exercises.Events.ExerciseCategoryDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class ExerciseCategoryAssignmentsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Exercises.Events.EXERCISE_CATEGORY_ASSIGNED_EVENT,
      deps.EventHandler.handle(this.onExerciseCategoryAssignedEvent.bind(this)),
    );
    deps.EventBus.on(
      Exercises.Events.EXERCISE_CATEGORY_ROLE_SET_EVENT,
      deps.EventHandler.handle(this.onExerciseCategoryRoleSetEvent.bind(this)),
    );
    deps.EventBus.on(
      Exercises.Events.EXERCISE_CATEGORY_UNASSIGNED_EVENT,
      deps.EventHandler.handle(this.onExerciseCategoryUnassignedEvent.bind(this)),
    );
    deps.EventBus.on(
      Exercises.Events.EXERCISE_DELETED_EVENT,
      deps.EventHandler.handle(this.onExerciseDeletedEvent.bind(this)),
    );
    deps.EventBus.on(
      Exercises.Events.EXERCISE_CATEGORY_DELETED_EVENT,
      deps.EventHandler.handle(this.onExerciseCategoryDeletedEvent.bind(this)),
    );
  }

  async onExerciseCategoryAssignedEvent(event: Exercises.Events.ExerciseCategoryAssignedEventType) {
    await db.insert(Schema.exerciseCategoryAssignments).values({
      exerciseId: event.payload.exerciseId,
      exerciseCategoryId: event.payload.exerciseCategoryId,
      role: event.payload.role,
      createdAt: event.createdAt,
    });
  }

  async onExerciseCategoryRoleSetEvent(event: Exercises.Events.ExerciseCategoryRoleSetEventType) {
    await db
      .update(Schema.exerciseCategoryAssignments)
      .set({ role: event.payload.role })
      .where(
        and(
          eq(Schema.exerciseCategoryAssignments.exerciseId, event.payload.exerciseId),
          eq(Schema.exerciseCategoryAssignments.exerciseCategoryId, event.payload.exerciseCategoryId),
        ),
      );
  }

  async onExerciseCategoryUnassignedEvent(event: Exercises.Events.ExerciseCategoryUnassignedEventType) {
    await db
      .delete(Schema.exerciseCategoryAssignments)
      .where(
        and(
          eq(Schema.exerciseCategoryAssignments.exerciseId, event.payload.exerciseId),
          eq(Schema.exerciseCategoryAssignments.exerciseCategoryId, event.payload.exerciseCategoryId),
        ),
      );
  }

  async onExerciseDeletedEvent(event: Exercises.Events.ExerciseDeletedEventType) {
    await db
      .delete(Schema.exerciseCategoryAssignments)
      .where(eq(Schema.exerciseCategoryAssignments.exerciseId, event.payload.id));
  }

  async onExerciseCategoryDeletedEvent(event: Exercises.Events.ExerciseCategoryDeletedEventType) {
    await db
      .delete(Schema.exerciseCategoryAssignments)
      .where(eq(Schema.exerciseCategoryAssignments.exerciseCategoryId, event.payload.id));
  }
}
