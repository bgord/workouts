import * as bg from "@bgord/ui";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { RowBody, RowChevron, RowLink, RowTitle } from "./row";
import { WorkoutStatusBadge } from "./workout-status-badge";

export function WorkoutCard(props: WorkoutSummary) {
  const t = bg.useTranslations();

  return (
    <RowLink
      data-testid={`workout-${props.id}`}
      params={{ workoutId: props.id }}
      search={(prev) => ({ section: prev.section, filter: prev.filter })}
      to="/workouts/$workoutId"
      variant={props.status === WorkoutStatusEnum.completed ? "muted" : "default"}
    >
      <RowBody>
        <RowTitle>{t("workout.title", { plan: props.planName, section: props.planSectionName })}</RowTitle>

        <small data-transform="truncate">
          <bg.DateTime format="relativeDay" value={props.scheduledFor} />
        </small>
      </RowBody>

      <WorkoutStatusBadge status={props.status} />

      <RowChevron />
    </RowLink>
  );
}
