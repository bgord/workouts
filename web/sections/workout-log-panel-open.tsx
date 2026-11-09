import * as bg from "@bgord/ui";
import { useLogPanel } from "../hooks/use-log-panel";
import { PanelBottomOpen } from "../icons";
import { workoutRoute } from "../router";

export function WorkoutLogPanelOpen() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();
  const { available, open } = useLogPanel();

  const exercise = available.find((exercise) => exercise.id === workout.progress.next);

  if (!exercise) return null;

  return (
    <div data-md-basis="0" data-md-grow="1" data-stack="y">
      <button className="c-button" data-variant="primary" onClick={() => open(exercise.id)} type="button">
        <PanelBottomOpen data-size="sm" />
        {t("workout.log_panel.open")}
      </button>
    </div>
  );
}
