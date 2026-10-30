import * as bg from "@bgord/ui";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WorkoutComplete } from "./workout-complete";
import { WorkoutLogPanelOpen } from "./workout-log-panel-open";
import { WorkoutStart } from "./workout-start";

export function WorkoutStatus() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const { logged, total } = workout.progress;

  const panel = [
    {
      action: workout.actions.start,
      id: "workout-start-hint",
      tone: "outline" as const,
      label: t("workout.status.draft"),
      progress: t("workout.progress.exercises", { count: total }),
    },
    {
      action: workout.actions.complete,
      id: "workout-complete-hint",
      tone: "brand" as const,
      label: t("workout.status.in_progress"),
      progress: t("workout.progress.logged", {
        logged,
        count: total,
      }),
    },
  ].find(({ action }) => action.available);

  if (!panel) return null;

  return (
    <ui.StatusPanel>
      <ui.StatusPanelSummary>
        <ui.StatusPanelDot tone={panel.tone} />

        <ui.StatusPanelText>
          <ui.StatusPanelLabel>{panel.label}</ui.StatusPanelLabel>

          {panel.action.hints[0] ? (
            <ui.ActionHint {...panel.action} icon={false} id={panel.id} />
          ) : (
            <ui.StatusPanelDescription>{panel.progress}</ui.StatusPanelDescription>
          )}
        </ui.StatusPanelText>
      </ui.StatusPanelSummary>

      <ui.StatusPanelAction>
        <WorkoutStart />

        <WorkoutLogPanelOpen />

        <WorkoutComplete />
      </ui.StatusPanelAction>
    </ui.StatusPanel>
  );
}
