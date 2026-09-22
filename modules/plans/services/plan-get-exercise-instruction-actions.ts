import * as v from "valibot";
import { ActionBlocker, ActionState } from "+action-state";
import type * as Queries from "+plans/queries";
import * as VO from "+plans/value-objects";
import { PlanIsEditable } from "../invariants/plan-is-editable";
import { PlanSectionExerciseInstructionPositionHasChanged } from "../invariants/plan-section-exercise-instruction-position-has-changed";
import { PlanSectionExerciseInstructionPositionInRange } from "../invariants/plan-section-exercise-instruction-position-in-range";

type PlanGetExerciseInstructionActionsFacts = {
  status: VO.PlanStatusEnum;
  section: VO.PlanSectionWithExercises;
  exerciseInstructionId: VO.ExerciseInstructionIdType;
};

export class PlanGetExerciseInstructionActions {
  constructor(private readonly facts: PlanGetExerciseInstructionActionsFacts) {}

  calculate(): Queries.ExerciseInstructionActions {
    const editable = PlanIsEditable.passes({ status: this.facts.status });

    const current = this.facts.section.exerciseInstructions.findIndex(
      (exerciseInstruction) => exerciseInstruction.id === this.facts.exerciseInstructionId,
    );

    return {
      update: ActionState.of(editable),
      exerciseChange: ActionState.of(editable),
      moveUp: ActionState.of(editable, [
        ActionBlocker.from(PlanSectionExerciseInstructionPositionHasChanged, {
          planSection: this.facts.section,
          exerciseInstructionId: this.facts.exerciseInstructionId,
          position: v.parse(VO.ExerciseInstructionPosition, Math.max(current - 1, 0)),
        }),
      ]),
      moveDown: ActionState.of(editable, [
        ActionBlocker.from(PlanSectionExerciseInstructionPositionInRange, {
          planSection: this.facts.section,
          position: v.parse(VO.ExerciseInstructionPosition, current + 1),
        }),
      ]),
      remove: ActionState.of(editable),
    };
  }
}
