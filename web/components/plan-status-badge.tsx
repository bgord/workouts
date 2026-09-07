import { useTranslations } from "@bgord/ui";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";

type Variant = "primary" | "outline" | "positive" | "danger";

const variant: Record<PlanStatusEnum, Variant> = {
  [PlanStatusEnum.initial]: "primary",
  [PlanStatusEnum.draft]: "primary",
  [PlanStatusEnum.finalized]: "positive",
  [PlanStatusEnum.archived]: "outline",
  [PlanStatusEnum.removed]: "outline",
};

const label: Record<PlanStatusEnum, string> = {
  [PlanStatusEnum.initial]: "plan.status.initial",
  [PlanStatusEnum.draft]: "plan.status.draft",
  [PlanStatusEnum.finalized]: "plan.status.finalized",
  [PlanStatusEnum.archived]: "plan.status.archived",
  [PlanStatusEnum.removed]: "plan.status.removed",
};

export function PlanStatusBadge(props: { status: PlanStatusEnum } & React.JSX.IntrinsicElements["div"]) {
  const { status, ...rest } = props;
  const t = useTranslations();

  return (
    <div className="c-badge" data-variant={variant[status]} {...rest}>
      {t(label[status])}
    </div>
  );
}
