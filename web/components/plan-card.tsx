import * as bg from "@bgord/ui";
import { Layers } from "lucide-react";
import type { PlanSummary } from "../../modules/plans/value-objects/plan-summary";
import { DateFormat } from "../services/date-format";
import { Gap } from "./gap";
import { Meta } from "./meta";
import { PlanStatusBadge } from "./plan-status-badge";
import { RowBody, RowChevron, RowLink, RowTitle } from "./row";

export function PlanCard(props: PlanSummary) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <RowLink params={{ planId: props.id }} title={props.name} to="/plans/$planId">
      <RowBody>
        <RowTitle>{props.name}</RowTitle>

        {props.description && (
          <Meta data-color="neutral-300" truncate>
            {props.description}
          </Meta>
        )}

        <Meta data-cross="center" data-stack="x" data-wrap="wrap" truncate {...Gap.related}>
          <div data-cross="center" data-stack="x" title={t("plan.sections")} {...Gap.inline}>
            <Layers data-size="xs" />
            {props.sections}
          </div>

          {t("plan.updated_at", { date: DateFormat.day(language, props.updatedAt) })}
        </Meta>
      </RowBody>

      <PlanStatusBadge status={props.status} />

      <RowChevron />
    </RowLink>
  );
}
