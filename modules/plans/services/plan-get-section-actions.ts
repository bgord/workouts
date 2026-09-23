import * as bg from "@bgord/bun";
import type * as Queries from "+plans/queries";
import type * as VO from "+plans/value-objects";
import { PlanIsEditable } from "../invariants/plan-is-editable";
import { PlanSectionExerciseInstructionLimit } from "../invariants/plan-section-exercise-instruction-limit";

type PlanGetSectionActionsFacts = {
  status: VO.PlanStatusEnum;
  section: VO.PlanSectionWithExercises;
};

export class PlanGetSectionActions {
  constructor(private readonly facts: PlanGetSectionActionsFacts) {}

  calculate(): Queries.PlanSectionActions {
    return {
      exerciseInstructionAdd: bg.ActionState.of(PlanIsEditable.passes({ status: this.facts.status }), [
        bg.ActionBlocker.from(PlanSectionExerciseInstructionLimit, { planSection: this.facts.section }),
      ]),
    };
  }
}
