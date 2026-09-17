import * as bg from "@bgord/ui";
import type { PlanGetResponse, PlanSection } from "../../modules/plans/queries/get-plan";
import { ChevronToggle, HairlineRow, Meta } from "../components";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { PlanSectionExerciseInstructionAdd } from "./plan-section-exercise-instruction-add";
import { PlanSectionExerciseInstructionList } from "./plan-section-exercise-instruction-list";
import { PlanSectionRemove } from "./plan-section-remove";
import { PlanSectionRename } from "./plan-section-rename";

export function PlanSectionItem(props: {
  plan: PlanGetResponse["data"];
  section: PlanSection;
  actions: PlanGetResponse["actions"];
  index: number;
  last: boolean;
}) {
  const t = bg.useTranslations();
  const pluralize = bg.usePluralize();
  const { plan, section, actions, index, last } = props;

  const planSectionVisibility = usePersistedToggle({ name: `plan-section-${section.id}` });
  const planSectionRename = bg.useToggle({ name: `plan-section-rename-${section.id}` });

  return (
    <HairlineRow
      data-gap="2"
      data-pb={last ? undefined : "4"}
      data-pt={index === 0 ? undefined : "4"}
      data-stack="y"
      first={index === 0}
    >
      <div
        data-cross="center"
        data-gap="2"
        data-stack="x"
        data-wrap="nowrap"
        {...bg.Rhythm().times(3).style.minHeight}
      >
        <ChevronToggle {...planSectionVisibility} />
        <div data-grow="1" data-transform="truncate">
          {actions.sectionRename.available && (
            <PlanSectionRename plan={plan} section={section} {...planSectionRename} />
          )}

          {!actions.sectionRename.available && (
            <div className="c-card-title" data-transform="truncate" title={section.name}>
              {section.name}
            </div>
          )}
        </div>
        {planSectionRename.off && (
          <Meta data-shrink="0">
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
          </Meta>
        )}
        {actions.sectionRemove.available && planSectionRename.off && (
          <PlanSectionRemove plan={plan} section={section} />
        )}
      </div>

      {planSectionVisibility.on && (
        <div data-gap="0" data-stack="y" {...planSectionVisibility.props.target}>
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
    </HairlineRow>
  );
}
