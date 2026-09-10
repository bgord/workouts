import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Workouts.Events.WorkoutExerciseAddedEventType
    | Workouts.Events.WorkoutExerciseRemovedEventType
    | Workouts.Events.WorkoutExerciseTargetSetEventType
    | Workouts.Events.WorkoutDiscardedEventType
    | Auth.Events.AccountDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class WorkoutExercisesProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Workouts.Events.WORKOUT_EXERCISE_ADDED_EVENT,
      deps.EventHandler.handle(this.onWorkoutExerciseAddedEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_EXERCISE_REMOVED_EVENT,
      deps.EventHandler.handle(this.onWorkoutExerciseRemovedEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_EXERCISE_TARGET_SET_EVENT,
      deps.EventHandler.handle(this.onWorkoutExerciseTargetSetEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_DISCARDED_EVENT,
      deps.EventHandler.handle(this.onWorkoutDiscardedEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onWorkoutExerciseAddedEvent(event: Workouts.Events.WorkoutExerciseAddedEventType) {
    await db.insert(Schema.workoutExercises).values({
      id: event.payload.workoutExerciseId,
      workoutId: event.payload.workoutId,
      exerciseId: event.payload.exerciseId,
      exerciseName: event.payload.exerciseName,
      exerciseImageEtag: event.payload.exerciseImageEtag,
      prescriptionSets: event.payload.prescription.sets,
      prescriptionRepsMin: event.payload.prescription.reps.min,
      prescriptionRepsMax: event.payload.prescription.reps.max,
      userId: event.payload.requesterId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onWorkoutExerciseRemovedEvent(event: Workouts.Events.WorkoutExerciseRemovedEventType) {
    await db
      .delete(Schema.workoutExercises)
      .where(eq(Schema.workoutExercises.id, event.payload.workoutExerciseId));
  }

  async onWorkoutExerciseTargetSetEvent(event: Workouts.Events.WorkoutExerciseTargetSetEventType) {
    await db
      .update(Schema.workoutExercises)
      .set({
        targetSets: event.payload.target.sets,
        targetReps: event.payload.target.reps,
        targetLoad: event.payload.target.load,
        updatedAt: event.createdAt,
      })
      .where(eq(Schema.workoutExercises.id, event.payload.workoutExerciseId));
  }

  async onWorkoutDiscardedEvent(event: Workouts.Events.WorkoutDiscardedEventType) {
    await db
      .delete(Schema.workoutExercises)
      .where(eq(Schema.workoutExercises.workoutId, event.payload.workoutId));
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db.delete(Schema.workoutExercises).where(eq(Schema.workoutExercises.userId, event.payload.userId));
  }
}
