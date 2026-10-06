import * as bg from "@bgord/ui";
import { PanelBottomOpen } from "lucide-react";
import { useLogPanel } from "../hooks/use-log-panel";
import { workoutRoute } from "../router";

export function WorkoutLogPanelOpen() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();
  const { available, open } = useLogPanel();

  const exercise = available.find((exercise) => exercise.id === workout.progress.next);

  if (!exercise) return null;

  return (
    <button
      className="c-button"
      data-md-basis="0"
      data-md-grow="1"
      data-variant="primary"
      onClick={() => open(exercise.id)}
      type="button"
    >
      <PanelBottomOpen data-size="sm" />
      {t("workout.log_panel.open")}
    </button>
  );
}
