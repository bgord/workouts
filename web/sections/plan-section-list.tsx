import * as bg from "@bgord/ui";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { PlanGetResponse, PlanSection } from "../../modules/plans/queries/get-plan";
import { PlanSectionCreate } from "./plan-section-create";
import { PlanSectionExerciseInstructionAdd } from "./plan-section-exercise-instruction-add";
import { PlanSectionExerciseInstructionList } from "./plan-section-exercise-instruction-list";
import { PlanSectionRemove } from "./plan-section-remove";
import { PlanSectionRename } from "./plan-section-rename";

export function PlanSectionList(props: PlanGetResponse["data"] & { actions: PlanGetResponse["actions"] }) {
  const t = bg.useTranslations();

  return (
    <div data-mt="3" data-stack="y">
      <ul data-stack="y">
        {props.sections.map((section, index) => (
          <PlanSectionItem
            actions={props.actions}
            index={index}
            key={section.id}
            last={index === props.sections.length - 1 && !props.actions.sectionCreate.available}
            plan={props}
            section={section}
          />
        ))}
      </ul>

      {props.actions.sectionCreate.available && (
        <div
          data-bct={props.sections.length === 0 ? undefined : "alpha-soft"}
          data-bst={props.sections.length === 0 ? undefined : "solid"}
          data-bwt={props.sections.length === 0 ? undefined : "hairline"}
          data-gap="2"
          data-pt={props.sections.length === 0 ? undefined : "4"}
          data-stack="y"
        >
          <PlanSectionCreate action={props.actions.sectionCreate} {...props} />

          {props.sections.length === 0 && (
            <div data-color="neutral-500" data-fs="xs">
              {t("plan.section.list.empty.hint")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlanSectionItem(props: {
  plan: PlanGetResponse["data"];
  section: PlanSection;
  actions: PlanGetResponse["actions"];
  index: number;
  last: boolean;
}) {
  const t = bg.useTranslations();
  const pluralize = bg.usePluralize();
  const { plan, section, actions, index, last } = props;
  const open = bg.useToggle({ name: `plan-section-${section.id}` });

  return (
    <li
      data-bct={index === 0 ? undefined : "alpha-soft"}
      data-bst={index === 0 ? undefined : "solid"}
      data-bwt={index === 0 ? undefined : "hairline"}
      data-gap="2"
      data-pb={last ? undefined : "4"}
      data-pt={index === 0 ? undefined : "4"}
      data-stack="y"
    >
      <div data-cross="center" data-gap="2" data-stack="x" data-wrap="nowrap">
        <button
          aria-label={open.on ? t("plan.section.collapse") : t("plan.section.expand")}
          data-color="neutral-400"
          data-cursor="pointer"
          data-hover-color="neutral-0"
          data-md-p="1"
          data-p="2-5"
          data-shrink="0"
          data-stack="x"
          onClick={open.toggle}
          title={open.on ? t("plan.section.collapse") : t("plan.section.expand")}
          type="button"
          {...open.props.controller}
        >
          {open.on ? <ChevronDown data-size="sm" /> : <ChevronRight data-size="sm" />}
        </button>

        <div data-grow="1" data-transform="truncate">
          {actions.sectionRename.available && <PlanSectionRename plan={plan} section={section} />}

          {!actions.sectionRename.available && (
            <div className="c-card-title" data-transform="truncate" title={section.name}>
              {section.name}
            </div>
          )}
        </div>

        <div data-color="neutral-500" data-fs="xs" data-shrink="0" data-transform="font-variant-numeric">
          {section.exerciseInstructions.length === 0
            ? t("plan.section.exercise.list.empty")
            : t("plan.section.exercise.count", {
                count: section.exerciseInstructions.length,
                noun: pluralize({
                  value: section.exerciseInstructions.length,
                  singular: t("plan.section.exercise.noun.singular"),
                  plural: t("plan.section.exercise.noun.plural"),
                  genitive: t("plan.section.exercise.noun.genitive"),
                }),
              })}
        </div>

        {actions.sectionRemove.available && <PlanSectionRemove plan={plan} section={section} />}
      </div>

      {open.on && (
        <div data-gap="0" data-stack="y" {...open.props.target}>
          <PlanSectionExerciseInstructionList plan={plan} section={section} />

          {section.actions.exerciseInstructionAdd.available && (
            <PlanSectionExerciseInstructionAdd
              action={section.actions.exerciseInstructionAdd}
              plan={plan}
              section={section}
            />
          )}
        </div>
      )}
    </li>
  );
}
