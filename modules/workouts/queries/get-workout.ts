import type { ActionState } from "+action-state";
import type * as Auth from "+auth";
import type * as VO from "+workouts/value-objects";

export type WorkoutExerciseActions = {
  targetSet: ActionState;
  remove: ActionState;
  setLog: ActionState;
};

export type LoggedSetActions = { correct: ActionState; remove: ActionState };

export type LoggedSet = VO.LoggedSetType & { actions: LoggedSetActions };

export type WorkoutExercise = Omit<VO.WorkoutExercise, "loggedSets"> & {
  loggedSets: Array<LoggedSet>;
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
