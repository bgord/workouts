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

        {props.workout.scheduledFor && !props.workout.completedAt && (
          <div className="c-card-description">{t("workout.list.scheduled_for", { date: scheduledFor })}</div>
        )}

        {props.workout.completedAt && (
          <div className="c-card-description">
            {t("workout.list.completed_at", {
              date: scheduledFor,
              time: DateFormat.time(language, DateFormat.zoned(props.workout.completedAt)),
            })}
          </div>
        )}
      </div>

      <div data-cross="center" data-gap="3" data-stack="x">
        <WorkoutStatusBadge status={props.workout.status} />

        {props.children}
      </div>
    </li>
  );
}
