import * as tools from "@bgord/tools";
import * as bg from "@bgord/bun";
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
      finalize: bg.ActionState.of(editable, [
        bg.ActionBlocker.from(PlanHasSections, { planSections: this.facts.sections }),
        bg.ActionBlocker.from(PlanHasNoEmptySections, { planSections: this.facts.sections }),
      ]),
      rename: bg.ActionState.of(editable),
      descriptionSet: bg.ActionState.of(editable),
      editingEnable: bg.ActionState.of(PlanIsFinalized.passes({ status: this.facts.status })),
      archive: bg.ActionState.of(PlanIsArchivable.passes({ status: this.facts.status })),
      restore: bg.ActionState.of(PlanIsRestorable.passes({ status: this.facts.status }), [
        bg.ActionBlocker.from(PlanLimitForOwner, { count: this.facts.activeCount }),
      ]),
      remove: bg.ActionState.of(PlanIsRemovable.passes({ status: this.facts.status })),
      sectionCreate: bg.ActionState.of(editable, [
        bg.ActionBlocker.from(PlanSectionLimitForPlan, {
          count: tools.Int.nonNegative(this.facts.sections.length),
        }),
      ]),
      sectionRename: bg.ActionState.of(editable),
      sectionWarmupSet: bg.ActionState.of(editable),
      sectionCooldownSet: bg.ActionState.of(editable),
      sectionRemove: bg.ActionState.of(editable),
    };
  }
}
