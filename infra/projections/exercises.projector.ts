import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Exercises.Events.ExerciseAddedEventType
    | Exercises.Events.ExerciseDeletedEventType
    | Exercises.Events.ExerciseUpdatedEventType
    | Exercises.Events.ExerciseImageChangedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class ExercisesProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Exercises.Events.EXERCISE_ADDED_EVENT,
      deps.EventHandler.handle(this.onExerciseAddedEvent.bind(this)),
    );
    deps.EventBus.on(
      Exercises.Events.EXERCISE_UPDATED_EVENT,
      deps.EventHandler.handle(this.onExerciseUpdatedEvent.bind(this)),
    );
    deps.EventBus.on(
      Exercises.Events.EXERCISE_IMAGE_CHANGED_EVENT,
      deps.EventHandler.handle(this.onExerciseImageChangedEvent.bind(this)),
    );
    deps.EventBus.on(
      Exercises.Events.EXERCISE_DELETED_EVENT,
      deps.EventHandler.handle(this.onExerciseDeletedEvent.bind(this)),
    );
  }

  async onExerciseAddedEvent(event: Exercises.Events.ExerciseAddedEventType) {
    await db.insert(Schema.exercises).values({
      id: event.payload.id,
      name: event.payload.name,
      description: event.payload.description,
      image: event.payload.image,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onExerciseUpdatedEvent(event: Exercises.Events.ExerciseUpdatedEventType) {
    await db
      .update(Schema.exercises)
      .set({ name: event.payload.name, description: event.payload.description, updatedAt: event.createdAt })
      .where(eq(Schema.exercises.id, event.payload.id));
  }

  async onExerciseImageChangedEvent(event: Exercises.Events.ExerciseImageChangedEventType) {
    await db
      .update(Schema.exercises)
      .set({ image: event.payload.image, updatedAt: event.createdAt })
      .where(eq(Schema.exercises.id, event.payload.id));
  }

  async onExerciseDeletedEvent(event: Exercises.Events.ExerciseDeletedEventType) {
    await db.delete(Schema.exercises).where(eq(Schema.exercises.id, event.payload.id));
  }
}
