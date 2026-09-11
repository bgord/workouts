import * as bg from "@bgord/ui";
import { Dumbbell, Layers, LayoutList } from "lucide-react";
import type { PlanGetResponse } from "../../modules/plans/queries/get-plan";
import { PlanSectionLimitForPlanMax } from "../../modules/plans/value-objects/plan-section-limit-for-plan";
import { PlanSectionCreate } from "./plan-section-create";
import { PlanSectionExerciseInstructionAdd } from "./plan-section-exercise-instruction-add";
import { PlanSectionExerciseInstructionList } from "./plan-section-exercise-instruction-list";
import { PlanSectionRemove } from "./plan-section-remove";
import { PlanSectionRename } from "./plan-section-rename";

export function PlanSectionList(props: PlanGetResponse["data"] & { actions: PlanGetResponse["actions"] }) {
  const t = bg.useTranslations();

  return (
    <div data-gap="3" data-stack="y">
      <div
        data-cross="center"
        data-gap="3"
        data-stack="x"
        data-wrap="wrap"
        {...bg.Rhythm().times(3).style.minHeight}
      >
        <div
          data-color="neutral-500"
          data-cross="center"
          data-fs="sm"
          data-gap="1-5"
          data-grow="1"
          data-stack="x"
          title={t("plan.section.list.header")}
        >
          <Layers data-size="xs" />

          <span data-transform="font-variant-numeric">
            {t("plan.section.list.count", {
              count: props.sections.length,
              max: PlanSectionLimitForPlanMax,
            })}
          </span>
        </div>

        {props.actions.sectionCreate.available && (
          <PlanSectionCreate action={props.actions.sectionCreate} {...props} />
        )}
      </div>

      {props.sections.length === 0 && (
        <div
          className="c-card"
          data-cross="center"
          data-gap="1"
          data-py="8"
          data-stack="y"
          data-variant="flat"
        >
          <LayoutList data-color="neutral-600" data-size="md" />

          <div data-color="neutral-300" data-fs="sm" data-mt="2">
            {t("plan.section.list.empty")}
          </div>

          <div data-color="neutral-500" data-fs="xs">
            {t("plan.section.list.empty.hint")}
          </div>
        </div>
      )}

      <ul data-gap="3" data-stack="y">
        {props.sections.map((section) => (
          <li className="c-card" data-gap="3" data-md-p="2-5" data-p="4" key={section.id}>
            <div data-cross="center" data-gap="3" data-stack="x">
              <div data-grow="1" data-transform="truncate">
                {props.actions.sectionRename.available && (
                  <PlanSectionRename plan={props} section={section} />
                )}

                {!props.actions.sectionRename.available && (
                  <div className="c-card-title" data-transform="truncate" title={section.name}>
                    {section.name}
                  </div>
                )}
              </div>

              <div
                data-color="neutral-500"
                data-cross="center"
                data-fs="xs"
                data-gap="1"
                data-stack="x"
                title={t("plan.section.exercises")}
              >
                <Dumbbell data-size="xs" />
                <span data-transform="font-variant-numeric">{section.exerciseInstructions.length}</span>
              </div>

              {props.actions.sectionRemove.available && <PlanSectionRemove plan={props} section={section} />}
            </div>

            <div data-gap="0" data-stack="y">
              <PlanSectionExerciseInstructionList plan={props} section={section} />

              {section.actions.exerciseInstructionAdd.available && (
                <PlanSectionExerciseInstructionAdd
                  action={section.actions.exerciseInstructionAdd}
                  plan={props}
                  section={section}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
