import { useLanguage } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { WorkoutStatusBadge } from "./workout-status-badge";

export function WorkoutCard(props: { workout: WorkoutSummary; children?: React.ReactNode }) {
  const language = useLanguage();

  const scheduledFor = Temporal.PlainDate.from(props.workout.scheduledFor).toLocaleString(language, {
    day: "numeric",
    month: "short",
    weekday: "short",
    year: "numeric",
  });

  return (
    <li
      data-bc="neutral-700"
      data-bg="neutral-800"
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-cross="center"
      data-gap="3"
      data-main="between"
      data-p="4"
      data-stack="x"
    >
      <div data-gap="1" data-maxw="100%" data-stack="y">
        <Link
          className="c-link"
          data-maxw="100%"
          data-transform="truncate"
          params={{ workoutId: props.workout.id }}
          title={props.workout.planName}
          to="/workouts/$workoutId"
        >
          {props.workout.planName}
        </Link>

        <div data-color="neutral-500" data-fs="sm">
          {scheduledFor}
        </div>
      </div>

      <div data-cross="center" data-gap="3" data-stack="x">
        <WorkoutStatusBadge status={props.workout.status} />

        {props.children}
      </div>
    </li>
  );
}
