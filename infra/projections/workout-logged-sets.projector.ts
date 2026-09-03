import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<Workouts.Events.WorkoutSetLoggedEventType | Auth.Events.AccountDeletedEventType>;
  EventHandler: bg.EventHandlerStrategy;
};

export class WorkoutLoggedSetsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Workouts.Events.WORKOUT_SET_LOGGED_EVENT,
      deps.EventHandler.handle(this.onWorkoutSetLoggedEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onWorkoutSetLoggedEvent(event: Workouts.Events.WorkoutSetLoggedEventType) {
    await db.insert(Schema.workoutLoggedSets).values({
      workoutExerciseId: event.payload.workoutExerciseId,
      setNumber: event.payload.loggedSet.setNumber,
      workoutId: event.payload.workoutId,
      reps: event.payload.loggedSet.reps,
      load: event.payload.loggedSet.load,
      userId: event.payload.requesterId,
      createdAt: event.createdAt,
    });
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db
      .delete(Schema.workoutLoggedSets)
      .where(eq(Schema.workoutLoggedSets.userId, event.payload.userId));
  }
}
