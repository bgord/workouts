import * as bg from "@bgord/ui";
import type { PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { PlanSectionCooldown } from "./plan-section-cooldown";
import { PlanSectionExerciseInstructionAdd } from "./plan-section-exercise-instruction-add";
import { PlanSectionExerciseInstructionList } from "./plan-section-exercise-instruction-list";
import { PlanSectionRemove } from "./plan-section-remove";
import { PlanSectionRename } from "./plan-section-rename";
import { PlanSectionWarmup } from "./plan-section-warmup";

export function PlanSectionItem(props: { section: PlanSection; index: number; last: boolean }) {
  const t = bg.useTranslations();
  const pluralize = bg.usePluralize();

  const planSectionVisibility = usePersistedToggle({ name: `plan-section-${props.section.id}` });
  const planSectionRename = bg.useToggle({ name: `plan-section-rename-${props.section.id}` });

  return (
    <ui.HairlineRow data-stack="y" first={props.index === 0} last={props.last} {...ui.Spacing.row}>
      <div
        data-cross="center"
        data-stack="x"
        data-wrap="nowrap"
        {...bg.Rhythm().times(3).style.minHeight}
        {...ui.Gap.related}
      >
        <ui.ChevronToggle {...planSectionVisibility} />

        <div data-grow="1" data-minw="0">
          <PlanSectionRename section={props.section} {...planSectionRename} />
        </div>

        {planSectionRename.off && (
          <ui.Meta data-shrink="0">
            {props.section.exerciseInstructions.length === 0
              ? t("plan.section.exercise.list.empty")
              : t("plan.section.exercise.count", {
                  count: props.section.exerciseInstructions.length,
                  noun: pluralize({
                    value: props.section.exerciseInstructions.length,
                    singular: t("plan.section.exercise.noun.singular"),
                    plural: t("plan.section.exercise.noun.plural"),
                    genitive: t("plan.section.exercise.noun.genitive"),
                  }),
                })}
          </ui.Meta>
        )}
        {planSectionRename.off && <PlanSectionRemove {...props.section} />}
      </div>

      {planSectionVisibility.on && (
        <div data-stack="y" {...ui.Spacing.inset} {...planSectionVisibility.props.target}>
          <PlanSectionWarmup section={props.section} />

          <PlanSectionExerciseInstructionList {...props.section} />

          <PlanSectionExerciseInstructionAdd {...props.section} />

          <PlanSectionCooldown section={props.section} />
        </div>
      )}
    </ui.HairlineRow>
  );
}
