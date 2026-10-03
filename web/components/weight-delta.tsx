import * as bg from "@bgord/ui";
import { BodyWeightGoalOptions } from "../../modules/measurements/value-objects/body-weight-goal-options";
import { WeightFormat } from "../services/weight-format";
import { Delta } from "./delta";

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
  const language = bg.useLanguage();
  const { goal, decimals, ...rest } = props;

  return (
    <Delta
      format={(difference) => `${WeightFormat.kilograms(difference, decimals).toLocaleString(language)} kg`}
      tone={(positive) => color(positive, goal)}
      {...rest}
    />
  );
}
