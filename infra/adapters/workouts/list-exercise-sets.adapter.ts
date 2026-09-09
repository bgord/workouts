import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExerciseSetsQueryDrizzle implements Workouts.Queries.ListExerciseSets {
  async execute(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<Array<Workouts.Queries.ExerciseSet>> {
    return db
      .select({
        id: Schema.workoutLoggedSets.id,
        workoutId: Schema.workoutLoggedSets.workoutId,
        reps: Schema.workoutLoggedSets.reps,
        load: Schema.workoutLoggedSets.load,
      })
      .from(Schema.workoutLoggedSets)
      .innerJoin(
        Schema.workoutExercises,
        eq(Schema.workoutLoggedSets.workoutExerciseId, Schema.workoutExercises.id),
      )
      .where(
        and(eq(Schema.workoutLoggedSets.userId, userId), eq(Schema.workoutExercises.exerciseId, exerciseId)),
      );
  }
}

export const ListExerciseSetsQuery = new ListExerciseSetsQueryDrizzle();
