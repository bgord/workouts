import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Exercises.Events.ExerciseCategoryAddedEventType
    | Exercises.Events.ExerciseCategoryRenamedEventType
    | Exercises.Events.ExerciseCategoryDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class ExerciseCategoriesProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Exercises.Events.EXERCISE_CATEGORY_ADDED_EVENT,
      deps.EventHandler.handle(this.onExerciseCategoryAddedEvent.bind(this)),
    );
    deps.EventBus.on(
      Exercises.Events.EXERCISE_CATEGORY_RENAMED_EVENT,
      deps.EventHandler.handle(this.onExerciseCategoryRenamedEvent.bind(this)),
    );
    deps.EventBus.on(
      Exercises.Events.EXERCISE_CATEGORY_DELETED_EVENT,
      deps.EventHandler.handle(this.onExerciseCategoryDeletedEvent.bind(this)),
    );
  }

  async onExerciseCategoryAddedEvent(event: Exercises.Events.ExerciseCategoryAddedEventType) {
    await db.insert(Schema.exerciseCategories).values({
      id: event.payload.id,
      name: event.payload.name,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onExerciseCategoryRenamedEvent(event: Exercises.Events.ExerciseCategoryRenamedEventType) {
    await db
      .update(Schema.exerciseCategories)
      .set({ name: event.payload.name, updatedAt: event.createdAt })
      .where(eq(Schema.exerciseCategories.id, event.payload.id));
  }

  async onExerciseCategoryDeletedEvent(event: Exercises.Events.ExerciseCategoryDeletedEventType) {
    await db.delete(Schema.exerciseCategories).where(eq(Schema.exerciseCategories.id, event.payload.id));
  }
}
