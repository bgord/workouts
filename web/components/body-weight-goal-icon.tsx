import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { BodyWeightGoalOptions } from "../../modules/measurements/value-objects/body-weight-goal-options";

const icons = {
  [BodyWeightGoalOptions.bulk]: TrendingUp,
  [BodyWeightGoalOptions.cut]: TrendingDown,
  [BodyWeightGoalOptions.maintain]: Minus,
};

export function BodyWeightGoalIcon(props: { goal: BodyWeightGoalOptions; size?: "xs" | "sm" }) {
  const Icon = icons[props.goal];

  return <Icon data-size={props.size ?? "sm"} />;
}
