import * as tools from "@bgord/tools";
import { and, asc, eq } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { GetExercisePreviousPerformanceQuery } from "./get-exercise-previous-performance.adapter";
import { GetWorkoutStatusForOwnerCountQuery } from "./get-workout-status-for-owner-count.adapter";

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

    const [exercises, loggedSets, inProgressCount] = await Promise.all([
      db
        .select()
        .from(Schema.workoutExercises)
        .where(
          and(eq(Schema.workoutExercises.workoutId, workoutId), eq(Schema.workoutExercises.userId, userId)),
        )
        .orderBy(asc(Schema.workoutExercises.position)),
      db
        .select()
        .from(Schema.workoutLoggedSets)
        .where(
          and(eq(Schema.workoutLoggedSets.workoutId, workoutId), eq(Schema.workoutLoggedSets.userId, userId)),
        )
        .orderBy(asc(Schema.workoutLoggedSets.setNumber)),
      GetWorkoutStatusForOwnerCountQuery.execute(userId, Workouts.VO.WorkoutStatusEnum.in_progress),
    ]);

    const previousPerformances = await Promise.all(
      exercises.map((exercise) =>
        GetExercisePreviousPerformanceQuery.execute(userId, exercise.exerciseId, workout),
      ),
    );

    const status = workout.status;
    const loggedSetActions = new Workouts.Services.WorkoutGetLoggedSetActions({
      status,
      loggedSetCount: tools.Int.nonNegative(loggedSets.length),
    }).calculate();

    const data = {
      id: workout.id,
      planId: workout.planId,
      planName: workout.planName,
      planSectionId: workout.planSectionId,
      planSectionName: workout.planSectionName,
      planSectionWarmup: workout.planSectionWarmup ?? undefined,
      planSectionCooldown: workout.planSectionCooldown ?? undefined,
      scheduledFor: workout.scheduledFor,
      status,
      completedAt: workout.completedAt ?? undefined,
      note: workout.note ?? undefined,
      revision: workout.revision,
      exercises: exercises.map((exercise, index) => {
        const target =
          exercise.targetSets === null
            ? undefined
            : v.parse(Workouts.VO.ExerciseTarget, {
                sets: exercise.targetSets,
                reps: exercise.targetReps,
                load: exercise.targetLoad,
              });

        const prescription = v.parse(Workouts.VO.ExercisePrescription, {
          sets: exercise.prescriptionSets,
          reps: { min: exercise.prescriptionRepsMin, max: exercise.prescriptionRepsMax },
          progression: exercise.prescriptionProgression,
        });

        const previous = previousPerformances[index];

        return {
          id: exercise.id,
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          exerciseImageEtag: exercise.exerciseImageEtag,
          exerciseDescription: exercise.exerciseDescription,
          prescription,
          target,
          loggedSets: loggedSets
            .filter((loggedSet) => loggedSet.workoutExerciseId === exercise.id)
            .map((loggedSet) => ({
              id: loggedSet.id,
              setNumber: loggedSet.setNumber,
              reps: loggedSet.reps,
              load: loggedSet.load,
              rir: loggedSet.rir ?? undefined,
              actions: loggedSetActions,
            })),
          previousPerformance: previous && {
            scheduledFor: previous.scheduledFor,
            sets: previous.sets,
            diff: target && new Workouts.Services.ExerciseTargetDiffCalculator(target, previous).calculate(),
          },
          targetProgression:
            previous &&
            Workouts.Services.ProgressionMethodStrategyFactory.for(prescription, previous).calculate(),
          actions: new Workouts.Services.WorkoutGetExerciseActions({
            status,
            exercise: { target },
          }).calculate(),
        };
      }),
    };

    return {
      data,
      actions: new Workouts.Services.WorkoutGetActions({
        status,
        exercises: data.exercises,
        inProgressCount,
      }).calculate(),
    };
  }
}

export const GetWorkoutQuery = new GetWorkoutQueryDrizzle();
