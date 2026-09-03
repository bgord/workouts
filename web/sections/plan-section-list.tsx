import { useTranslations } from "@bgord/ui";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { PlanSectionLimitForPlanMax } from "../../modules/plans/value-objects/plan-section-limit-for-plan";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
import { PlanSectionCreate } from "./plan-section-create";
import { PlanSectionRename } from "./plan-section-rename";

export function PlanSectionList(props: Plan) {
  const t = useTranslations();

  const editable = props.status === PlanStatusEnum.draft;
  const full = props.sections.length >= PlanSectionLimitForPlanMax;

  return (
    <div data-gap="3" data-stack="y">
      <div data-cross="center" data-gap="3" data-stack="x">
        <h2 data-color="neutral-300" data-fs="base">
          {t("plan.section.list.header")}
        </h2>

        <div data-color="neutral-500" data-fs="sm">
          {t("plan.section.list.count", {
            count: props.sections.length,
            max: PlanSectionLimitForPlanMax,
          })}
        </div>

        {editable && !full && <PlanSectionCreate {...props} />}
      </div>

      {props.sections.length === 0 && <div data-color="neutral-500">{t("plan.section.list.empty")}</div>}

      <ul data-gap="3" data-stack="y">
        {props.sections.map((section) => (
          <li
            data-bc="neutral-700"
            data-bg="neutral-800"
            data-br="md"
            data-bs="solid"
            data-bw="hairline"
            data-cross="center"
            data-gap="3"
            data-p="3"
            data-stack="x"
            key={section.id}
          >
            {editable && <PlanSectionRename plan={props} section={section} />}

            {!editable && (
              <div data-maxw="100%" data-transform="truncate" title={section.name}>
                {section.name}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
