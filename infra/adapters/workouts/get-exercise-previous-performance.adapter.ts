import { and, asc, desc, eq, lt, or } from "drizzle-orm";
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
  ): Promise<Pick<Workouts.Queries.ExercisePerformance, "scheduledFor" | "sets"> | undefined> {
    const previous = await db
      .select({ scheduledFor: Schema.workouts.scheduledFor, workoutExerciseId: Schema.workoutExercises.id })
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
          or(
            lt(Schema.workouts.scheduledFor, workout.scheduledFor),
            and(
              eq(Schema.workouts.scheduledFor, workout.scheduledFor),
              workout.completedAt === null ? undefined : lt(Schema.workouts.completedAt, workout.completedAt),
            ),
          ),
        ),
      )
      .orderBy(
        desc(Schema.workouts.scheduledFor),
        desc(Schema.workouts.completedAt),
        asc(Schema.workoutExercises.position),
      )
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
      .where(eq(Schema.workoutLoggedSets.workoutExerciseId, previous.workoutExerciseId))
      .orderBy(asc(Schema.workoutLoggedSets.setNumber));

    return { scheduledFor: previous.scheduledFor, sets };
  }
}

export const GetExercisePreviousPerformanceQuery = new GetExercisePreviousPerformanceQueryDrizzle();
