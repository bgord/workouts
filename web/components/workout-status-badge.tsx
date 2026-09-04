import { useTranslations } from "@bgord/ui";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";

type Color = React.JSX.IntrinsicElements["div"]["data-color"];
type Background = React.JSX.IntrinsicElements["div"]["data-bg"];

const color: Record<WorkoutStatusEnum, Color> = {
  [WorkoutStatusEnum.initial]: "neutral-300",
  [WorkoutStatusEnum.draft]: "warning-300",
  [WorkoutStatusEnum.in_progress]: "brand-200",
  [WorkoutStatusEnum.completed]: "positive-200",
  [WorkoutStatusEnum.abandoned]: "neutral-400",
};

const background: Record<WorkoutStatusEnum, Background> = {
  [WorkoutStatusEnum.initial]: "neutral-700",
  [WorkoutStatusEnum.draft]: "warning-900",
  [WorkoutStatusEnum.in_progress]: "brand-900",
  [WorkoutStatusEnum.completed]: "positive-900",
  [WorkoutStatusEnum.abandoned]: "neutral-800",
};

const label: Record<WorkoutStatusEnum, string> = {
  [WorkoutStatusEnum.initial]: "workout.status.initial",
  [WorkoutStatusEnum.draft]: "workout.status.draft",
  [WorkoutStatusEnum.in_progress]: "workout.status.in_progress",
  [WorkoutStatusEnum.completed]: "workout.status.completed",
  [WorkoutStatusEnum.abandoned]: "workout.status.abandoned",
};

export function WorkoutStatusBadge(props: { status: WorkoutStatusEnum }) {
  const t = useTranslations();

  return (
    <div
      className="c-badge"
      data-bg={background[props.status]}
      data-color={color[props.status]}
      data-variant="primary"
    >
      {t(label[props.status])}
    </div>
  );
}
