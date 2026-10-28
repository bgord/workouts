import * as tools from "@bgord/tools";
import * as Exercises from "+exercises";
import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";
import { ExercisePrescriptionMissed } from "./exercise-prescription-missed";
import { ExerciseTargetDiffCalculator } from "./exercise-target-diff-calculator";
import { ProgressionMethodStrategyFactory } from "./progression-method-factory.strategy";
import { RirBelowTarget } from "./rir-below-target";
import { WorkoutGetActions } from "./workout-get-actions";
import { WorkoutGetExerciseActions } from "./workout-get-exercise-actions";
import { WorkoutGetLoggedSetActions } from "./workout-get-logged-set-actions";
import { WorkoutProgress } from "./workout-progress";

type WorkoutGetViewExercise = Omit<VO.WorkoutExercise, "target" | "loggedSets"> & {
  target: VO.ExerciseTargetType | null;
  exerciseDescription: VO.WorkoutExerciseDescriptionType;
  loggedSets: Array<Omit<VO.LoggedSetType, "rir"> & { rir: VO.RirType | null }>;
  exercise: Pick<Exercises.VO.Exercise, "imageEtag" | "loadStep"> | null;
  previous: Pick<Queries.ExercisePerformance, "scheduledFor" | "sets"> | null;
  recent: Array<Queries.ExerciseRecentPerformance>;
};

type WorkoutGetViewFacts = {
  workout: Omit<VO.WorkoutSnapshot, "exercises"> & { exercises: Array<WorkoutGetViewExercise> };
  inProgressCount: tools.IntegerNonNegativeType;
};

export class WorkoutGetView {
  constructor(private readonly facts: WorkoutGetViewFacts) {}

  calculate(): Queries.WorkoutGetResponse {
    const { workout, inProgressCount } = this.facts;

    const data = {
      ...workout,
      exercises: workout.exercises.map(({ exercise: catalogExercise, previous, recent, ...exercise }) => ({
        ...exercise,
        exerciseImageEtag: catalogExercise?.imageEtag ?? null,
        loggedSets: exercise.loggedSets.map((loggedSet) => ({
          ...loggedSet,
          rirBelowTarget: new RirBelowTarget({
            target: exercise.prescription.rir,
            rir: loggedSet.rir,
          }).calculate(),
          actions: new WorkoutGetLoggedSetActions({
            status: workout.status,
            loggedSetCount: tools.Int.nonNegative(
              workout.exercises.flatMap((exercise) => exercise.loggedSets).length,
            ),
          }).calculate(),
        })),
        previousPerformance: previous && {
          scheduledFor: previous.scheduledFor,
          sets: previous.sets,
          diff: exercise.target && new ExerciseTargetDiffCalculator(exercise.target, previous).calculate(),
        },
        recentPerformances: recent.map((performance) => ({
          workoutId: performance.workoutId,
          scheduledFor: performance.scheduledFor,
          sets: performance.sets,
          missed: new ExercisePrescriptionMissed({
            prescription: performance.prescription,
            performance,
          }).calculate(),
        })),
        targetProgression:
          previous &&
          ProgressionMethodStrategyFactory.for(
            exercise.prescription,
            catalogExercise?.loadStep ?? Exercises.VO.ExerciseLoadStepOptions.none,
            previous,
            { scheduledFor: workout.scheduledFor, performances: recent },
          ).calculate(),
        actions: new WorkoutGetExerciseActions({
          status: workout.status,
          exercises: workout.exercises,
          exercise,
          catalogExerciseExists: catalogExercise !== null,
        }).calculate(),
      })),
    };

    return {
      data,
      progress: new WorkoutProgress({ exercises: workout.exercises }).calculate(),
      actions: new WorkoutGetActions({
        status: workout.status,
        exercises: data.exercises,
        inProgressCount,
      }).calculate(),
    };
  }
}
