import * as v from "valibot";
import { ActionBlocker, ActionState } from "+action-state";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";
import { WorkoutExercisePositionHasChanged } from "../invariants/workout-exercise-position-has-changed";
import { WorkoutExercisePositionInRange } from "../invariants/workout-exercise-position-in-range";
import { WorkoutIsDraft } from "../invariants/workout-is-draft";
import { WorkoutIsEditable } from "../invariants/workout-is-editable";
import { WorkoutIsInProgress } from "../invariants/workout-is-in-progress";

type WorkoutGetExerciseActionsFacts = {
  status: VO.WorkoutStatusEnum;
  exercises: Array<VO.WorkoutExercise>;
  exercise: Pick<VO.WorkoutExercise, "id" | "target">;
};

export class WorkoutGetExerciseActions {
  constructor(private readonly facts: WorkoutGetExerciseActionsFacts) {}

  calculate(): Queries.WorkoutExerciseActions {
    const draft = WorkoutIsDraft.passes({ status: this.facts.status });
    const editable = WorkoutIsEditable.passes({ status: this.facts.status });
    const inProgress = WorkoutIsInProgress.passes({ status: this.facts.status });

    const current = this.facts.exercises.findIndex((exercise) => exercise.id === this.facts.exercise.id);

    return {
      targetSet: ActionState.of(draft || (inProgress && this.facts.exercise.target === undefined)),
      remove: ActionState.of(editable),
      moveUp: ActionState.of(editable, [
        ActionBlocker.from(WorkoutExercisePositionHasChanged, {
          workoutExerciseId: this.facts.exercise.id,
          workoutExercises: this.facts.exercises,
          position: v.parse(VO.WorkoutExercisePosition, Math.max(current - 1, 0)),
        }),
      ]),
      moveDown: ActionState.of(editable, [
        ActionBlocker.from(WorkoutExercisePositionInRange, {
          workoutExercises: this.facts.exercises,
          position: v.parse(VO.WorkoutExercisePosition, current + 1),
        }),
      ]),
      setLog: ActionState.of(inProgress),
    };
  }
}
