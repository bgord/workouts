import { Link } from "@tanstack/react-router";
import type { PlanSummary } from "../../modules/plans/value-objects/plan-summary";
import { PlanStatusBadge } from "../components";

export function PlanCard(props: { plan: PlanSummary }) {
  return (
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
    >
      <Link
        className="c-link"
        data-maxw="100%"
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
