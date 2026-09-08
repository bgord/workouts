import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Workouts.Events.WorkoutSetLoggedEventType
    | Workouts.Events.WorkoutSetCorrectedEventType
    | Workouts.Events.WorkoutSetRemovedEventType
    | Workouts.Events.WorkoutExerciseRemovedEventType
    | Workouts.Events.WorkoutCompletedEventType
    | Workouts.Events.WorkoutDiscardedEventType
    | Auth.Events.AccountDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class StatsExerciseSetsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Workouts.Events.WORKOUT_SET_LOGGED_EVENT,
      deps.EventHandler.handle(this.onWorkoutSetLoggedEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_SET_CORRECTED_EVENT,
      deps.EventHandler.handle(this.onWorkoutSetCorrectedEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_SET_REMOVED_EVENT,
      deps.EventHandler.handle(this.onWorkoutSetRemovedEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_EXERCISE_REMOVED_EVENT,
      deps.EventHandler.handle(this.onWorkoutExerciseRemovedEvent.bind(this)),
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
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onWorkoutSetLoggedEvent(event: Workouts.Events.WorkoutSetLoggedEventType) {
    await db.insert(Schema.statsExerciseSets).values({
      id: event.payload.loggedSet.id,
      userId: event.payload.requesterId,
      exerciseId: event.payload.exerciseId,
      workoutId: event.payload.workoutId,
      workoutExerciseId: event.payload.workoutExerciseId,
      reps: event.payload.loggedSet.reps,
      load: event.payload.loggedSet.load,
      loggedAt: event.createdAt,
    });
  }

  async onWorkoutSetCorrectedEvent(event: Workouts.Events.WorkoutSetCorrectedEventType) {
    await db
      .update(Schema.statsExerciseSets)
      .set({ reps: event.payload.loggedSet.reps, load: event.payload.loggedSet.load })
      .where(eq(Schema.statsExerciseSets.id, event.payload.loggedSet.id));
  }

  async onWorkoutSetRemovedEvent(event: Workouts.Events.WorkoutSetRemovedEventType) {
    await db
      .delete(Schema.statsExerciseSets)
      .where(eq(Schema.statsExerciseSets.id, event.payload.loggedSetId));
  }

  async onWorkoutExerciseRemovedEvent(event: Workouts.Events.WorkoutExerciseRemovedEventType) {
    await db
      .delete(Schema.statsExerciseSets)
      .where(eq(Schema.statsExerciseSets.workoutExerciseId, event.payload.workoutExerciseId));
  }

  async onWorkoutCompletedEvent(event: Workouts.Events.WorkoutCompletedEventType) {
    await db
      .update(Schema.statsExerciseSets)
      .set({ completedAt: event.createdAt })
      .where(eq(Schema.statsExerciseSets.workoutId, event.payload.workoutId));
  }

  async onWorkoutDiscardedEvent(event: Workouts.Events.WorkoutDiscardedEventType) {
    await db
      .delete(Schema.statsExerciseSets)
      .where(eq(Schema.statsExerciseSets.workoutId, event.payload.workoutId));
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db
      .delete(Schema.statsExerciseSets)
      .where(eq(Schema.statsExerciseSets.userId, event.payload.userId));
  }
}
