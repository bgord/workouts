import { Triangle } from "lucide-react";
import { BodyWeightGoalOptions } from "../../modules/measurements/value-objects/body-weight-goal-options";
import { WeightFormat } from "../services/weight-format";
import { Gap } from "./gap";

const color = (positive: boolean, goal: BodyWeightGoalOptions | undefined) => {
  if (goal === BodyWeightGoalOptions.maintain) return "neutral-300";
  if (goal === BodyWeightGoalOptions.cut) return positive ? "danger-400" : "positive-400";
  return positive ? "positive-400" : "danger-400";
};

export function WeightDelta(
  props: {
    current: number;
    previous: number | undefined;
    goal?: BodyWeightGoalOptions;
    decimals?: number;
  } & React.JSX.IntrinsicElements["span"],
) {
  const { previous, current, goal, decimals, ...rest } = props;

  if (previous === undefined) return null;

  const difference = current - previous;

  if (difference === 0) return null;

  const positive = difference > 0;

  return (
    <span
      data-color={color(positive, goal)}
      data-cross="center"
      data-stack="x"
      data-transform="nowrap"
      data-wrap="nowrap"
      {...Gap.inline}
      {...rest}
    >
      <Triangle
        data-mt={positive ? "0" : "0-5"}
        data-rotate={positive ? "0" : "180"}
        fill="currentColor"
        size={9}
        strokeWidth={0}
      />

      {WeightFormat.kilograms(Math.abs(difference), decimals)}

      {" kg"}
    </span>
  );
}
