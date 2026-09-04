import type * as bg from "@bgord/bun";
import { asc, eq } from "drizzle-orm";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Workouts.Events.WorkoutSetLoggedEventType
    | Workouts.Events.WorkoutSetCorrectedEventType
    | Workouts.Events.WorkoutSetRemovedEventType
    | Workouts.Events.WorkoutDiscardedEventType
    | Auth.Events.AccountDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class WorkoutLoggedSetsProjector {
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
      Workouts.Events.WORKOUT_DISCARDED_EVENT,
      deps.EventHandler.handle(this.onWorkoutDiscardedEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onWorkoutSetLoggedEvent(event: Workouts.Events.WorkoutSetLoggedEventType) {
    await db.insert(Schema.workoutLoggedSets).values({
      id: event.payload.loggedSet.id,
      workoutExerciseId: event.payload.workoutExerciseId,
      setNumber: event.payload.loggedSet.setNumber,
      workoutId: event.payload.workoutId,
      reps: event.payload.loggedSet.reps,
      load: event.payload.loggedSet.load,
      userId: event.payload.requesterId,
      createdAt: event.createdAt,
    });
  }

  async onWorkoutSetCorrectedEvent(event: Workouts.Events.WorkoutSetCorrectedEventType) {
    await db
      .update(Schema.workoutLoggedSets)
      .set({ reps: event.payload.loggedSet.reps, load: event.payload.loggedSet.load })
      .where(eq(Schema.workoutLoggedSets.id, event.payload.loggedSet.id));
  }

  async onWorkoutSetRemovedEvent(event: Workouts.Events.WorkoutSetRemovedEventType) {
    await db
      .delete(Schema.workoutLoggedSets)
      .where(eq(Schema.workoutLoggedSets.id, event.payload.loggedSetId));

    const remaining = await db
      .select()
      .from(Schema.workoutLoggedSets)
      .where(eq(Schema.workoutLoggedSets.workoutExerciseId, event.payload.workoutExerciseId))
      .orderBy(asc(Schema.workoutLoggedSets.setNumber));

    for (const [index, loggedSet] of remaining.entries()) {
      await db
        .update(Schema.workoutLoggedSets)
        .set({ setNumber: v.parse(Workouts.VO.SetNumber, index + 1) })
        .where(eq(Schema.workoutLoggedSets.id, loggedSet.id));
    }
  }

  async onWorkoutDiscardedEvent(event: Workouts.Events.WorkoutDiscardedEventType) {
    await db
      .delete(Schema.workoutLoggedSets)
      .where(eq(Schema.workoutLoggedSets.workoutId, event.payload.workoutId));
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db
      .delete(Schema.workoutLoggedSets)
      .where(eq(Schema.workoutLoggedSets.userId, event.payload.userId));
  }
}
