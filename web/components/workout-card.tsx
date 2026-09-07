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
    <li className="c-card" data-cross="center" data-gap="3" data-main="between" data-stack="x">
      <div className="c-card-header" data-grow="1" style={{ minInlineSize: 0 }}>
        <Link
          className="c-card-title"
          data-hover-color="brand-300"
          data-transform="truncate"
          params={{ workoutId: props.workout.id }}
          search={(prev) => ({ section: prev.section })}
          title={title}
          to="/workouts/$workoutId"
        >
          {title}
        </Link>

        <div className="c-card-description">{subtitle}</div>
      </div>

      <div data-cross="center" data-gap="3" data-stack="x">
        <WorkoutStatusBadge status={props.workout.status} />

        {props.children}
      </div>
    </li>
  );
}
