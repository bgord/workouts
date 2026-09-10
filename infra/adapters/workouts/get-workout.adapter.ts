import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
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

    const [exercises, loggedSets, inProgressCount] = await Promise.all([
      db
        .select()
        .from(Schema.workoutExercises)
        .where(
          and(eq(Schema.workoutExercises.workoutId, workoutId), eq(Schema.workoutExercises.userId, userId)),
        )
        .orderBy(asc(Schema.workoutExercises.createdAt)),
      db
        .select()
        .from(Schema.workoutLoggedSets)
        .where(
          and(eq(Schema.workoutLoggedSets.workoutId, workoutId), eq(Schema.workoutLoggedSets.userId, userId)),
        )
        .orderBy(asc(Schema.workoutLoggedSets.setNumber)),
      db.$count(
        Schema.workouts,
        and(
          eq(Schema.workouts.userId, userId),
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.in_progress),
        ),
      ),
    ]);

    const status = workout.status;

    const draft = Workouts.Invariants.WorkoutIsDraft.passes({ status });
    const editable = Workouts.Invariants.WorkoutIsEditable.passes({ status });
    const inProgress = Workouts.Invariants.WorkoutIsInProgress.passes({ status });
    const correctable = Workouts.Invariants.WorkoutIsCorrectable.passes({ status });
    const exists = Workouts.Invariants.WorkoutExists.passes({ status });
    const retainsLoggedSets = Workouts.Invariants.WorkoutRetainsLoggedSets.passes({
      status,
      count: tools.Int.nonNegative(loggedSets.length),
    });
    const inProgressAvailable = Workouts.Invariants.WorkoutInProgressLimitForOwner.passes({
      count: tools.Int.nonNegative(inProgressCount),
    });

    const setRemoveBlockers: Array<bg.TranslationsKeyType> = [];

    if (correctable && !retainsLoggedSets) setRemoveBlockers.push("workout.set.remove.blocked.last_set");

    const whenEditable = { available: editable, enabled: editable, hints: [] };
    const whenInProgress = { available: inProgress, enabled: inProgress, hints: [] };
    const whenCorrectable = { available: correctable, enabled: correctable, hints: [] };
    const setRemove = {
      available: correctable,
      enabled: correctable && retainsLoggedSets,
      hints: setRemoveBlockers,
    };

    const data = {
      id: workout.id,
      planId: workout.planId,
      planName: workout.planName,
      planSectionId: workout.planSectionId,
      planSectionName: workout.planSectionName,
      scheduledFor: workout.scheduledFor,
      status,
      completedAt: workout.completedAt ?? undefined,
      note: workout.note ?? undefined,
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
            rir: loggedSet.rir ?? undefined,
            actions: { correct: whenCorrectable, remove: setRemove },
          })),
        actions: { targetSet: whenEditable, remove: whenEditable, setLog: whenInProgress },
      })),
    };

    const workoutExercises = data.exercises;

    const hasExercises = workoutExercises.length > 0;
    const readyToStart = Workouts.Invariants.WorkoutIsReadyToStart.passes({ workoutExercises });
    const hasLoggedSets = Workouts.Invariants.WorkoutHasLoggedSets.passes({ workoutExercises });
    const exercisesAvailable = Workouts.Invariants.WorkoutExerciseLimit.passes({ workoutExercises });

    const startBlockers: Array<bg.TranslationsKeyType> = [];
    const completeBlockers: Array<bg.TranslationsKeyType> = [];
    const exerciseAddBlockers: Array<bg.TranslationsKeyType> = [];

    if (draft && !hasExercises) startBlockers.push("workout.start.blocked.no_exercises");
    if (draft && hasExercises && !readyToStart) startBlockers.push("workout.start.blocked.missing_target");
    if (draft && !inProgressAvailable) startBlockers.push("workout.start.blocked.in_progress_limit");
    if (inProgress && !hasLoggedSets) completeBlockers.push("workout.complete.blocked.no_logged_sets");
    if (editable && !exercisesAvailable) exerciseAddBlockers.push("workout.exercise.add.blocked.limit");

    return {
      data,
      actions: {
        start: {
          available: draft,
          enabled: draft && readyToStart && inProgressAvailable,
          hints: startBlockers,
        },
        complete: { available: inProgress, enabled: inProgress && hasLoggedSets, hints: completeBlockers },
        discard: { available: exists, enabled: exists, hints: [] },
        exerciseAdd: {
          available: editable,
          enabled: editable && exercisesAvailable,
          hints: exerciseAddBlockers,
        },
        noteSet: { available: exists, enabled: exists, hints: [] },
        reschedule: { available: draft, enabled: draft, hints: [] },
      },
    };
  }
}

export const GetWorkoutQuery = new GetWorkoutQueryDrizzle();
