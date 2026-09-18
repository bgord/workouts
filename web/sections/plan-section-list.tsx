import { planRoute } from "../router";
import { PlanSectionCreate } from "./plan-section-create";
import { PlanSectionItem } from "./plan-section-item";

export function PlanSectionList() {
  const { plan } = planRoute.useLoaderData();

  return (
    <div data-stack="y">
      <ul data-stack="y">
        {plan.data.sections.map((section, index) => (
          <PlanSectionItem
            index={index}
            key={section.id}
            last={index === plan.data.sections.length - 1 && !plan.actions.sectionCreate.available}
            section={section}
          />
        ))}
      </ul>

      <PlanSectionCreate />
    </div>
  );
}
