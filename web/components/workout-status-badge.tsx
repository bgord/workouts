import { useTranslations } from "@bgord/ui";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";

type Variant = "primary" | "outline" | "positive" | "danger";

const variant: Record<WorkoutStatusEnum, Variant> = {
  [WorkoutStatusEnum.initial]: "primary",
  [WorkoutStatusEnum.draft]: "primary",
  [WorkoutStatusEnum.in_progress]: "primary",
  [WorkoutStatusEnum.completed]: "positive",
  [WorkoutStatusEnum.abandoned]: "outline",
  [WorkoutStatusEnum.discarded]: "outline",
};

const label: Record<WorkoutStatusEnum, string> = {
  [WorkoutStatusEnum.initial]: "workout.status.initial",
  [WorkoutStatusEnum.draft]: "workout.status.draft",
  [WorkoutStatusEnum.in_progress]: "workout.status.in_progress",
  [WorkoutStatusEnum.completed]: "workout.status.completed",
  [WorkoutStatusEnum.abandoned]: "workout.status.abandoned",
  [WorkoutStatusEnum.discarded]: "workout.status.discarded",
};

export function WorkoutStatusBadge(
  props: { status: WorkoutStatusEnum } & React.JSX.IntrinsicElements["div"],
) {
  const { status, ...rest } = props;
  const t = useTranslations();

  return (
    <div className="c-badge" data-variant={variant[status]} {...rest}>
      {t(label[status])}
    </div>
  );
}
