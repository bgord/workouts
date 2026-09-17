import * as bg from "@bgord/ui";
import type { PlanGetResponse } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
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
        <ui.HairlineBlock data-stack="y" first={props.sections.length === 0} last {...ui.Spacing.row}>
          <PlanSectionCreate action={props.actions.sectionCreate} {...props} />

          {props.sections.length === 0 && <ui.Meta>{t("plan.section.list.empty.hint")}</ui.Meta>}
        </ui.HairlineBlock>
      )}
    </div>
  );
}
