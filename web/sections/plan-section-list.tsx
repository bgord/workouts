import { useTranslations } from "@bgord/ui";
import type { PlanGetResponse } from "../../modules/plans/queries/get-plan";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { PlanSectionExerciseInstructionLimitMax } from "../../modules/plans/value-objects/plan-section-exercise-instruction-limit";
import { PlanSectionLimitForPlanMax } from "../../modules/plans/value-objects/plan-section-limit-for-plan";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
import { PlanSectionCreate } from "./plan-section-create";
import { PlanSectionExerciseInstructionAdd } from "./plan-section-exercise-instruction-add";
import { PlanSectionExerciseInstructionList } from "./plan-section-exercise-instruction-list";
import { PlanSectionRemove } from "./plan-section-remove";
import { PlanSectionRename } from "./plan-section-rename";

export function PlanSectionList(props: Plan & { actions: PlanGetResponse["actions"] }) {
  const t = useTranslations();

  const editable = props.status === PlanStatusEnum.draft;

  return (
    <div data-gap="3" data-stack="y">
      <div data-cross="baseline" data-gap="2" data-stack="x">
        <h2
          data-color="neutral-300"
          data-fs="xs"
          data-fw="bold"
          data-lh="none"
          data-ls="widest"
          data-transform="uppercase"
        >
          {t("plan.section.list.header")}
        </h2>

        <div data-color="neutral-400" data-fs="sm">
          {t("plan.section.list.count", {
            count: props.sections.length,
            max: PlanSectionLimitForPlanMax,
          })}
        </div>

        {props.actions.sectionCreate.enabled && (
          <div data-ml="auto">
            <PlanSectionCreate {...props} />
          </div>
        )}
      </div>

      {props.actions.sectionCreate.hints.map((hint) => (
        <div data-color="neutral-400" data-fs="sm" key={hint}>
          {t(hint)}
        </div>
      ))}

      {props.sections.length === 0 && <div data-color="neutral-400">{t("plan.section.list.empty")}</div>}

      <ul data-gap="5" data-stack="y">
        {props.sections.map((section) => (
          <li className="c-card" data-gap="3" data-p="4" key={section.id}>
            <div data-cross="center" data-gap="3" data-stack="x">
              {props.actions.sectionRename.enabled && <PlanSectionRename plan={props} section={section} />}

              {!editable && (
                <div
                  className="c-card-title"
                  data-transform="truncate"
                  style={{ minInlineSize: 0 }}
                  title={section.name}
                >
                  {section.name}
                </div>
              )}

              {editable && <PlanSectionRemove plan={props} section={section} />}
            </div>

            <PlanSectionExerciseInstructionList plan={props} section={section} />

            {editable && section.exerciseInstructions.length < PlanSectionExerciseInstructionLimitMax && (
              <PlanSectionExerciseInstructionAdd plan={props} section={section} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
