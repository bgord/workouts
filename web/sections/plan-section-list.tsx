import { useTranslations } from "@bgord/ui";
import type { Plan } from "../../modules/plans/value-objects/plan";

export function PlanSectionList(props: Plan) {
  const t = useTranslations();

  return (
    <div data-gap="3" data-stack="y">
      <h2 data-color="neutral-300" data-fs="base">
        {t("plan.section.list.header")}
      </h2>

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
            <div data-maxw="100%" data-transform="truncate" title={section.name}>
              {section.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
