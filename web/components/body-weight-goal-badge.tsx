import { useTranslations } from "@bgord/ui";
import { BodyWeightGoalOptions } from "../../modules/measurements/value-objects/body-weight-goal-options";
import { BodyWeightGoalIcon } from "./body-weight-goal-icon";

type Variant = "primary" | "outline" | "positive" | "danger";

const variant: Record<BodyWeightGoalOptions, Variant> = {
  [BodyWeightGoalOptions.bulk]: "positive",
  [BodyWeightGoalOptions.cut]: "danger",
  [BodyWeightGoalOptions.maintain]: "outline",
};

export function BodyWeightGoalBadge(props: { goal: BodyWeightGoalOptions }) {
  const t = useTranslations();

  return (
    <span className="c-badge" data-cross="center" data-gap="1" data-variant={variant[props.goal]}>
      <BodyWeightGoalIcon goal={props.goal} size="xs" />
      {t(`measurements.body_weight.goal.${props.goal}`)}
    </span>
  );
}
