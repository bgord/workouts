import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Layers } from "lucide-react";
import type { PlanSummary } from "../../modules/plans/value-objects/plan-summary";
import { DateFormat } from "../services/date-format";
import { PlanStatusBadge } from "./plan-status-badge";

export function PlanCard(props: PlanSummary) {
  const t = useTranslations();
  const language = useLanguage();

  return (
    <li>
      <Link
        className="c-card"
        data-cross="center"
        data-gap="3"
        data-hover-bc="brand-500"
        data-p="4"
        data-stack="x"
        params={{ planId: props.id }}
        title={props.name}
        to="/plans/$planId"
      >
        <div data-gap="1" data-grow="1" data-stack="y" data-transform="truncate">
          <div className="c-card-title" data-transform="truncate">
            {props.name}
          </div>

          <div data-color="neutral-500" data-cross="center" data-fs="xs" data-gap="3" data-stack="x">
            <div data-cross="center" data-gap="1" data-stack="x" title={t("plan.sections")}>
              <Layers data-size="xs" />
              <span data-transform="font-variant-numeric">{props.sections}</span>
            </div>

            <div data-transform="truncate">
              {t("plan.updated_at", {
                date: DateFormat.day(language, DateFormat.zoned(props.updatedAt)),
              })}
            </div>
          </div>
        </div>

        <PlanStatusBadge status={props.status} />

        <ChevronRight data-color="neutral-600" data-size="sm" />
      </Link>
    </li>
  );
}
