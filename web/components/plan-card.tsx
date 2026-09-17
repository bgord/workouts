import { useLanguage, useTranslations } from "@bgord/ui";
import { Layers } from "lucide-react";
import type { PlanSummary } from "../../modules/plans/value-objects/plan-summary";
import { DateFormat } from "../services/date-format";
import { Meta } from "./meta";
import { PlanStatusBadge } from "./plan-status-badge";
import { RowBody, RowChevron, RowLink, RowTitle } from "./row";
import { Spacing } from "./spacing";

export function PlanCard(props: PlanSummary) {
  const t = useTranslations();
  const language = useLanguage();

  return (
    <RowLink params={{ planId: props.id }} title={props.name} to="/plans/$planId">
      <RowBody>
        <RowTitle>{props.name}</RowTitle>

        {props.description && (
          <Meta data-color="neutral-300" truncate>
            {props.description}
          </Meta>
        )}

        <Meta data-cross="center" data-stack="x" truncate {...Spacing.related}>
          <div data-cross="center" data-stack="x" title={t("plan.sections")} {...Spacing.inline}>
            <Layers data-size="xs" />
            {props.sections}
          </div>

          {t("plan.updated_at", { date: DateFormat.day(language, DateFormat.zoned(props.updatedAt)) })}
        </Meta>
      </RowBody>

      <PlanStatusBadge status={props.status} />

      <RowChevron />
    </RowLink>
  );
}
