import { useLanguage } from "@bgord/ui";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { WorkoutStatusBadge } from "./workout-status-badge";

export function WorkoutCard(props: { workout: WorkoutSummary }) {
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
        <div data-fw="medium" data-maxw="100%" data-transform="truncate" title={props.workout.planName}>
          {props.workout.planName}
        </div>

        <div data-color="neutral-500" data-fs="sm">
          {scheduledFor}
        </div>
      </div>

      <WorkoutStatusBadge status={props.workout.status} />
    </li>
  );
}
