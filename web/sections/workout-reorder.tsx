import * as bg from "@bgord/ui";
import { ArrowUpDown, Check } from "lucide-react";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutReorder(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  if (!workout.actions.reorder.available) return null;

  return (
    <ui.MenuItem onClick={props.toggle}>
      {props.on ? <Check data-size="sm" /> : <ArrowUpDown data-size="sm" />}
      {props.on ? t("workout.exercise.reorder.stop.title") : t("workout.exercise.reorder.start.title")}
    </ui.MenuItem>
  );
}
