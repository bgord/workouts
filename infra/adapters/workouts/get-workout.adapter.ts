import type * as bg from "@bgord/bun";
import { and, asc, eq } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetWorkoutQueryDrizzle implements Workouts.Queries.GetWorkout {
  async execute(
    workoutId: Workouts.VO.WorkoutIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Workouts.Queries.WorkoutGetResponse | null> {
    const workout = await db
      .select()
      .from(Schema.workouts)
      .where(and(eq(Schema.workouts.id, workoutId), eq(Schema.workouts.userId, userId)))
      .get();

    if (!workout) return null;

    const exercises = await db
      .select()
      .from(Schema.workoutExercises)
      .where(
        and(eq(Schema.workoutExercises.workoutId, workoutId), eq(Schema.workoutExercises.userId, userId)),
      )
      .orderBy(asc(Schema.workoutExercises.createdAt));

    const loggedSets = await db
      .select()
      .from(Schema.workoutLoggedSets)
      .where(
        and(eq(Schema.workoutLoggedSets.workoutId, workoutId), eq(Schema.workoutLoggedSets.userId, userId)),
      )
      .orderBy(asc(Schema.workoutLoggedSets.setNumber));

    const data = {
      id: workout.id,
      planId: workout.planId,
      planName: workout.planName,
      planSectionId: workout.planSectionId,
      planSectionName: workout.planSectionName,
      scheduledFor: workout.scheduledFor,
      status: workout.status,
      revision: workout.revision,
      exercises: exercises.map((exercise) => ({
        id: exercise.id,
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        prescription: v.parse(Workouts.VO.ExercisePrescription, {
          sets: exercise.prescriptionSets,
          reps: { min: exercise.prescriptionRepsMin, max: exercise.prescriptionRepsMax },
        }),
        target:
          exercise.targetSets === null
            ? undefined
            : v.parse(Workouts.VO.ExerciseTarget, {
                sets: exercise.targetSets,
                reps: exercise.targetReps,
                load: exercise.targetLoad,
              }),
        loggedSets: loggedSets
          .filter((loggedSet) => loggedSet.workoutExerciseId === exercise.id)
          .map((loggedSet) => ({
            id: loggedSet.id,
            setNumber: loggedSet.setNumber,
            reps: loggedSet.reps,
            load: loggedSet.load,
          })),
      })),
    };

    const inProgress = Workouts.Invariants.WorkoutIsInProgress.passes({ status: workout.status });
    const hasLoggedSets = Workouts.Invariants.WorkoutHasLoggedSets.passes({
      workoutExercises: data.exercises,
    });

    const completeBlockers: Array<bg.TranslationsKeyType> = [];

    if (inProgress && !hasLoggedSets) completeBlockers.push("workout.complete.blocked.no_logged_sets");

    return {
      data,
      actions: { complete: { enabled: inProgress && hasLoggedSets, hints: completeBlockers } },
    };
  }
}

export const GetWorkoutQuery = new GetWorkoutQueryDrizzle();
