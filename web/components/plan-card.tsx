import { Link } from "@tanstack/react-router";
import type { PlanSummary } from "../../modules/plans/value-objects/plan-summary";
import { PlanStatusBadge } from "./plan-status-badge";

export function PlanCard(props: { plan: PlanSummary }) {
  return (
    <li className="c-card" data-cross="center" data-gap="3" data-main="between" data-stack="x">
      <Link
        className="c-card-title"
        data-grow="1"
        data-hover-color="brand-300"
        data-transform="truncate"
        params={{ planId: props.plan.id }}
        title={props.plan.name}
        to="/plans/$planId"
      >
        {props.plan.name}
      </Link>

      <PlanStatusBadge status={props.plan.status} />
    </li>
  );
}
