import * as bg from "@bgord/ui";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
import type { BadgeVariant } from "./badge-variant";

const variant: Record<PlanStatusEnum, BadgeVariant> = {
  [PlanStatusEnum.initial]: "outline",
  [PlanStatusEnum.draft]: "outline",
  [PlanStatusEnum.finalized]: "positive",
  [PlanStatusEnum.archived]: "outline",
  [PlanStatusEnum.removed]: "outline",
};

export function PlanStatusBadge(props: { status: PlanStatusEnum } & React.JSX.IntrinsicElements["div"]) {
  const { status, ...rest } = props;
  const t = bg.useTranslations();

  return (
    <div className="c-badge" data-variant={variant[status]} {...rest}>
      {t(`plan.status.${status}`)}
    </div>
  );
}
