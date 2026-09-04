import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { WorkoutStatusBadge } from "./workout-status-badge";

export function WorkoutCard(props: { workout: WorkoutSummary; children?: React.ReactNode }) {
  const t = useTranslations();
  const language = useLanguage();

  const title = t("workout.title", {
    plan: props.workout.planName,
    section: props.workout.planSectionName,
  });

  const scheduledFor = Temporal.PlainDate.from(props.workout.scheduledFor).toLocaleString(language, {
    day: "numeric",
    month: "short",
    weekday: "short",
    year: "numeric",
  });

  const completedAt = props.workout.completedAt
    ? Temporal.Instant.fromEpochMilliseconds(props.workout.completedAt).toLocaleString(language, {
        hour: "2-digit",
        hour12: false,
        minute: "2-digit",
      })
    : undefined;

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
          title={title}
          to="/workouts/$workoutId"
        >
          {title}
        </Link>

        <div data-color="neutral-500" data-fs="sm">
          {completedAt
            ? t("workout.list.completed_at", { date: scheduledFor, time: completedAt })
            : scheduledFor}
        </div>
      </div>

      <div data-cross="center" data-gap="3" data-stack="x">
        <WorkoutStatusBadge status={props.workout.status} />

        {props.children}
      </div>
    </li>
  );
}
