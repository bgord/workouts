import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { DateFormat } from "../../app/services/date-format";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { WorkoutStatusBadge } from "./workout-status-badge";

export function WorkoutCard(props: WorkoutSummary) {
  const t = useTranslations();
  const language = useLanguage();

  const scheduledFor = DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(props.scheduledFor));

  return (
    <li className="c-card" data-cross="center" data-gap="3" data-main="between" data-stack="x">
      <div className="c-card-header" data-grow="1">
        <Link
          className="c-card-title"
          data-hover-color="brand-300"
          data-transform="truncate"
          params={{ workoutId: props.id }}
          search={(prev) => ({ section: prev.section })}
          to="/workouts/$workoutId"
        >
          {t("workout.title", { plan: props.planName, section: props.planSectionName })}
        </Link>

        {props.scheduledFor && !props.completedAt && (
          <div className="c-card-description">{t("workout.list.scheduled_for", { date: scheduledFor })}</div>
        )}

        {props.completedAt && (
          <div className="c-card-description">
            {t("workout.list.completed_at", {
              date: scheduledFor,
              time: DateFormat.time(language, DateFormat.zoned(props.completedAt)),
            })}
          </div>
        )}
      </div>

      <WorkoutStatusBadge status={props.status} />
    </li>
  );
}
