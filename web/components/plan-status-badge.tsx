import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";

type Color = React.JSX.IntrinsicElements["div"]["data-color"];
type Background = React.JSX.IntrinsicElements["div"]["data-bg"];

const color: Record<PlanStatusEnum, Color> = {
  [PlanStatusEnum.initial]: "neutral-300",
  [PlanStatusEnum.draft]: "warning-300",
  [PlanStatusEnum.finalized]: "positive-200",
  [PlanStatusEnum.archived]: "neutral-400",
};

const background: Record<PlanStatusEnum, Background> = {
  [PlanStatusEnum.initial]: "neutral-700",
  [PlanStatusEnum.draft]: "warning-900",
  [PlanStatusEnum.finalized]: "positive-900",
  [PlanStatusEnum.archived]: "neutral-800",
};

export function PlanStatusBadge(props: { status: PlanStatusEnum }) {
  return (
    <div
      className="c-badge"
      data-bg={background[props.status]}
      data-color={color[props.status]}
      data-variant="primary"
    >
      {props.status}
    </div>
  );
}
