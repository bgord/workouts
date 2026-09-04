import { Link } from "@tanstack/react-router";
import type { PlanSummary } from "../../modules/plans/value-objects/plan-summary";
import { PlanStatusBadge } from "./plan-status-badge";

export function PlanCard(props: { plan: PlanSummary }) {
  return (
    <li
      className="rail"
      data-bc="neutral-800"
      data-bg="neutral-800"
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-cross="center"
      data-gap="3"
      data-hover-bc="neutral-700"
      data-hover-shadow="md"
      data-main="between"
      data-overflow="hidden"
      data-p="4"
      data-pl="5"
      data-position="relative"
      data-shadow="sm"
      data-stack="x"
    >
      <Link
        data-color="neutral-0"
        data-focus-ring="neutral"
        data-fs="base"
        data-fw="bold"
        data-hover-color="brand-300"
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
