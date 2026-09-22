import * as tools from "@bgord/tools";
import { ActionBlocker, ActionState } from "+action-state";
import type * as Queries from "+plans/queries";
import type * as VO from "+plans/value-objects";
import { PlanHasNoEmptySections } from "../invariants/plan-has-no-empty-sections";
import { PlanHasSections } from "../invariants/plan-has-sections";
import { PlanIsArchivable } from "../invariants/plan-is-archivable";
import { PlanIsEditable } from "../invariants/plan-is-editable";
import { PlanIsFinalized } from "../invariants/plan-is-finalized";
import { PlanIsRemovable } from "../invariants/plan-is-removable";
import { PlanIsRestorable } from "../invariants/plan-is-restorable";
import { PlanLimitForOwner } from "../invariants/plan-limit-for-owner";
import { PlanSectionLimitForPlan } from "../invariants/plan-section-limit-for-plan";

type PlanGetActionsFacts = {
  status: VO.PlanStatusEnum;
  sections: ReadonlyArray<VO.PlanSectionWithExercises>;
  activeCount: tools.IntegerNonNegativeType;
};

export class PlanGetActions {
  constructor(private readonly facts: PlanGetActionsFacts) {}

  calculate(): Queries.PlanGetResponse["actions"] {
    const editable = PlanIsEditable.passes({ status: this.facts.status });

    return {
      finalize: ActionState.of(editable, [
        ActionBlocker.from(PlanHasSections, { planSections: this.facts.sections }),
        ActionBlocker.from(PlanHasNoEmptySections, { planSections: this.facts.sections }),
      ]),
      rename: ActionState.of(editable),
      descriptionSet: ActionState.of(editable),
      editingEnable: ActionState.of(PlanIsFinalized.passes({ status: this.facts.status })),
      archive: ActionState.of(PlanIsArchivable.passes({ status: this.facts.status })),
      restore: ActionState.of(PlanIsRestorable.passes({ status: this.facts.status }), [
        ActionBlocker.from(PlanLimitForOwner, { count: this.facts.activeCount }),
      ]),
      remove: ActionState.of(PlanIsRemovable.passes({ status: this.facts.status })),
      sectionCreate: ActionState.of(editable, [
        ActionBlocker.from(PlanSectionLimitForPlan, {
          count: tools.Int.nonNegative(this.facts.sections.length),
        }),
      ]),
      sectionRename: ActionState.of(editable),
      sectionWarmupSet: ActionState.of(editable),
      sectionCooldownSet: ActionState.of(editable),
      sectionRemove: ActionState.of(editable),
    };
  }
}
