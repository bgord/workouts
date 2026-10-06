import * as bg from "@bgord/ui";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import type { BadgeVariant } from "./badge-variant";

const variant: Record<WorkoutStatusEnum, BadgeVariant> = {
  [WorkoutStatusEnum.initial]: "outline",
  [WorkoutStatusEnum.draft]: "outline",
  [WorkoutStatusEnum.in_progress]: "primary",
  [WorkoutStatusEnum.completed]: "positive",
  [WorkoutStatusEnum.discarded]: "outline",
};

export function WorkoutStatusBadge(
  props: { status: WorkoutStatusEnum } & React.JSX.IntrinsicElements["div"],
) {
  const { status, ...rest } = props;
  const t = bg.useTranslations();

  return (
    <div className="c-badge" data-variant={variant[status]} {...rest}>
      {t(`workout.status.${status}`)}
    </div>
  );
}
