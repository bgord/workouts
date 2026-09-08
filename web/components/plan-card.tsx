import { Link } from "@tanstack/react-router";
import type { PlanSummary } from "../../modules/plans/value-objects/plan-summary";
import { PlanStatusBadge } from "./plan-status-badge";

export function PlanCard(props: PlanSummary) {
  return (
    <li className="c-card" data-cross="center" data-gap="3" data-main="between" data-stack="x">
      <Link
        className="c-card-title"
        data-grow="1"
        data-hover-color="brand-300"
        data-transform="truncate"
        params={{ planId: props.id }}
        title={props.name}
        to="/plans/$planId"
      >
        {props.name}
      </Link>

      <PlanStatusBadge status={props.status} />
    </li>
  );
}
