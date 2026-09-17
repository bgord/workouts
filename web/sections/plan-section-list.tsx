import * as bg from "@bgord/ui";
import type { PlanGetResponse } from "../../modules/plans/queries/get-plan";
import { PlanSectionCreate } from "./plan-section-create";
import { PlanSectionItem } from "./plan-section-item";

export function PlanSectionList(props: PlanGetResponse["data"] & { actions: PlanGetResponse["actions"] }) {
  const t = bg.useTranslations();

  return (
    <div data-stack="y">
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
