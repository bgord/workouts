import { and, asc, desc, eq, isNotNull, lte, ne } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExercisePreviousPerformanceQueryDrizzle implements Workouts.Queries.GetExercisePreviousPerformance {
  async execute(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
    workout: Workouts.Queries.ExercisePreviousPerformanceReference,
  ): Promise<Workouts.Queries.ExercisePerformance | undefined> {
    const previous = await db
      .select({ id: Schema.workouts.id, scheduledFor: Schema.workouts.scheduledFor })
      .from(Schema.workouts)
      .innerJoin(Schema.workoutExercises, eq(Schema.workoutExercises.workoutId, Schema.workouts.id))
      .innerJoin(
        Schema.workoutLoggedSets,
        eq(Schema.workoutLoggedSets.workoutExerciseId, Schema.workoutExercises.id),
      )
      .where(
        and(
          eq(Schema.workouts.userId, userId),
          eq(Schema.workoutExercises.exerciseId, exerciseId),
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
          isNotNull(Schema.workouts.completedAt),
          ne(Schema.workouts.id, workout.id),
          lte(Schema.workouts.scheduledFor, workout.scheduledFor),
        ),
      )
      .orderBy(desc(Schema.workouts.scheduledFor), desc(Schema.workouts.completedAt))
      .get();

    if (!previous) return undefined;

    const sets = await db
      .select({
        setNumber: Schema.workoutLoggedSets.setNumber,
        reps: Schema.workoutLoggedSets.reps,
        load: Schema.workoutLoggedSets.load,
        rir: Schema.workoutLoggedSets.rir,
      })
      .from(Schema.workoutLoggedSets)
      .innerJoin(
        Schema.workoutExercises,
        eq(Schema.workoutLoggedSets.workoutExerciseId, Schema.workoutExercises.id),
      )
      .where(
        and(
          eq(Schema.workoutLoggedSets.userId, userId),
          eq(Schema.workoutLoggedSets.workoutId, previous.id),
          eq(Schema.workoutExercises.exerciseId, exerciseId),
        ),
      )
      .orderBy(asc(Schema.workoutLoggedSets.setNumber));

    return {
      workoutId: previous.id,
      scheduledFor: previous.scheduledFor,
      sets: sets.map((set) => ({
        setNumber: set.setNumber,
        reps: set.reps,
        load: set.load,
        rir: set.rir ?? undefined,
      })),
    };
  }
}

export const GetExercisePreviousPerformanceQuery = new GetExercisePreviousPerformanceQueryDrizzle();
