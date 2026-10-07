import * as bg from "@bgord/ui";
import { Layers } from "lucide-react";
import type { PlanSummary } from "../../modules/plans/value-objects/plan-summary";
import { DateTime } from "./date-time";
import { Gap } from "./gap";
import { PlanStatusBadge } from "./plan-status-badge";
import { RowBody, RowChevron, RowLink, RowTitle } from "./row";

export function PlanCard(props: PlanSummary) {
  const t = bg.useTranslations();

  return (
    <RowLink params={{ planId: props.id }} title={props.name} to="/plans/$planId">
      <RowBody>
        <RowTitle>{props.name}</RowTitle>

        {props.description && (
          <div data-color="neutral-300" data-fs="xs" data-transform="truncate">
            {props.description}
          </div>
        )}

        <small data-stack="x" data-transform="truncate" data-wrap="wrap" {...Gap.related}>
          <span data-stack="x" title={t("plan.sections")} {...Gap.inline}>
            <Layers data-size="xs" />
            {props.sections}
          </span>

          <span>
            {t("plan.updated_at")} <DateTime format="ago" value={props.updatedAt} />
          </span>
        </small>
      </RowBody>

      <PlanStatusBadge status={props.status} />

      <RowChevron />
    </RowLink>
  );
}
