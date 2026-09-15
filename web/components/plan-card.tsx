import { useLanguage, useTranslations } from "@bgord/ui";
import { Layers } from "lucide-react";
import type { PlanSummary } from "../../modules/plans/value-objects/plan-summary";
import { DateFormat } from "../services/date-format";
import { PlanStatusBadge } from "./plan-status-badge";
import { RowBody, RowChevron, RowLink, RowMeta, RowTitle } from "./row";

export function PlanCard(props: PlanSummary) {
  const t = useTranslations();
  const language = useLanguage();

  return (
    <RowLink params={{ planId: props.id }} title={props.name} to="/plans/$planId">
      <RowBody>
        <RowTitle>{props.name}</RowTitle>

        {props.description && <RowMeta data-color="neutral-300">{props.description}</RowMeta>}

        <RowMeta data-cross="center" data-gap="3" data-stack="x">
          <div data-cross="center" data-gap="1" data-stack="x" title={t("plan.sections")}>
            <Layers data-size="xs" />
            <span data-transform="font-variant-numeric">{props.sections}</span>
          </div>

          <div data-transform="truncate">
            {t("plan.updated_at", {
              date: DateFormat.day(language, DateFormat.zoned(props.updatedAt)),
            })}
          </div>
        </RowMeta>
      </RowBody>

      <PlanStatusBadge status={props.status} />

      <RowChevron />
    </RowLink>
  );
}
