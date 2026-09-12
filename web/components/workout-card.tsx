import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { DateFormat } from "../services/date-format";
import { WorkoutStatusBadge } from "./workout-status-badge";

export function WorkoutCard(props: WorkoutSummary) {
  const t = useTranslations();
  const language = useLanguage();

  const scheduledFor = DateFormat.dayWithWeekday(language, new Date(props.scheduledFor));

  return (
    <li>
      <Link
        className="c-card"
        data-cross="center"
        data-gap="3"
        data-hover-bc="brand-500"
        data-opacity={props.status === "completed" ? "high" : "full"}
        data-p="4"
        data-stack="x"
        params={{ workoutId: props.id }}
        search={(prev) => ({ section: prev.section })}
        to="/workouts/$workoutId"
      >
        <div data-gap="1" data-grow="1" data-stack="y" data-transform="truncate">
          <div className="c-card-title" data-transform="truncate">
            {t("workout.title", { plan: props.planName, section: props.planSectionName })}
          </div>

          <div data-color="neutral-500" data-fs="xs" data-transform="truncate">
            {props.completedAt
              ? t("workout.list.completed_at", {
                  date: scheduledFor,
                  time: DateFormat.time(language, DateFormat.zoned(props.completedAt)),
                })
              : t("workout.list.scheduled_for", { date: scheduledFor })}
          </div>
        </div>

        <WorkoutStatusBadge status={props.status} />

        <ChevronRight data-color="neutral-600" data-size="sm" />
      </Link>
    </li>
  );
}
