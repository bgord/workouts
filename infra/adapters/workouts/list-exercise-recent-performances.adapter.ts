import type * as tools from "@bgord/tools";
import { and, asc, desc, eq, inArray, lt, or } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExerciseRecentPerformancesQueryDrizzle implements Workouts.Queries.ListExerciseRecentPerformances {
  async execute(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
    workout: Workouts.Queries.ExercisePreviousPerformanceReference,
    limit: tools.IntegerPositiveType,
  ): Promise<Array<Workouts.Queries.ExerciseRecentPerformance>> {
    const recent = await db
      .selectDistinct({
        id: Schema.workouts.id,
        scheduledFor: Schema.workouts.scheduledFor,
        completedAt: Schema.workouts.completedAt,
      })
      .from(Schema.workouts)
      .innerJoin(Schema.workoutExercises, eq(Schema.workoutExercises.workoutId, Schema.workouts.id))
      .where(
        and(
          eq(Schema.workouts.userId, userId),
          eq(Schema.workoutExercises.userId, userId),
          eq(Schema.workoutExercises.exerciseId, exerciseId),
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
          eq(Schema.workouts.planSectionId, workout.planSectionId),
          or(
            lt(Schema.workouts.scheduledFor, workout.scheduledFor),
            and(
              eq(Schema.workouts.scheduledFor, workout.scheduledFor),
              workout.completedAt === null ? undefined : lt(Schema.workouts.completedAt, workout.completedAt),
            ),
          ),
        ),
      )
      .orderBy(desc(Schema.workouts.scheduledFor), desc(Schema.workouts.completedAt))
      .limit(limit);

    if (recent.length === 0) return [];

    const rows = await db
      .select({
        workoutId: Schema.workoutExercises.workoutId,
        workoutExerciseId: Schema.workoutExercises.id,
        prescription: Schema.workoutExercises.prescription,
        set: {
          setNumber: Schema.workoutLoggedSets.setNumber,
          reps: Schema.workoutLoggedSets.reps,
          load: Schema.workoutLoggedSets.load,
          rir: Schema.workoutLoggedSets.rir,
        },
      })
      .from(Schema.workoutExercises)
      .leftJoin(
        Schema.workoutLoggedSets,
        eq(Schema.workoutLoggedSets.workoutExerciseId, Schema.workoutExercises.id),
      )
      .where(
        and(
          eq(Schema.workoutExercises.userId, userId),
          eq(Schema.workoutExercises.exerciseId, exerciseId),
          inArray(
            Schema.workoutExercises.workoutId,
            recent.map((workout) => workout.id),
          ),
        ),
      )
      .orderBy(asc(Schema.workoutExercises.position), asc(Schema.workoutLoggedSets.setNumber));

    return recent.map((workout) => {
      const exercises = rows.filter((row) => row.workoutId === workout.id);
      const first = exercises.find((row) => row.set !== null) ?? exercises[0]!;

      return {
        scheduledFor: workout.scheduledFor,
        prescription: first.prescription,
        sets: exercises
          .filter((row) => row.workoutExerciseId === first.workoutExerciseId)
          .flatMap((row) => (row.set === null ? [] : [row.set])),
      };
    });
  }
}

export const ListExerciseRecentPerformancesQuery = new ListExerciseRecentPerformancesQueryDrizzle();
