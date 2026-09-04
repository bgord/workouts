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

  const completed = props.workout.completedAt
    ? Temporal.Instant.fromEpochMilliseconds(props.workout.completedAt).toZonedDateTimeISO(
        Temporal.Now.timeZoneId(),
      )
    : undefined;

  const completedOnScheduledDay =
    completed && completed.toPlainDate().equals(Temporal.PlainDate.from(props.workout.scheduledFor));

  const subtitle = !completed
    ? scheduledFor
    : completedOnScheduledDay
      ? t("workout.list.completed_at", {
          date: scheduledFor,
          time: completed.toLocaleString(language, { hour: "2-digit", hour12: false, minute: "2-digit" }),
        })
      : t("workout.list.completed_on", {
          date: scheduledFor,
          completed: completed.toLocaleString(language, {
            day: "numeric",
            hour: "2-digit",
            hour12: false,
            minute: "2-digit",
            month: "short",
          }),
        });

  return (
    <li
      className="rail"
      data-bc="neutral-800"
      data-bg="neutral-800"
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-cross="center"
      data-gap="3"
      data-hover-bc="neutral-700"
      data-hover-shadow="md"
      data-main="between"
      data-overflow="hidden"
      data-p="4"
      data-pl="5"
      data-position="relative"
      data-shadow="sm"
      data-stack="x"
    >
      <div data-gap="1" data-maxw="100%" data-stack="y">
        <Link
          data-color="neutral-0"
          data-focus-ring="neutral"
          data-fs="base"
          data-fw="bold"
          data-hover-color="brand-300"
          data-maxw="100%"
          data-transform="truncate"
          params={{ workoutId: props.workout.id }}
          search={(prev) => ({ section: prev.section })}
          title={title}
          to="/workouts/$workoutId"
        >
          {title}
        </Link>

        <div data-color="neutral-500" data-fs="sm">
          {subtitle}
        </div>
      </div>

      <div data-cross="center" data-gap="3" data-stack="x">
        <WorkoutStatusBadge status={props.workout.status} />

        {props.children}
      </div>
    </li>
  );
}
