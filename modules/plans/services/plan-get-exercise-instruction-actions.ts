import { ActionState } from "+action-state";
import type * as Queries from "+plans/queries";
import type * as VO from "+plans/value-objects";
import { PlanIsEditable } from "../invariants/plan-is-editable";

type PlanGetExerciseInstructionActionsFacts = { status: VO.PlanStatusEnum };

export class PlanGetExerciseInstructionActions {
  constructor(private readonly facts: PlanGetExerciseInstructionActionsFacts) {}

  calculate(): Queries.ExerciseInstructionActions {
    const editable = PlanIsEditable.passes({ status: this.facts.status });

    return {
      update: ActionState.of(editable),
      exerciseChange: ActionState.of(editable),
      move: ActionState.of(editable),
      remove: ActionState.of(editable),
    };
  }
}
