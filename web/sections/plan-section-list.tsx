import { useTranslations } from "@bgord/ui";
import type { PlanGetResponse } from "../../modules/plans/queries/get-plan";
import { PlanSectionLimitForPlanMax } from "../../modules/plans/value-objects/plan-section-limit-for-plan";
import { PlanSectionCreate } from "./plan-section-create";
import { PlanSectionExerciseInstructionAdd } from "./plan-section-exercise-instruction-add";
import { PlanSectionExerciseInstructionList } from "./plan-section-exercise-instruction-list";
import { PlanSectionRemove } from "./plan-section-remove";
import { PlanSectionRename } from "./plan-section-rename";

export function PlanSectionList(props: PlanGetResponse["data"] & { actions: PlanGetResponse["actions"] }) {
  const t = useTranslations();

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

        {props.actions.sectionCreate.available && (
          <div data-ml="auto">
            <PlanSectionCreate action={props.actions.sectionCreate} {...props} />
          </div>
        )}
      </div>

      {props.sections.length === 0 && <div data-color="neutral-400">{t("plan.section.list.empty")}</div>}

      <ul data-gap="5" data-stack="y">
        {props.sections.map((section) => (
          <li className="c-card" data-gap="3" data-p="4" key={section.id}>
            <div data-cross="center" data-gap="3" data-stack="x">
              {props.actions.sectionRename.available && <PlanSectionRename plan={props} section={section} />}

              {!props.actions.sectionRename.available && (
                <div className="c-card-title" data-transform="truncate" title={section.name}>
                  {section.name}
                </div>
              )}

              {props.actions.sectionRemove.available && <PlanSectionRemove plan={props} section={section} />}
            </div>

            <PlanSectionExerciseInstructionList plan={props} section={section} />

            {section.actions.exerciseInstructionAdd.available && (
              <PlanSectionExerciseInstructionAdd
                action={section.actions.exerciseInstructionAdd}
                plan={props}
                section={section}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
