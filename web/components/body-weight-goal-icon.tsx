import { BodyWeightGoalOptions } from "../../modules/measurements/value-objects/body-weight-goal-options";
import { Minus, TrendingDown, TrendingUp } from "../icons";

const icons = {
  [BodyWeightGoalOptions.bulk]: TrendingUp,
  [BodyWeightGoalOptions.cut]: TrendingDown,
  [BodyWeightGoalOptions.maintain]: Minus,
};

export function BodyWeightGoalIcon(props: { goal: BodyWeightGoalOptions; size?: "xs" | "sm" }) {
  const Icon = icons[props.goal];

  return <Icon data-size={props.size ?? "sm"} />;
}
