import type { ActionState } from "+action-state";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+workouts/value-objects";
import type { ExercisePerformance } from "./list-exercise-performances";

export type WorkoutExerciseActions = {
  targetSet: ActionState;
  remove: ActionState;
  setLog: ActionState;
};

export type LoggedSetActions = { correct: ActionState; remove: ActionState };

export type LoggedSet = VO.LoggedSetType & { actions: LoggedSetActions };

export type ExercisePreviousPerformance = Pick<ExercisePerformance, "scheduledFor" | "sets"> & {
  diff?: VO.ExerciseTargetDiff;
};

export type WorkoutExercise = Omit<VO.WorkoutExercise, "loggedSets"> & {
  exerciseImageEtag: Exercises.VO.Exercise["imageEtag"];
  exerciseDescription: Exercises.VO.Exercise["description"];
  loggedSets: Array<LoggedSet>;
  previousPerformance?: ExercisePreviousPerformance;
  actions: WorkoutExerciseActions;
};

export type WorkoutGetResponse = {
  data: Omit<VO.Workout, "exercises"> & { exercises: Array<WorkoutExercise> };
  actions: {
    start: ActionState;
    complete: ActionState;
    discard: ActionState;
    exerciseAdd: ActionState;
    noteSet: ActionState;
    reschedule: ActionState;
  };
};

export interface GetWorkout {
  execute(workoutId: VO.WorkoutIdType, userId: Auth.VO.UserIdType): Promise<WorkoutGetResponse | null>;
}
