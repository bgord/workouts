import type * as bg from "@bgord/bun";
import { eq, lt } from "drizzle-orm";
import * as Auth from "+auth";
import type * as Statistics from "+statistics";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Workouts.Events.WorkoutSetLoggedEventType
    | Workouts.Events.WorkoutSetCorrectedEventType
    | Auth.Events.AccountDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
  OneRepEstimator: Statistics.Ports.OneRepEstimatorPort;
};

export class StatisticsExerciseOneRepMaxEstimatesProjector {
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      Workouts.Events.WORKOUT_SET_LOGGED_EVENT,
      deps.EventHandler.handle(this.onWorkoutSetLoggedEvent.bind(this)),
    );
    deps.EventBus.on(
      Workouts.Events.WORKOUT_SET_CORRECTED_EVENT,
      deps.EventHandler.handle(this.onWorkoutSetCorrectedEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onWorkoutSetLoggedEvent(event: Workouts.Events.WorkoutSetLoggedEventType) {
    await this.consider(event);
  }

  async onWorkoutSetCorrectedEvent(event: Workouts.Events.WorkoutSetCorrectedEventType) {
    await this.consider(event);
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db
      .delete(Schema.statisticsExerciseOneRepMaxEstimates)
      .where(eq(Schema.statisticsExerciseOneRepMaxEstimates.userId, event.payload.userId));
  }

  private async consider(
    event: Workouts.Events.WorkoutSetLoggedEventType | Workouts.Events.WorkoutSetCorrectedEventType,
  ) {
    const estimate = this.deps.OneRepEstimator.estimate(event.payload.loggedSet);

    await db
      .insert(Schema.statisticsExerciseOneRepMaxEstimates)
      .values({
        exerciseId: event.payload.exerciseId,
        workoutId: event.payload.workoutId,
        loggedSetId: event.payload.loggedSet.id,
        estimate,
        userId: event.payload.requesterId,
        createdAt: event.createdAt,
        updatedAt: event.createdAt,
      })
      .onConflictDoUpdate({
        target: [
          Schema.statisticsExerciseOneRepMaxEstimates.userId,
          Schema.statisticsExerciseOneRepMaxEstimates.exerciseId,
        ],
        set: {
          workoutId: event.payload.workoutId,
          loggedSetId: event.payload.loggedSet.id,
          estimate,
          updatedAt: event.createdAt,
        },
        setWhere: lt(Schema.statisticsExerciseOneRepMaxEstimates.estimate, estimate),
      });
  }
}
