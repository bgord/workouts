import * as bg from "@bgord/ui";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { DateFormat } from "../services/date-format";
import { RowBody, RowChevron, RowLink, RowTitle } from "./row";
import { WorkoutStatusBadge } from "./workout-status-badge";

export function WorkoutCard(props: WorkoutSummary) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  const scheduledFor = DateFormat.dayWithWeekday(language, props.scheduledFor);

  return (
    <RowLink
      params={{ workoutId: props.id }}
      search={(prev) => ({ section: prev.section, filter: prev.filter })}
      to="/workouts/$workoutId"
      variant={props.status === "completed" ? "muted" : "default"}
    >
      <RowBody>
        <RowTitle>{t("workout.title", { plan: props.planName, section: props.planSectionName })}</RowTitle>

        <small data-transform="truncate">{scheduledFor}</small>
      </RowBody>

      <WorkoutStatusBadge status={props.status} />

      <RowChevron />
    </RowLink>
  );
}
