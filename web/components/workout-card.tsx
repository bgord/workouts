import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { DateFormat } from "../../app/services/date-format";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { WorkoutStatusBadge } from "./workout-status-badge";

export function WorkoutCard(props: { workout: WorkoutSummary; children?: React.ReactNode }) {
  const t = useTranslations();
  const language = useLanguage();

  const title = t("workout.title", {
    plan: props.workout.planName,
    section: props.workout.planSectionName,
  });

  const scheduledFor = DateFormat.dayWithWeekday(
    language,
    Temporal.PlainDate.from(props.workout.scheduledFor),
  );

  const completed = props.workout.completedAt ? DateFormat.zoned(props.workout.completedAt) : undefined;

  const completedOnScheduledDay =
    completed && completed.toPlainDate().equals(Temporal.PlainDate.from(props.workout.scheduledFor));

  const subtitle = !completed
    ? scheduledFor
    : completedOnScheduledDay
      ? t("workout.list.completed_at", { date: scheduledFor, time: DateFormat.time(language, completed) })
      : t("workout.list.completed_on", {
          date: scheduledFor,
          completed: DateFormat.dayWithTime(language, completed),
        });

  return (
    <li className="c-card" data-cross="center" data-gap="3" data-main="between" data-stack="x">
      <div className="c-card-header" data-grow="1">
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
