import type * as bg from "@bgord/bun";
import { asc, eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Stats from "+stats";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

const row = (session: Stats.Services.MeasuredExerciseSession) => ({
  userId: session.userId,
  exerciseId: session.exerciseId,
  workoutId: session.workoutId,
  completedAt: session.completedAt,
  sets: session.sets,
  volume: session.volume,
  oneRepMaxEstimate: session.estimated?.oneRepMaxEstimate ?? null,
  oneRepMaxEstimateReps: session.estimated?.reps ?? null,
  oneRepMaxEstimateLoad: session.estimated?.load ?? null,
  topSetReps: session.topSet.reps,
  topSetLoad: session.topSet.load,
});

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Workouts.Events.WorkoutSetCorrectedEventType
    | Workouts.Events.WorkoutSetRemovedEventType
    | Workouts.Events.WorkoutExerciseRemovedEventType
    | Workouts.Events.WorkoutCompletedEventType
    | Workouts.Events.WorkoutDiscardedEventType
    | Auth.Events.AccountDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
  ExerciseSessions: Stats.Services.ExerciseSessions;
};

export class StatsExerciseSetsProjector {
  constructor(private readonly deps: Dependencies) {
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

  async onWorkoutSetCorrectedEvent(event: Workouts.Events.WorkoutSetCorrectedEventType) {
    await db
      .update(Schema.statsExerciseSets)
      .set({ reps: event.payload.loggedSet.reps, load: event.payload.loggedSet.load })
      .where(eq(Schema.statsExerciseSets.id, event.payload.loggedSet.id));

    await this.recompute(event.payload.workoutId);
  }

  async onWorkoutSetRemovedEvent(event: Workouts.Events.WorkoutSetRemovedEventType) {
    await db
      .delete(Schema.statsExerciseSets)
      .where(eq(Schema.statsExerciseSets.id, event.payload.loggedSetId));

    await this.recompute(event.payload.workoutId);
  }

  async onWorkoutExerciseRemovedEvent(event: Workouts.Events.WorkoutExerciseRemovedEventType) {
    await db
      .delete(Schema.statsExerciseSets)
      .where(eq(Schema.statsExerciseSets.workoutExerciseId, event.payload.workoutExerciseId));

    await this.recompute(event.payload.workoutId);
  }

  async onWorkoutCompletedEvent(event: Workouts.Events.WorkoutCompletedEventType) {
    const loggedSets = await db
      .select({
        id: Schema.workoutLoggedSets.id,
        userId: Schema.workoutLoggedSets.userId,
        exerciseId: Schema.workoutExercises.exerciseId,
        workoutId: Schema.workoutLoggedSets.workoutId,
        workoutExerciseId: Schema.workoutLoggedSets.workoutExerciseId,
        reps: Schema.workoutLoggedSets.reps,
        load: Schema.workoutLoggedSets.load,
        loggedAt: Schema.workoutLoggedSets.createdAt,
      })
      .from(Schema.workoutLoggedSets)
      .innerJoin(
        Schema.workoutExercises,
        eq(Schema.workoutExercises.id, Schema.workoutLoggedSets.workoutExerciseId),
      )
      .where(eq(Schema.workoutLoggedSets.workoutId, event.payload.workoutId));

    if (loggedSets.length === 0) return;

    await db
      .insert(Schema.statsExerciseSets)
      .values(loggedSets.map((loggedSet) => ({ ...loggedSet, completedAt: event.createdAt })));

    await this.recompute(event.payload.workoutId);
  }

  async onWorkoutDiscardedEvent(event: Workouts.Events.WorkoutDiscardedEventType) {
    await db
      .delete(Schema.statsExerciseSets)
      .where(eq(Schema.statsExerciseSets.workoutId, event.payload.workoutId));

    await db
      .delete(Schema.statsExerciseSessions)
      .where(eq(Schema.statsExerciseSessions.workoutId, event.payload.workoutId));
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db
      .delete(Schema.statsExerciseSets)
      .where(eq(Schema.statsExerciseSets.userId, event.payload.userId));

    await db
      .delete(Schema.statsExerciseSessions)
      .where(eq(Schema.statsExerciseSessions.userId, event.payload.userId));
  }

  private async recompute(workoutId: Workouts.VO.WorkoutIdType) {
    const sets = await db
      .select({
        userId: Schema.statsExerciseSets.userId,
        exerciseId: Schema.statsExerciseSets.exerciseId,
        workoutId: Schema.statsExerciseSets.workoutId,
        completedAt: Schema.statsExerciseSets.completedAt,
        reps: Schema.statsExerciseSets.reps,
        load: Schema.statsExerciseSets.load,
      })
      .from(Schema.statsExerciseSets)
      .where(eq(Schema.statsExerciseSets.workoutId, workoutId))
      .orderBy(asc(Schema.statsExerciseSets.loggedAt));

    await db
      .delete(Schema.statsExerciseSessions)
      .where(eq(Schema.statsExerciseSessions.workoutId, workoutId));

    if (sets.length === 0) return;

    await db.insert(Schema.statsExerciseSessions).values(this.deps.ExerciseSessions.from(sets).map(row));
  }
}
