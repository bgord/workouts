import type * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+workouts/value-objects";
import type { ExercisePerformance } from "./list-exercise-performances";

export type WorkoutExerciseActions = {
  targetSet: bg.ActionState;
  remove: bg.ActionState;
  moveUp: bg.ActionState;
  moveDown: bg.ActionState;
  setLog: bg.ActionState;
};

export type LoggedSetActions = { correct: bg.ActionState; remove: bg.ActionState };

export type LoggedSet = Omit<VO.LoggedSetType, "rir"> & { rir: VO.RirType | null; actions: LoggedSetActions };

export type ExercisePreviousPerformance = Pick<ExercisePerformance, "scheduledFor" | "sets"> & {
  diff: VO.ExerciseTargetDiff | null;
};

export type WorkoutExercise = Omit<VO.WorkoutExercise, "target" | "loggedSets"> & {
  target: VO.ExerciseTargetType | null;
  exerciseImageEtag: Exercises.VO.Exercise["imageEtag"];
  exerciseDescription: Exercises.VO.Exercise["description"];
  loggedSets: Array<LoggedSet>;
  previousPerformance: ExercisePreviousPerformance | null;
  targetProgression: VO.ExerciseTargetProgression | null;
  actions: WorkoutExerciseActions;
};

export type WorkoutGetResponse = {
  data: Omit<VO.Workout, "exercises"> & { exercises: Array<WorkoutExercise> };
  actions: {
    start: bg.ActionState;
    complete: bg.ActionState;
    discard: bg.ActionState;
    exerciseAdd: bg.ActionState;
    noteSet: bg.ActionState;
    reschedule: bg.ActionState;
    reorder: bg.ActionState;
  };
};

export interface GetWorkout {
  execute(workoutId: VO.WorkoutIdType, userId: Auth.VO.UserIdType): Promise<WorkoutGetResponse | null>;
}
