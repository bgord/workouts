import { ActionState } from "+action-state";
import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";
import { WorkoutIsDraft } from "../invariants/workout-is-draft";
import { WorkoutIsEditable } from "../invariants/workout-is-editable";
import { WorkoutIsInProgress } from "../invariants/workout-is-in-progress";

type WorkoutGetExerciseActionsFacts = {
  status: VO.WorkoutStatusEnum;
  exercise: Pick<VO.WorkoutExercise, "target">;
};

export class WorkoutGetExerciseActions {
  constructor(private readonly facts: WorkoutGetExerciseActionsFacts) {}

  calculate(): Queries.WorkoutExerciseActions {
    const draft = WorkoutIsDraft.passes({ status: this.facts.status });
    const editable = WorkoutIsEditable.passes({ status: this.facts.status });
    const inProgress = WorkoutIsInProgress.passes({ status: this.facts.status });

    return {
      targetSet: ActionState.of(draft || (inProgress && this.facts.exercise.target === undefined)),
      remove: ActionState.of(editable),
      move: ActionState.of(editable),
      setLog: ActionState.of(inProgress),
    };
  }
}
