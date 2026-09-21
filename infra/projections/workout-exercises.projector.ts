import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import { asc, eq } from "drizzle-orm";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Workouts.Events.WorkoutExerciseAddedEventType
    | Workouts.Events.WorkoutExerciseRemovedEventType
    | Workouts.Events.WorkoutExerciseMovedEventType
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
      Workouts.Events.WORKOUT_EXERCISE_MOVED_EVENT,
      deps.EventHandler.handle(this.onWorkoutExerciseMovedEvent.bind(this)),
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
    const siblings = await this.siblings(event.payload.workoutId);

    await db.insert(Schema.workoutExercises).values({
      id: event.payload.workoutExerciseId,
      workoutId: event.payload.workoutId,
      exerciseId: event.payload.exerciseId,
      exerciseName: event.payload.exerciseName,
      exerciseImageEtag: event.payload.exerciseImageEtag,
      exerciseDescription: event.payload.exerciseDescription,
      prescriptionSets: event.payload.prescription.sets,
      prescriptionRepsMin: event.payload.prescription.reps.min,
      prescriptionRepsMax: event.payload.prescription.reps.max,
      position: v.parse(Workouts.VO.WorkoutExercisePosition, siblings.length),
      userId: event.payload.requesterId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onWorkoutExerciseRemovedEvent(event: Workouts.Events.WorkoutExerciseRemovedEventType) {
    await db
      .delete(Schema.workoutExercises)
      .where(eq(Schema.workoutExercises.id, event.payload.workoutExerciseId));

    const siblings = await this.siblings(event.payload.workoutId);

    await this.reposition(siblings, event.createdAt);
  }

  async onWorkoutExerciseMovedEvent(event: Workouts.Events.WorkoutExerciseMovedEventType) {
    const siblings = await this.siblings(event.payload.workoutId);
    const others = siblings.filter((id) => id !== event.payload.workoutExerciseId);

    others.splice(event.payload.position, 0, event.payload.workoutExerciseId);

    await this.reposition(others, event.createdAt);
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

  private async siblings(workoutId: Workouts.VO.WorkoutIdType) {
    const rows = await db
      .select({ id: Schema.workoutExercises.id })
      .from(Schema.workoutExercises)
      .where(eq(Schema.workoutExercises.workoutId, workoutId))
      .orderBy(asc(Schema.workoutExercises.position));

    return rows.map((row) => row.id);
  }

  private async reposition(
    ids: Array<Workouts.VO.WorkoutExerciseIdType>,
    updatedAt: tools.TimestampValueType,
  ) {
    for (const [index, id] of ids.entries()) {
      await db
        .update(Schema.workoutExercises)
        .set({ position: v.parse(Workouts.VO.WorkoutExercisePosition, index), updatedAt })
        .where(eq(Schema.workoutExercises.id, id));
    }
  }
}
